package com.medical.suivi_medical.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReminderDTO {
    private Long id;
    private Long medicationId;
    private String medicationName;
    private String dosage;
    private String time;
    private LocalDate date;
    private boolean taken;
}