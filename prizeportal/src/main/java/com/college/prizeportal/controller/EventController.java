package com.college.prizeportal.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.college.prizeportal.entity.Event;
import com.college.prizeportal.repository.EventRepository;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // GET all events
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // POST create event
    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
    }

    // UPDATE event
    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setItemName(updatedEvent.getItemName());
        event.setFirstPrize(updatedEvent.getFirstPrize());
        event.setSecondPrize(updatedEvent.getSecondPrize());
        event.setThirdPrize(updatedEvent.getThirdPrize());

        return eventRepository.save(event);
    }

    // DELETE event
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
    }
}