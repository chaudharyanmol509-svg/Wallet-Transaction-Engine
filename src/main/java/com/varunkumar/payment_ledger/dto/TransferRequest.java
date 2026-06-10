package com.varunkumar.payment_ledger.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class TransferRequest {
    @NotNull(message = "Sender ID mandatory hai")
    private Long fromUserId;

    @NotNull(message = "Receiver ID mandatory hai")
    private Long toUserId;

    @NotNull(message = "Amount likhna zaroori hai")
    @Min(value = 1, message = "Amount kam se kam 1 hona chahiye")
    private BigDecimal amount;

    // Getters and Setters
    public Long getFromUserId() { return fromUserId; }
    public void setFromUserId(Long fromUserId) { this.fromUserId = fromUserId; }
    public Long getToUserId() { return toUserId; }
    public void setToUserId(Long toUserId) { this.toUserId = toUserId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}