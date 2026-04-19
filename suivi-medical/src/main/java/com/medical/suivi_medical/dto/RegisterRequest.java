package com.medical.suivi_medical.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    // role defaults to PATIENT on register
}