package com.smartbuild;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartBuildApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartBuildApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 SMART BUILD AI Backend is Running on Port 8080");
        System.out.println("API Documentation: http://localhost:8080/api/materials");
        System.out.println("=================================================");
    }
}
