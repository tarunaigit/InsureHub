package com.insurehub.controller;
import com.insurehub.dto.PlanDtos;
import com.insurehub.service.PlanService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/plans")
public class PlanController {
    private final PlanService service; public PlanController(PlanService service){this.service=service;}
    @GetMapping public java.util.List<PlanDtos.PlanResponse> active(){return service.active();}
    @GetMapping("/{id}") public PlanDtos.PlanResponse get(@PathVariable Long id){return service.get(id);}
    @PreAuthorize("hasRole('ADMIN')") @PostMapping public PlanDtos.PlanResponse create(@Valid @RequestBody PlanDtos.PlanRequest r){return service.create(r);}
    @PreAuthorize("hasRole('ADMIN')") @PutMapping("/{id}") public PlanDtos.PlanResponse update(@PathVariable Long id,@Valid @RequestBody PlanDtos.PlanRequest r){return service.update(id,r);}
    @PreAuthorize("hasRole('ADMIN')") @DeleteMapping("/{id}") public PlanDtos.PlanResponse deactivate(@PathVariable Long id){return service.deactivate(id);}
}
