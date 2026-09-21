package com.insurehub.service;

import com.insurehub.dto.AuthDtos;
import com.insurehub.dto.UserResponse;
import com.insurehub.entity.Role;
import com.insurehub.entity.User;
import com.insurehub.exception.ApiException;
import com.insurehub.repository.UserRepository;
import com.insurehub.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final AuthenticationManager manager;
    private final JwtService jwt;

    public AuthService(
            UserRepository users,
            PasswordEncoder encoder,
            AuthenticationManager manager,
            JwtService jwt
    ) {
        this.users = users;
        this.encoder = encoder;
        this.manager = manager;
        this.jwt = jwt;
    }

    public AuthDtos.AuthResponse register(
            AuthDtos.RegisterRequest r
    ) {

        if (users.existsByEmailIgnoreCase(r.email())) {

            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "EMAIL_EXISTS",
                    "An account with this email already exists."
            );
        }

        User u = new User();

        u.setName(
                r.name().trim()
        );

        u.setEmail(
                r.email()
        );

        u.setPhone(
                r.phone()
        );

        u.setRole(
                Role.CUSTOMER
        );

        u.setPasswordHash(
                encoder.encode(r.password())
        );

        /*
         * Every new customer starts with 0% discount.
         * Admin can later grant an eligible discount.
         */
        u.setEligibleDiscountPercent(
                java.math.BigDecimal.ZERO
        );

        users.save(u);

        return new AuthDtos.AuthResponse(
                jwt.generate(
                        u.getEmail(),
                        u.getRole()
                ),
                toResponse(u)
        );
    }

    public AuthDtos.AuthResponse login(
            AuthDtos.LoginRequest r
    ) {

        manager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        r.email(),
                        r.password()
                )
        );

        User u =
                users.findByEmailIgnoreCase(
                        r.email()
                ).orElseThrow();

        return new AuthDtos.AuthResponse(
                jwt.generate(
                        u.getEmail(),
                        u.getRole()
                ),
                toResponse(u)
        );
    }

    public UserResponse me(
            String email
    ) {

        return toResponse(
                users.findByEmailIgnoreCase(email)
                        .orElseThrow(() ->
                                new ApiException(
                                        HttpStatus.NOT_FOUND,
                                        "USER_NOT_FOUND",
                                        "User not found"
                                )
                        )
        );
    }

    public static UserResponse toResponse(
            User u
    ) {

        return new UserResponse(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getPhone(),
                u.getRole(),
                u.getCreatedAt(),
                u.getEligibleDiscountPercent()
        );
    }
}