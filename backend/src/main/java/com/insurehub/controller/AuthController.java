package com.insurehub.controller;
import com.insurehub.dto.AuthDtos;
import com.insurehub.dto.UserResponse;
import com.insurehub.service.AuthService;
import com.insurehub.service.GoogleAuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth; private final GoogleAuthService google;
    public AuthController(AuthService auth, GoogleAuthService google){this.auth=auth;this.google=google;}
    @PostMapping("/register") public AuthDtos.AuthResponse register(@Valid @RequestBody AuthDtos.RegisterRequest r){return auth.register(r);}
    @PostMapping("/login") public AuthDtos.AuthResponse login(@Valid @RequestBody AuthDtos.LoginRequest r){return auth.login(r);}
    @PostMapping("/google") public AuthDtos.AuthResponse google(@RequestBody AuthDtos.GoogleLoginRequest r){return google.authenticate(r.credential());}
    @GetMapping("/me") public UserResponse me(Authentication a){return auth.me(a.getName());}
}
