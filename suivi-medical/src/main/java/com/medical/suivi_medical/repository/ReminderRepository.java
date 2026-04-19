package com.medical.suivi_medical.repository;

import com.medical.suivi_medical.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByPatientId(Long patientId);
    List<Reminder> findByPatientIdAndDate(Long patientId, LocalDate date);
    List<Reminder> findByPatientIdAndDateBefore(Long patientId, LocalDate date);
}