package com.hotel.soap.endpoint;

import com.hotel.soap.model.*;
import com.hotel.soap.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Endpoint
public class ReservationEndpoint {
    
    private static final String NAMESPACE_URI = "http://hotel.com/soap";
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private ChambreRepository chambreRepository;
    
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "CreateReservationRequest")
    @ResponsePayload
    public CreateReservationResponse createReservation(@RequestPayload CreateReservationRequest request) {
        Client client = clientRepository.findById(request.getClientId())
            .orElseThrow(() -> new RuntimeException("Client not found"));
        
        Chambre chambre = chambreRepository.findById(request.getChambreId())
            .orElseThrow(() -> new RuntimeException("Chambre not found"));
        
        Reservation reservation = new Reservation();
        reservation.setClient(client);
        reservation.setChambre(chambre);
        reservation.setDateDebut(LocalDate.parse(request.getDateDebut()));
        reservation.setDateFin(LocalDate.parse(request.getDateFin()));
        reservation.setPreferences(request.getPreferences());
        
        Reservation saved = reservationRepository.save(reservation);
        
        CreateReservationResponse response = new CreateReservationResponse();
        response.setId(saved.getId());
        response.setClientId(saved.getClient().getId());
        response.setChambreId(saved.getChambre().getId());
        response.setDateDebut(saved.getDateDebut().toString());
        response.setDateFin(saved.getDateFin().toString());
        response.setPreferences(saved.getPreferences());
        
        return response;
    }
    
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "GetReservationRequest")
    @ResponsePayload
    public GetReservationResponse getReservation(@RequestPayload GetReservationRequest request) {
        Reservation reservation = reservationRepository.findById(request.getId())
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        GetReservationResponse response = new GetReservationResponse();
        response.setId(reservation.getId());
        response.setClientId(reservation.getClient().getId());
        response.setChambreId(reservation.getChambre().getId());
        response.setDateDebut(reservation.getDateDebut().toString());
        response.setDateFin(reservation.getDateFin().toString());
        response.setPreferences(reservation.getPreferences());
        
        return response;
    }
    
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "UpdateReservationRequest")
    @ResponsePayload
    public UpdateReservationResponse updateReservation(@RequestPayload UpdateReservationRequest request) {
        Reservation reservation = reservationRepository.findById(request.getId())
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        if (request.getClientId() != null) {
            Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
            reservation.setClient(client);
        }
        
        if (request.getChambreId() != null) {
            Chambre chambre = chambreRepository.findById(request.getChambreId())
                .orElseThrow(() -> new RuntimeException("Chambre not found"));
            reservation.setChambre(chambre);
        }
        
        if (request.getDateDebut() != null) {
            reservation.setDateDebut(LocalDate.parse(request.getDateDebut()));
        }
        
        if (request.getDateFin() != null) {
            reservation.setDateFin(LocalDate.parse(request.getDateFin()));
        }
        
        if (request.getPreferences() != null) {
            reservation.setPreferences(request.getPreferences());
        }
        
        Reservation updated = reservationRepository.save(reservation);
        
        UpdateReservationResponse response = new UpdateReservationResponse();
        response.setId(updated.getId());
        response.setClientId(updated.getClient().getId());
        response.setChambreId(updated.getChambre().getId());
        response.setDateDebut(updated.getDateDebut().toString());
        response.setDateFin(updated.getDateFin().toString());
        response.setPreferences(updated.getPreferences());
        
        return response;
    }
    
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "DeleteReservationRequest")
    @ResponsePayload
    public DeleteReservationResponse deleteReservation(@RequestPayload DeleteReservationRequest request) {
        if (!reservationRepository.existsById(request.getId())) {
            throw new RuntimeException("Reservation not found");
        }
        
        reservationRepository.deleteById(request.getId());
        
        DeleteReservationResponse response = new DeleteReservationResponse();
        response.setSuccess(true);
        
        return response;
    }
}

