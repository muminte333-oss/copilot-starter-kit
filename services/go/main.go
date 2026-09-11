package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

type HealthResponse struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Service   string    `json:"service"`
}

type DataResponse struct {
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
	Data      []string  `json:"data"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

func init() {
	godotenv.Load()
}

func main() {
	router := mux.NewRouter()

	// Health check endpoint
	router.HandleFunc("/health", healthHandler).Methods("GET")

	// API v1 endpoints
	v1 := router.PathPrefix("/api/v1").Subrouter()
	v1.HandleFunc("/info", infoHandler).Methods("GET")
	v1.HandleFunc("/process", processHandler).Methods("POST")
	v1.HandleFunc("/compute/{id}", computeHandler).Methods("GET")

	// Catch-all 404
	router.NotFoundFunc(notFoundHandler)

	port := os.Getenv("GO_PORT")
	if port == "" {
		port = "8080"
	}

	addr := fmt.Sprintf(":%s", port)
	log.Printf("✅ Go Service starting on http://localhost%s", addr)
	log.Printf("📚 Documentation at http://localhost%s/api/v1/info", addr)

	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	resp := HealthResponse{
		Status:    "ok",
		Timestamp: time.Now(),
		Service:   "go-service",
	}

	json.NewEncoder(w).Encode(resp)
}

func infoHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	info := map[string]interface{}{
		"name":    "Go Microservice",
		"version": "1.0.0",
		"endpoints": map[string]string{
			"GET /health":           "Health check",
			"GET /api/v1/info":      "Service information",
			"POST /api/v1/process":  "Process data",
			"GET /api/v1/compute/:id": "Compute operation",
		},
	}

	json.NewEncoder(w).Encode(info)
}

func processHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var payload map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Invalid request body"})
		return
	}

	w.WriteHeader(http.StatusOK)
	resp := DataResponse{
		Message:   "Data processed successfully",
		Timestamp: time.Now(),
		Data: []string{
			fmt.Sprintf("Processed: %v", payload),
			"Status: Complete",
		},
	}

	json.NewEncoder(w).Encode(resp)
}

func computeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	id := vars["id"]

	w.WriteHeader(http.StatusOK)
	resp := map[string]interface{}{
		"id":        id,
		"result":    "computation_complete",
		"timestamp": time.Now(),
	}

	json.NewEncoder(w).Encode(resp)
}

func notFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNotFound)
	json.NewEncoder(w).Encode(ErrorResponse{Error: "Endpoint not found"})
}
