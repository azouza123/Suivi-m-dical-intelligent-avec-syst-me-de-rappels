package com.medical.suivi_medical.service;

import com.medical.suivi_medical.dto.MedicationDTO;
import com.medical.suivi_medical.entity.Medication;
import com.medical.suivi_medical.entity.User;
import com.medical.suivi_medical.repository.MedicationRepository;
import com.medical.suivi_medical.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final UserRepository userRepository;

    public List<MedicationDTO> getAll(Long patientId) {
        return medicationRepository.findByPatientId(patientId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MedicationDTO create(MedicationDTO dto, Long patientId) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Medication med = Medication.builder()
                .name(dto.getName())
                .dosage(dto.getDosage())
                .frequency(dto.getFrequency())
                .times(String.join(",", dto.getTimes()))
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .notes(dto.getNotes())
                .patient(patient)
                .build();

        return toDTO(medicationRepository.save(med));
    }

    public MedicationDTO update(Long id, MedicationDTO dto, Long patientId) {
        Medication med = medicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medication not found"));

        if (!med.getPatient().getId().equals(patientId)) {
            throw new RuntimeException("Unauthorized");
        }

        med.setName(dto.getName());
        med.setDosage(dto.getDosage());
        med.setFrequency(dto.getFrequency());
        med.setTimes(String.join(",", dto.getTimes()));
        med.setStartDate(dto.getStartDate());
        med.setEndDate(dto.getEndDate());
        med.setNotes(dto.getNotes());

        return toDTO(medicationRepository.save(med));
    }

    public void delete(Long id, Long patientId) {
        Medication med = medicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medication not found"));

        if (!med.getPatient().getId().equals(patientId)) {
            throw new RuntimeException("Unauthorized");
        }

        medicationRepository.delete(med);
    }

    private MedicationDTO toDTO(Medication med) {
        MedicationDTO dto = new MedicationDTO();
        dto.setId(med.getId());
        dto.setName(med.getName());
        dto.setDosage(med.getDosage());
        dto.setFrequency(med.getFrequency());
        dto.setTimes(Arrays.asList(med.getTimes().split(",")));
        dto.setStartDate(med.getStartDate());
        dto.setEndDate(med.getEndDate());
        dto.setNotes(med.getNotes());
        return dto;
    }
}