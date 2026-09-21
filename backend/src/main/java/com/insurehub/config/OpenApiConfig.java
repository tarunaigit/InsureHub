package com.insurehub.config;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class OpenApiConfig {
    @Bean public OpenAPI insureHubOpenAPI(){ return new OpenAPI().info(new Info().title("InsureHub Policy Management API").version("1.0.0").description("Role-based insurance policy lifecycle API. Premium calculation is a project simulation, not a real insurer underwriting formula.")); }
}
