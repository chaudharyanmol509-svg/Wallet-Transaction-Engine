package com.varunkumar.payment_ledger;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF disable kiya taaki Postman se request jaye
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Abhi sabhi endpoints public hain (testing ke liye)
                );
        return http.build();
    }
}