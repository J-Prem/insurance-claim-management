package com.insurance.claim.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI insuranceApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Insurance Claim Management API")
                        .description("Role-based Insurance Claim System")
                        .version("1.0"));
    }
}
