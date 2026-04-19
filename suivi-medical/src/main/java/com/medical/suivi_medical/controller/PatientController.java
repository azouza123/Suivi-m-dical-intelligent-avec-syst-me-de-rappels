package com.medical.suivi_medical.controller;

import com.medical.suivi_medical.dto.PatientDTO;
import com.medical.suivi_medical.entity.User;
import com.medical.suivi_medical.enums.Role;
import com.medical.suivi_medical.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patient")
@RequiredArgsConstructor
public class PatientController {

    private final UserRepository userRepository;

    // GET /patient/doctor — get the first available doctor
    // In a real app you'd have a doctor-patient assignment table
    @GetMapping("/doctor")
    public ResponseEntity<PatientDTO> getDoctor(HttpServletRequest request) {
        User doctor = userRepository.findAll()
                .stream()
                .filter(u -> u.getRole() == Role.DOCTOR)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No doctor found"));

        PatientDTO dto = new PatientDTO();
        dto.setId(doctor.getId());
        dto.setName(doctor.getName());
        dto.setEmail(doctor.getEmail());
        dto.setRole(doctor.getRole().name());

        return ResponseEntity.ok(dto);
    }
}