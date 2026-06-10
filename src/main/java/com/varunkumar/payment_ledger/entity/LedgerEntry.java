package com.varunkumar.payment_ledger.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor // Ye zaroori hai JPA ke liye
@AllArgsConstructor // Ye tumhare constructor error ko fix kar dega
public class LedgerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long walletId; // Transaction kis wallet se related hai
    private BigDecimal amount;
    private String type; // "DEBIT" ya "CREDIT"
    private LocalDateTime timestamp = LocalDateTime.now();

    // Custom constructor taaki Service layer mein object bana sako
    public LedgerEntry(Long walletId, BigDecimal amount, String type) {
        this.walletId = walletId;
        this.amount = amount;
        this.type = type;
        this.timestamp = LocalDateTime.now();
    }
}