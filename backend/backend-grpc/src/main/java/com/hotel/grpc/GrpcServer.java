package com.hotel.grpc;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.concurrent.TimeUnit;

public class GrpcServer {
    
    private Server server;
    private final int port;
    private final Connection dbConnection;
    
    public GrpcServer(int port, Connection dbConnection) {
        this.port = port;
        this.dbConnection = dbConnection;
    }
    
    public void start() throws Exception {
        server = ServerBuilder.forPort(port)
            .addService(new ReservationServiceImpl(dbConnection))
            .build()
            .start();
        
        System.out.println("gRPC Server started on port " + port);
        
        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                try {
                    GrpcServer.this.stop();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
    }
    
    public void stop() throws InterruptedException {
        if (server != null) {
            server.shutdown().awaitTermination(30, TimeUnit.SECONDS);
        }
    }
    
    public void blockUntilShutdown() throws InterruptedException {
        if (server != null) {
            server.awaitTermination();
        }
    }
    
    public static void main(String[] args) throws Exception {
        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl == null) {
            dbUrl = "jdbc:postgresql://localhost:5432/hotel_db?user=hotel_user&password=hotel_password";
        }
        
        Connection connection = DriverManager.getConnection(dbUrl);
        
        GrpcServer server = new GrpcServer(9090, connection);
        server.start();
        server.blockUntilShutdown();
    }
}

