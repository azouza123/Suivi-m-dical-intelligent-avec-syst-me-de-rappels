package com.medical.suivi_medical.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class MedicationDTO {
    private Long id;
    private String name;
    private String dosage;
    private String frequency;
    private List<String> times; // ["08:00", "20:00"]
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;
}