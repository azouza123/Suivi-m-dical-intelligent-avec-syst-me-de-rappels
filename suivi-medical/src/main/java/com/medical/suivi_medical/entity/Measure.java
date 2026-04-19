package com.medical.suivi_medical.entity;

import com.medical.suivi_medical.enums.MeasureType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "measures")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Measure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private MeasureType type; // blood_pressure, weight, glucose

    private String label; // "Tension artérielle", "Poids", "Glycémie"
    private String value; // "120/80", "72.5", "5.4"
    private String unit;  // "mmHg", "kg", "mmol/L"

    private LocalDate date;
    private LocalTime time;

    private String notes;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;
}