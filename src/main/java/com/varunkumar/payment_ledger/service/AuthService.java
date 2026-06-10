package com.varunkumar.payment_ledger.service;

import com.varunkumar.payment_ledger.repository.UserRepository;
import com.varunkumar.payment_ledger.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    public String authenticate(String username, String password) {
        // Log check karo ki username aa raha hai ya nahi
        System.out.println("Authenticating user: " + username);

        return userRepository.findByUsername(username)
                .map(user -> {
                    // Check password
                    if (user.getPassword().equals(password)) {
                        return jwtUtils.generateToken(username);
                    } else {
                        throw new RuntimeException("Invalid Password");
                    }
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}