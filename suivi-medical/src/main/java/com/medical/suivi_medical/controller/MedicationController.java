package com.medical.suivi_medical.controller;

import com.medical.suivi_medical.dto.MedicationDTO;
import com.medical.suivi_medical.service.MedicationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/medications")
@RequiredArgsConstructor
public class MedicationController {

    private final MedicationService medicationService;

    // GET /medications  ← matches medicationService.getAll()
    @GetMapping
    public ResponseEntity<List<MedicationDTO>> getAll(HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(medicationService.getAll(patientId));
    }

    // POST /medications  ← matches medicationService.create()
    @PostMapping
    public ResponseEntity<MedicationDTO> create(@RequestBody MedicationDTO dto,
                                                 HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(medicationService.create(dto, patientId));
    }

    // PUT /medications/{id}  ← matches medicationService.update()
    @PutMapping("/{id}")
    public ResponseEntity<MedicationDTO> update(@PathVariable Long id,
                                                 @RequestBody MedicationDTO dto,
                                                 HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(medicationService.update(id, dto, patientId));
    }

    // DELETE /medications/{id}  ← matches medicationService.delete()
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        medicationService.delete(id, patientId);
        return ResponseEntity.noContent().build();
    }
}