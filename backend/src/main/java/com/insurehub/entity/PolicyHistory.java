package com.insurehub.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "policy_history")
public class PolicyHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "policy_id") private Policy policy;
    @Column(nullable = false) private String action;
    @Column(nullable = false, length = 2000) private String description;
    @Column(nullable = false) private String performedBy;
    @Column(nullable = false) private LocalDateTime timestamp = LocalDateTime.now();
    public Long getId() { return id; }
    public Policy getPolicy() { return policy; }
    public String getAction() { return action; }
    public String getDescription() { return description; }
    public String getPerformedBy() { return performedBy; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setPolicy(Policy v) { policy = v; }
    public void setAction(String v) { action = v; }
    public void setDescription(String v) { description = v; }
    public void setPerformedBy(String v) { performedBy = v; }
}
