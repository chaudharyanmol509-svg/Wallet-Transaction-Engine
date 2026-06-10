package com.varunkumar.payment_ledger.controller;

import com.varunkumar.payment_ledger.dto.TransferRequest;
import com.varunkumar.payment_ledger.entity.Wallet;
import com.varunkumar.payment_ledger.entity.LedgerEntry;
import com.varunkumar.payment_ledger.exception.InsufficientBalanceException;
import com.varunkumar.payment_ledger.exception.WalletNotFoundException;
import com.varunkumar.payment_ledger.repository.WalletRepository;
import com.varunkumar.payment_ledger.repository.LedgerEntryRepository;
import jakarta.validation.Valid;
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
    public String transferMoney(@Valid @RequestBody TransferRequest request) {
        // 1. Sender & Receiver check
        Wallet fromWallet = walletRepository.findByUserId(request.getFromUserId())
                .orElseThrow(() -> new WalletNotFoundException("Sender wallet not found"));

        Wallet toWallet = walletRepository.findByUserId(request.getToUserId())
                .orElseThrow(() -> new WalletNotFoundException("Receiver wallet not found"));

        // 2. Balance check
        if (fromWallet.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance!");
        }

        // 3. Balance Update
        fromWallet.setBalance(fromWallet.getBalance().subtract(request.getAmount()));
        toWallet.setBalance(toWallet.getBalance().add(request.getAmount()));

        walletRepository.save(fromWallet);
        walletRepository.save(toWallet);

        // 4. Recording Double-Entry Ledger
        // Debit entry for sender
        LedgerEntry debit = new LedgerEntry(fromWallet.getId(), request.getAmount(), "DEBIT");
        ledgerEntryRepository.save(debit);

        // Credit entry for receiver
        LedgerEntry credit = new LedgerEntry(toWallet.getId(), request.getAmount(), "CREDIT");
        ledgerEntryRepository.save(credit);

        return "Transfer successful!";
    }
}