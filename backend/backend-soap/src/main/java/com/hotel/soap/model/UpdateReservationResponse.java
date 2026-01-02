package com.hotel.soap.model;

public class UpdateReservationResponse {
    private Long id;
    private Long clientId;
    private Long chambreId;
    private String dateDebut;
    private String dateFin;
    private String preferences;
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    
    public Long getChambreId() { return chambreId; }
    public void setChambreId(Long chambreId) { this.chambreId = chambreId; }
    
    public String getDateDebut() { return dateDebut; }
    public void setDateDebut(String dateDebut) { this.dateDebut = dateDebut; }
    
    public String getDateFin() { return dateFin; }
    public void setDateFin(String dateFin) { this.dateFin = dateFin; }
    
    public String getPreferences() { return preferences; }
    public void setPreferences(String preferences) { this.preferences = preferences; }
}

