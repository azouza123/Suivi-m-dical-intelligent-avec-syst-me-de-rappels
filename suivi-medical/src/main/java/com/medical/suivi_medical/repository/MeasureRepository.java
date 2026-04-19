package com.medical.suivi_medical.repository;

import com.medical.suivi_medical.entity.Measure;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MeasureRepository extends JpaRepository<Measure, Long> {
    List<Measure> findByPatientIdOrderByDateDescTimeDesc(Long patientId);
}