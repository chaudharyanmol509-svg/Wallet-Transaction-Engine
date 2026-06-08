package com.varunkumar.payment_ledger.repository;
import com.varunkumar.payment_ledger.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface UserRepository extends JpaRepository<User, Long> {
}
