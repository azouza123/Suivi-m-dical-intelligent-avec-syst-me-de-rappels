package com.medical.suivi_medical.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class MeasureDTO {
    private Long id;
    private String type;   // "blood_pressure", "weight", "glucose"
    private String label;
    private String value;
    private String unit;
    private LocalDate date;
    private LocalTime time;
    private String notes;
}