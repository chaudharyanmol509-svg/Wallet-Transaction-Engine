package com.varunkumar.payment_ledger.controller;

import com.varunkumar.payment_ledger.dto.TransferRequest;
import com.varunkumar.payment_ledger.entity.Wallet;
import com.varunkumar.payment_ledger.entity.LedgerEntry;
import com.varunkumar.payment_ledger.repository.WalletRepository;
import com.varunkumar.payment_ledger.repository.LedgerEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private LedgerEntryRepository ledgerEntryRepository;

    // 1. Static path sabse upar
    @GetMapping("/history")
    public ResponseEntity<List<LedgerEntry>> getTransactionHistory() {
        return ResponseEntity.ok(ledgerEntryRepository.findAll());
    }

    // 2. Dynamic path iske niche
    @GetMapping("/{userId}")
    public ResponseEntity<Wallet> getWalletByUserId(@PathVariable Long userId) {
        return walletRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. POST method sabse niche
    @PostMapping("/transfer")
    @Transactional
    public String transferMoney(@RequestBody TransferRequest request) {
        Wallet fromWallet = walletRepository.findByUserId(request.getFromUserId())
                .orElseThrow(() -> new RuntimeException("Sender ka wallet nahi mila"));

        Wallet toWallet = walletRepository.findByUserId(request.getToUserId())
                .orElseThrow(() -> new RuntimeException("Receiver ka wallet nahi mila"));

        if (fromWallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Balance kam hai bhai!");
        }

        fromWallet.setBalance(fromWallet.getBalance().subtract(request.getAmount()));
        toWallet.setBalance(toWallet.getBalance().add(request.getAmount()));

        walletRepository.save(fromWallet);
        walletRepository.save(toWallet);

        LedgerEntry entry = new LedgerEntry();
        entry.setFromWalletId(fromWallet.getId());
        entry.setToWalletId(toWallet.getId());
        entry.setAmount(request.getAmount());

        ledgerEntryRepository.save(entry);

        return "Transfer successful!";
    }
}