package com.college.prizeportal.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;

    @ElementCollection
    private List<String> firstPrize;

    @ElementCollection
    private List<String> secondPrize;

    @ElementCollection
    private List<String> thirdPrize;

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public List<String> getFirstPrize() { return firstPrize; }
    public void setFirstPrize(List<String> firstPrize) { this.firstPrize = firstPrize; }

    public List<String> getSecondPrize() { return secondPrize; }
    public void setSecondPrize(List<String> secondPrize) { this.secondPrize = secondPrize; }

    public List<String> getThirdPrize() { return thirdPrize; }
    public void setThirdPrize(List<String> thirdPrize) { this.thirdPrize = thirdPrize; }
}