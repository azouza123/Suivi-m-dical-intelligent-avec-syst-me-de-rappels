package com.medical.suivi_medical.controller;

import com.medical.suivi_medical.dto.MeasureDTO;
import com.medical.suivi_medical.service.MeasureService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/measures")
@RequiredArgsConstructor
public class MeasureController {

    private final MeasureService measureService;

    // GET /measures  ← matches measureService.getAll()
    @GetMapping
    public ResponseEntity<List<MeasureDTO>> getAll(HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(measureService.getAll(patientId));
    }

    // POST /measures  ← matches measureService.create()
    @PostMapping
    public ResponseEntity<MeasureDTO> create(@RequestBody MeasureDTO dto,
                                              HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(measureService.create(dto, patientId));
    }

    // DELETE /measures/{id}  ← matches measureService.delete()
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        measureService.delete(id, patientId);
        return ResponseEntity.noContent().build();
    }
}