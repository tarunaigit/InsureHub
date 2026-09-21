package com.insurehub.controller;

import com.insurehub.dto.QuoteDtos;
import com.insurehub.service.PremiumService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {

    private final PremiumService service;

    public QuoteController(
            PremiumService service
    ) {
        this.service = service;
    }

    @PreAuthorize(
            "hasAnyRole('CUSTOMER','ADMIN','AGENT')"
    )
    @PostMapping("/calculate")
    public QuoteDtos.QuoteResponse calculate(
            Authentication authentication,
            @Valid
            @RequestBody
            QuoteDtos.QuoteRequest request
    ) {

        return service.calculate(
                authentication.getName(),
                request
        );
    }
}