package com.medical.suivi_medical.service;

import com.medical.suivi_medical.dto.MeasureDTO;
import com.medical.suivi_medical.dto.MedicationDTO;
import com.medical.suivi_medical.dto.PatientDTO;
import com.medical.suivi_medical.entity.Medication;
import com.medical.suivi_medical.entity.Measure;
import com.medical.suivi_medical.entity.User;
import com.medical.suivi_medical.enums.Role;
import com.medical.suivi_medical.repository.MeasureRepository;
import com.medical.suivi_medical.repository.MedicationRepository;
import com.medical.suivi_medical.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final UserRepository userRepository;
    private final MedicationRepository medicationRepository;
    private final MeasureRepository measureRepository;

    public List<PatientDTO> getAllPatients(Long doctorId) {
        return userRepository.findByRole(Role.PATIENT)
                .stream()
                .filter(u -> u != null && u.getId() != null)
                .map(this::toPatientDTO)
                .collect(Collectors.toList());
    }

    public PatientDTO getPatient(Long patientId) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return toPatientDTO(patient);
    }

    public List<MedicationDTO> getPatientMedications(Long patientId) {
        return medicationRepository.findByPatientId(patientId)
                .stream()
                .filter(m -> m != null)
                .map(this::toMedicationDTO)
                .collect(Collectors.toList());
    }

    public List<MeasureDTO> getPatientMeasures(Long patientId) {
        return measureRepository.findByPatientIdOrderByDateDescTimeDesc(patientId)
                .stream()
                .filter(m -> m != null)
                .map(this::toMeasureDTO)
                .collect(Collectors.toList());
    }

    public MedicationDTO prescribeMedication(Long patientId, MedicationDTO dto) {
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

        return toMedicationDTO(medicationRepository.save(med));
    }

    public void deleteMedication(Long medId) {
        medicationRepository.deleteById(medId);
    }

    private PatientDTO toPatientDTO(User user) {
        PatientDTO dto = new PatientDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        return dto;
    }

    private MedicationDTO toMedicationDTO(Medication med) {
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

    private MeasureDTO toMeasureDTO(Measure m) {
        MeasureDTO dto = new MeasureDTO();
        dto.setId(m.getId());
        dto.setType(m.getType().name());
        dto.setLabel(m.getLabel());
        dto.setValue(m.getValue());
        dto.setUnit(m.getUnit());
        dto.setDate(m.getDate());
        dto.setTime(m.getTime());
        dto.setNotes(m.getNotes());
        return dto;
    }
}