package com.medical.suivi_medical.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "medications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String dosage;

    private String frequency; // daily, twice, three, weekly

    // Store times as comma-separated string: "08:00,20:00"
    private String times;

    private LocalDate startDate;
    private LocalDate endDate;

    private String notes;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;
}