package com.insurehub.config;

import com.insurehub.entity.*;
import com.insurehub.repository.PlanRepository;
import com.insurehub.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {
    @Bean CommandLineRunner init(UserRepository users, PlanRepository plans, PasswordEncoder encoder){
        return args -> {
            if(!users.existsByEmailIgnoreCase("admin@insurehub.local")){ User a=new User();a.setName("InsureHub Admin");a.setEmail("admin@insurehub.local");a.setPasswordHash(encoder.encode("Admin@12345"));a.setRole(Role.ADMIN);users.save(a); }
            if(!users.existsByEmailIgnoreCase("demo@insurehub.local")){ User c=new User();c.setName("Demo Customer");c.setEmail("demo@insurehub.local");c.setPasswordHash(encoder.encode("Demo@12345"));c.setRole(Role.CUSTOMER);users.save(c); }
            if(plans.count()==0){
                add(plans,"Health Secure Plus","HEALTH","Individual/family health cover for planned and unexpected medical expenses.",500000,200000,2500000,10000,1);
                add(plans,"Auto Protect","VEHICLE","Motor cover with configurable vehicle coverage and policy duration.",750000,100000,5000000,8500,1);
                add(plans,"Life Shield","LIFE","Term-style life protection with flexible coverage ranges.",2500000,1000000,10000000,12500,1);
                add(plans,"Home Guard","HOME","Home protection for the structure and household assets.",1500000,500000,15000000,9000,1);
                add(plans,"Travel Plus","TRAVEL","Travel insurance for domestic and international trips.",1000000,100000,5000000,3500,1);
                add(plans,"Family Secure","FAMILY","Combined family protection plan with higher household coverage.",3000000,500000,20000000,14500,2);
            }
        };
    }
    private void add(PlanRepository r,String name,String type,String desc,int coverage,int min,int max,int premium,int years){ InsurancePlan p=new InsurancePlan();p.setName(name);p.setType(type);p.setDescription(desc);p.setCoverageAmount(BigDecimal.valueOf(coverage));p.setMinCoverageAmount(BigDecimal.valueOf(min));p.setMaxCoverageAmount(BigDecimal.valueOf(max));p.setBasePremium(BigDecimal.valueOf(premium));p.setDurationYears(years);p.setStatus(PlanStatus.ACTIVE);r.save(p); }
}
