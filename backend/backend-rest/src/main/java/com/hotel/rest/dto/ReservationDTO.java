package com.hotel.rest.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ReservationDTO {
    private Long id;
    
    @NotNull
    private Long clientId;
    
    @NotNull
    private Long chambreId;
    
    @NotNull
    private LocalDate dateDebut;
    
    @NotNull
    private LocalDate dateFin;
    
    private String preferences;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    
    public Long getChambreId() { return chambreId; }
    public void setChambreId(Long chambreId) { this.chambreId = chambreId; }
    
    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    
    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
    
    public String getPreferences() { return preferences; }
    public void setPreferences(String preferences) { this.preferences = preferences; }
}

