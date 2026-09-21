package com.insurehub.controller;
import com.insurehub.dto.PolicyDtos;
import com.insurehub.service.*;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/policies")
public class PolicyController {
    private final PolicyService policies; private final RenewalService renewals; private final CancellationService cancellations;
    public PolicyController(PolicyService policies,RenewalService renewals,CancellationService cancellations){this.policies=policies;this.renewals=renewals;this.cancellations=cancellations;}
    @PostMapping public org.springframework.http.ResponseEntity<PolicyDtos.PolicyResponse> purchase(Authentication a,@Valid @RequestBody PolicyDtos.PurchasePolicyRequest r){return org.springframework.http.ResponseEntity.status(201).body(policies.purchase(a.getName(),r));}
    @GetMapping("/my") public java.util.List<PolicyDtos.PolicyResponse> mine(Authentication a){return policies.mine(a.getName());}
    @GetMapping("/{id}") public PolicyDtos.PolicyResponse get(Authentication a,@PathVariable Long id){return policies.get(id,a.getName(),a.getAuthorities().stream().anyMatch(x->x.getAuthority().equals("ROLE_ADMIN")));}
    @PostMapping("/{id}/renew") public PolicyDtos.PolicyResponse renew(Authentication a,@PathVariable Long id){return renewals.renew(id,a.getName());}
    @PostMapping("/{id}/cancel") public PolicyDtos.PolicyResponse cancel(Authentication a,@PathVariable Long id){return cancellations.request(id,a.getName());}
    @GetMapping("/{id}/history") public java.util.List<PolicyDtos.HistoryResponse> history(Authentication a,@PathVariable Long id){return policies.history(id,a.getName(),a.getAuthorities().stream().anyMatch(x->x.getAuthority().equals("ROLE_ADMIN")));}
}
