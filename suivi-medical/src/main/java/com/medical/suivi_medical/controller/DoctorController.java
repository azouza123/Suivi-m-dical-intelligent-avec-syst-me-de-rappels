package com.medical.suivi_medical.controller;  // ← must match your project

import com.medical.suivi_medical.dto.MeasureDTO;
import com.medical.suivi_medical.dto.MedicationDTO;
import com.medical.suivi_medical.dto.PatientDTO;
import com.medical.suivi_medical.service.DoctorService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping("/patients")
    public ResponseEntity<List<PatientDTO>> getAllPatients(HttpServletRequest request) {
        Long doctorId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(doctorService.getAllPatients(doctorId));
    }

    @GetMapping("/patients/{id}")
    public ResponseEntity<PatientDTO> getPatient(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getPatient(id));
    }

    @GetMapping("/patients/{id}/medications")
    public ResponseEntity<List<MedicationDTO>> getPatientMedications(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getPatientMedications(id));
    }

    @GetMapping("/patients/{id}/measures")
    public ResponseEntity<List<MeasureDTO>> getPatientMeasures(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getPatientMeasures(id));
    }

    @PostMapping("/patients/{id}/medications")
    public ResponseEntity<MedicationDTO> prescribeMedication(
            @PathVariable Long id,
            @RequestBody MedicationDTO dto) {
        return ResponseEntity.ok(doctorService.prescribeMedication(id, dto));
    }

    @DeleteMapping("/patients/{id}/medications/{medId}")
    public ResponseEntity<Void> deleteMedication(
            @PathVariable Long id,
            @PathVariable Long medId) {
        doctorService.deleteMedication(medId);
        return ResponseEntity.noContent().build();
    }
}