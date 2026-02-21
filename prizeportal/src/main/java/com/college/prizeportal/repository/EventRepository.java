package com.college.prizeportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.college.prizeportal.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}