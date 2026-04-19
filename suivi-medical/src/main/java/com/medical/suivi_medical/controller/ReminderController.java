package com.medical.suivi_medical.controller;

import com.medical.suivi_medical.dto.ReminderDTO;
import com.medical.suivi_medical.service.ReminderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    // GET /reminders  ← matches reminderService.getAll() - returns today's
    @GetMapping
    public ResponseEntity<List<ReminderDTO>> getToday(HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(reminderService.getToday(patientId));
    }

    // GET /reminders/history  ← matches reminderService.getHistory()
    @GetMapping("/history")
    public ResponseEntity<List<ReminderDTO>> getHistory(HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(reminderService.getHistory(patientId));
    }

    // POST /reminders/generate  ← generate reminders from active medications
    @PostMapping("/generate")
    public ResponseEntity<Void> generate(HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        reminderService.generateFromMedications(patientId);
        return ResponseEntity.ok().build();
    }

    // PUT /reminders/{id}/taken  ← mark as taken/untaken
    @PutMapping("/{id}/taken")
    public ResponseEntity<ReminderDTO> updateTaken(@PathVariable Long id,
                                                    @RequestParam boolean value,
                                                    HttpServletRequest request) {
        Long patientId = (Long) request.getAttribute("userId");
        return ResponseEntity.ok(reminderService.updateTaken(id, value, patientId));
    }
}