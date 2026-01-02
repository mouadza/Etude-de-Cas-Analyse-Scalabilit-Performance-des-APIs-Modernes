package com.hotel.grpc;

import io.grpc.stub.StreamObserver;
import java.sql.*;
import java.time.LocalDate;

public class ReservationServiceImpl extends ReservationServiceGrpc.ReservationServiceImplBase {
    
    private final Connection connection;
    
    public ReservationServiceImpl(Connection connection) {
        this.connection = connection;
    }
    
    @Override
    public void createReservation(CreateReservationRequest request, 
                                  StreamObserver<ReservationResponse> responseObserver) {
        try {
            String sql = "INSERT INTO reservation (client_id, chambre_id, date_debut, date_fin, preferences) " +
                        "VALUES (?, ?, ?, ?, ?) RETURNING id";
            
            PreparedStatement stmt = connection.prepareStatement(sql);
            stmt.setLong(1, request.getClientId());
            stmt.setLong(2, request.getChambreId());
            stmt.setDate(3, Date.valueOf(LocalDate.parse(request.getDateDebut())));
            stmt.setDate(4, Date.valueOf(LocalDate.parse(request.getDateFin())));
            stmt.setString(5, request.getPreferences());
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                ReservationResponse response = ReservationResponse.newBuilder()
                    .setId(rs.getLong("id"))
                    .setClientId(request.getClientId())
                    .setChambreId(request.getChambreId())
                    .setDateDebut(request.getDateDebut())
                    .setDateFin(request.getDateFin())
                    .setPreferences(request.getPreferences())
                    .build();
                
                responseObserver.onNext(response);
                responseObserver.onCompleted();
            } else {
                responseObserver.onError(new RuntimeException("Failed to create reservation"));
            }
        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }
    
    @Override
    public void getReservation(GetReservationRequest request,
                               StreamObserver<ReservationResponse> responseObserver) {
        try {
            String sql = "SELECT * FROM reservation WHERE id = ?";
            PreparedStatement stmt = connection.prepareStatement(sql);
            stmt.setLong(1, request.getId());
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                ReservationResponse response = ReservationResponse.newBuilder()
                    .setId(rs.getLong("id"))
                    .setClientId(rs.getLong("client_id"))
                    .setChambreId(rs.getLong("chambre_id"))
                    .setDateDebut(rs.getDate("date_debut").toString())
                    .setDateFin(rs.getDate("date_fin").toString())
                    .setPreferences(rs.getString("preferences") != null ? rs.getString("preferences") : "")
                    .build();
                
                responseObserver.onNext(response);
                responseObserver.onCompleted();
            } else {
                responseObserver.onError(new RuntimeException("Reservation not found"));
            }
        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }
    
    @Override
    public void updateReservation(UpdateReservationRequest request,
                                 StreamObserver<ReservationResponse> responseObserver) {
        try {
            StringBuilder sql = new StringBuilder("UPDATE reservation SET ");
            boolean first = true;
            
            if (request.hasClientId()) {
                sql.append("client_id = ?");
                first = false;
            }
            if (request.hasChambreId()) {
                if (!first) sql.append(", ");
                sql.append("chambre_id = ?");
                first = false;
            }
            if (request.hasDateDebut()) {
                if (!first) sql.append(", ");
                sql.append("date_debut = ?");
                first = false;
            }
            if (request.hasDateFin()) {
                if (!first) sql.append(", ");
                sql.append("date_fin = ?");
                first = false;
            }
            if (request.hasPreferences()) {
                if (!first) sql.append(", ");
                sql.append("preferences = ?");
            }
            
            sql.append(", updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *");
            
            PreparedStatement stmt = connection.prepareStatement(sql.toString());
            int paramIndex = 1;
            
            if (request.hasClientId()) {
                stmt.setLong(paramIndex++, request.getClientId());
            }
            if (request.hasChambreId()) {
                stmt.setLong(paramIndex++, request.getChambreId());
            }
            if (request.hasDateDebut()) {
                stmt.setDate(paramIndex++, Date.valueOf(LocalDate.parse(request.getDateDebut())));
            }
            if (request.hasDateFin()) {
                stmt.setDate(paramIndex++, Date.valueOf(LocalDate.parse(request.getDateFin())));
            }
            if (request.hasPreferences()) {
                stmt.setString(paramIndex++, request.getPreferences());
            }
            stmt.setLong(paramIndex, request.getId());
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                ReservationResponse response = ReservationResponse.newBuilder()
                    .setId(rs.getLong("id"))
                    .setClientId(rs.getLong("client_id"))
                    .setChambreId(rs.getLong("chambre_id"))
                    .setDateDebut(rs.getDate("date_debut").toString())
                    .setDateFin(rs.getDate("date_fin").toString())
                    .setPreferences(rs.getString("preferences") != null ? rs.getString("preferences") : "")
                    .build();
                
                responseObserver.onNext(response);
                responseObserver.onCompleted();
            } else {
                responseObserver.onError(new RuntimeException("Reservation not found"));
            }
        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }
    
    @Override
    public void deleteReservation(DeleteReservationRequest request,
                                 StreamObserver<DeleteReservationResponse> responseObserver) {
        try {
            String sql = "DELETE FROM reservation WHERE id = ?";
            PreparedStatement stmt = connection.prepareStatement(sql);
            stmt.setLong(1, request.getId());
            
            int rowsAffected = stmt.executeUpdate();
            DeleteReservationResponse response = DeleteReservationResponse.newBuilder()
                .setSuccess(rowsAffected > 0)
                .build();
            
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }
}

