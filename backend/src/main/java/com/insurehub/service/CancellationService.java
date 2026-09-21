package com.insurehub.service;

import com.insurehub.entity.Policy;
import com.insurehub.entity.PolicyStatus;
import com.insurehub.exception.InvalidPolicyStateException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CancellationService {
    private final PolicyService policyService;
    public CancellationService(PolicyService policyService){this.policyService=policyService;}
    @Transactional
    public com.insurehub.dto.PolicyDtos.PolicyResponse request(Long id,String email){
        Policy p=policyService.getEntity(id,email,false);
        if(p.getStatus()!=PolicyStatus.ACTIVE && p.getStatus()!=PolicyStatus.RENEWED && p.getStatus()!=PolicyStatus.EXPIRED) throw new InvalidPolicyStateException("Cancellation is not allowed for policy status "+p.getStatus()+".");
        p.setCancellationPreviousStatus(p.getStatus()); p.setStatus(PolicyStatus.CANCEL_REQUESTED); policyService.save(p);
        policyService.addHistory(p,"CANCELLATION_REQUESTED","Customer requested policy cancellation; awaiting admin review.",email);
        return policyService.map(p);
    }
    @Transactional
    public com.insurehub.dto.PolicyDtos.PolicyResponse approve(Long id,String adminEmail){
        Policy p=policyService.getEntity(id,adminEmail,true); if(p.getStatus()!=PolicyStatus.CANCEL_REQUESTED) throw new InvalidPolicyStateException("This policy has no pending cancellation request.");
        p.setStatus(PolicyStatus.CANCELLED); policyService.save(p); policyService.addHistory(p,"CANCELLATION_APPROVED","Cancellation approved by admin.",adminEmail); return policyService.map(p);
    }
    @Transactional
    public com.insurehub.dto.PolicyDtos.PolicyResponse reject(Long id,String adminEmail){
        Policy p=policyService.getEntity(id,adminEmail,true); if(p.getStatus()!=PolicyStatus.CANCEL_REQUESTED) throw new InvalidPolicyStateException("This policy has no pending cancellation request.");
        PolicyStatus restore=p.getCancellationPreviousStatus()==null?PolicyStatus.ACTIVE:p.getCancellationPreviousStatus(); p.setStatus(restore); p.setCancellationPreviousStatus(null); policyService.save(p); policyService.addHistory(p,"CANCELLATION_REJECTED","Cancellation request rejected by admin.",adminEmail); return policyService.map(p);
    }
}
