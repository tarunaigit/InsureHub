package com.insurehub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {}
    public record RegisterRequest(@NotBlank String name, @Email @NotBlank String email,
                                  @Size(min=8, max=100) String password, String phone) {}
    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
    public record GoogleLoginRequest(@NotBlank String credential) {}
    public record AuthResponse(String token, UserResponse user) {}
}
