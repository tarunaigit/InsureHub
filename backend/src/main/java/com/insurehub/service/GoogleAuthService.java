package com.insurehub.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.insurehub.dto.AuthDtos;
import com.insurehub.entity.Role;
import com.insurehub.entity.User;
import com.insurehub.exception.ApiException;
import com.insurehub.repository.UserRepository;
import com.insurehub.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.UUID;

@Service
public class GoogleAuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final String clientId;
    private final GoogleIdTokenVerifier verifier;

    public GoogleAuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt,
                             @Value("${app.google.client-id:}") String clientId) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
        this.clientId = clientId == null ? "" : clientId.trim();
        this.verifier = buildVerifier(this.clientId);
    }

    private GoogleIdTokenVerifier buildVerifier(String id) {
        if (id.isBlank()) return null;
        try {
            return new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(id))
                    .build();
        } catch (Exception e) {
            throw new IllegalStateException("Unable to initialise Google sign-in verifier", e);
        }
    }

    public AuthDtos.AuthResponse authenticate(String credential) {
        if (clientId.isBlank() || verifier == null) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "GOOGLE_NOT_CONFIGURED", "Google sign-in is not configured on the server.");
        }
        if (credential == null || credential.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "GOOGLE_CREDENTIAL_REQUIRED", "Google credential is required.");
        }
        try {
            GoogleIdToken token = verifier.verify(credential);
            if (token == null) {
                throw new ApiException(HttpStatus.UNAUTHORIZED, "GOOGLE_TOKEN_INVALID", "Google sign-in token is invalid or expired.");
            }
            GoogleIdToken.Payload payload = token.getPayload();
            String email = payload.getEmail();
            String name = payload.get("name") == null ? email : payload.get("name").toString();
            if (email == null || email.isBlank()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "GOOGLE_EMAIL_MISSING", "Google did not provide an email address.");
            }

            User user = users.findByEmailIgnoreCase(email).orElseGet(() -> {
                User u = new User();
                u.setName(name);
                u.setEmail(email);
                u.setRole(Role.CUSTOMER);
                u.setPasswordHash(encoder.encode(UUID.randomUUID().toString()));
                return users.save(u);
            });

            if (!user.isEnabled()) {
                throw new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_DISABLED", "This account is disabled.");
            }
            return new AuthDtos.AuthResponse(jwt.generate(user.getEmail(), user.getRole()), AuthService.toResponse(user));
        } catch (ApiException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "GOOGLE_AUTH_FAILED", "Unable to verify the Google account.");
        }
    }
}
