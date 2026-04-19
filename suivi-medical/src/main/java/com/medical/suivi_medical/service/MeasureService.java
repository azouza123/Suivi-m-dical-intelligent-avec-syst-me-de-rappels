package com.medical.suivi_medical.service;

import com.medical.suivi_medical.dto.MeasureDTO;
import com.medical.suivi_medical.entity.Measure;
import com.medical.suivi_medical.entity.User;
import com.medical.suivi_medical.enums.MeasureType;
import com.medical.suivi_medical.repository.MeasureRepository;
import com.medical.suivi_medical.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MeasureService {

    private final MeasureRepository measureRepository;
    private final UserRepository userRepository;

    public List<MeasureDTO> getAll(Long patientId) {
        return measureRepository.findByPatientIdOrderByDateDescTimeDesc(patientId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MeasureDTO create(MeasureDTO dto, Long patientId) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Measure measure = Measure.builder()
                .type(MeasureType.valueOf(dto.getType()))
                .label(dto.getLabel())
                .value(dto.getValue())
                .unit(dto.getUnit())
                .date(dto.getDate())
                .time(dto.getTime())
                .notes(dto.getNotes())
                .patient(patient)
                .build();

        return toDTO(measureRepository.save(measure));
    }

    public void delete(Long id, Long patientId) {
        Measure measure = measureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Measure not found"));

        if (!measure.getPatient().getId().equals(patientId)) {
            throw new RuntimeException("Unauthorized");
        }

        measureRepository.delete(measure);
    }

    private MeasureDTO toDTO(Measure m) {
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