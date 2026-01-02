package com.hotel.rest.controller;

import com.hotel.rest.dto.ReservationDTO;
import com.hotel.rest.model.Client;
import com.hotel.rest.model.Chambre;
import com.hotel.rest.model.Reservation;
import com.hotel.rest.repository.ClientRepository;
import com.hotel.rest.repository.ChambreRepository;
import com.hotel.rest.repository.ReservationRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private ChambreRepository chambreRepository;
    
    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(@Valid @RequestBody ReservationDTO dto) {
        Client client = clientRepository.findById(dto.getClientId())
            .orElseThrow(() -> new RuntimeException("Client not found"));
        
        Chambre chambre = chambreRepository.findById(dto.getChambreId())
            .orElseThrow(() -> new RuntimeException("Chambre not found"));
        
        Reservation reservation = new Reservation();
        reservation.setClient(client);
        reservation.setChambre(chambre);
        reservation.setDateDebut(dto.getDateDebut());
        reservation.setDateFin(dto.getDateFin());
        reservation.setPreferences(dto.getPreferences());
        
        Reservation saved = reservationRepository.save(reservation);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(saved));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ReservationDTO> getReservation(@PathVariable Long id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        return ResponseEntity.ok(toDTO(reservation));
    }
    
    @GetMapping
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        List<ReservationDTO> reservations = reservationRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(reservations);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ReservationDTO> updateReservation(
            @PathVariable Long id,
            @Valid @RequestBody ReservationDTO dto) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        if (dto.getClientId() != null) {
            Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
            reservation.setClient(client);
        }
        
        if (dto.getChambreId() != null) {
            Chambre chambre = chambreRepository.findById(dto.getChambreId())
                .orElseThrow(() -> new RuntimeException("Chambre not found"));
            reservation.setChambre(chambre);
        }
        
        if (dto.getDateDebut() != null) {
            reservation.setDateDebut(dto.getDateDebut());
        }
        
        if (dto.getDateFin() != null) {
            reservation.setDateFin(dto.getDateFin());
        }
        
        if (dto.getPreferences() != null) {
            reservation.setPreferences(dto.getPreferences());
        }
        
        Reservation updated = reservationRepository.save(reservation);
        return ResponseEntity.ok(toDTO(updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reservation not found");
        }
        
        reservationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    private ReservationDTO toDTO(Reservation reservation) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(reservation.getId());
        dto.setClientId(reservation.getClient().getId());
        dto.setChambreId(reservation.getChambre().getId());
        dto.setDateDebut(reservation.getDateDebut());
        dto.setDateFin(reservation.getDateFin());
        dto.setPreferences(reservation.getPreferences());
        return dto;
    }
}

