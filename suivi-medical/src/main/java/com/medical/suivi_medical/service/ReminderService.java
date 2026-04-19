package com.medical.suivi_medical.service;

import com.medical.suivi_medical.dto.ReminderDTO;
import com.medical.suivi_medical.entity.Reminder;
import com.medical.suivi_medical.repository.MedicationRepository;
import com.medical.suivi_medical.repository.ReminderRepository;
import com.medical.suivi_medical.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final MedicationRepository medicationRepository;
    private final UserRepository userRepository;

    // Get today's reminders
    public List<ReminderDTO> getToday(Long patientId) {
        return reminderRepository.findByPatientIdAndDate(patientId, LocalDate.now())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Get history (all past reminders)
    public List<ReminderDTO> getHistory(Long patientId) {
        return reminderRepository.findByPatientIdAndDateBefore(patientId, LocalDate.now())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Generate reminders from medications (called after adding a medication)
    public void generateFromMedications(Long patientId) {
        var patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        var today = LocalDate.now();
        var medications = medicationRepository.findByPatientId(patientId);

        for (var med : medications) {
            if (med.getStartDate() != null && med.getStartDate().isAfter(today)) continue;
            if (med.getEndDate() != null && med.getEndDate().isBefore(today)) continue;

            for (String time : med.getTimes().split(",")) {
                // Avoid duplicates
                boolean exists = reminderRepository
                        .findByPatientIdAndDate(patientId, today)
                        .stream()
                        .anyMatch(r -> r.getMedication().getId().equals(med.getId())
                                && r.getTime().equals(time.trim()));

                if (!exists) {
                    Reminder reminder = Reminder.builder()
                            .medicationName(med.getName())
                            .dosage(med.getDosage())
                            .time(time.trim())
                            .date(today)
                            .taken(false)
                            .medication(med)
                            .patient(patient)
                            .build();
                    reminderRepository.save(reminder);
                }
            }
        }
    }

    // Mark reminder as taken or not taken
    public ReminderDTO updateTaken(Long reminderId, boolean taken, Long patientId) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));

        if (!reminder.getPatient().getId().equals(patientId)) {
            throw new RuntimeException("Unauthorized");
        }

        reminder.setTaken(taken);
        return toDTO(reminderRepository.save(reminder));
    }

    private ReminderDTO toDTO(Reminder r) {
        ReminderDTO dto = new ReminderDTO();
        dto.setId(r.getId());
        dto.setMedicationId(r.getMedication() != null ? r.getMedication().getId() : null);
        dto.setMedicationName(r.getMedicationName());
        dto.setDosage(r.getDosage());
        dto.setTime(r.getTime());
        dto.setDate(r.getDate());
        dto.setTaken(r.isTaken());
        return dto;
    }
}