package com.varunkumar.payment_ledger.dto;

import java.math.BigDecimal;

public class TransferRequest {
    private Long fromUserId;
    private Long toUserId;
    private BigDecimal amount;

    // Getters and Setters
    public Long getFromUserId() { return fromUserId; }
    public void setFromUserId(Long fromUserId) { this.fromUserId = fromUserId; }
    public Long getToUserId() { return toUserId; }
    public void setToUserId(Long toUserId) { this.toUserId = toUserId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}