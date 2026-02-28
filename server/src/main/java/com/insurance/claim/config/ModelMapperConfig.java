package com.insurance.claim.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.*;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
