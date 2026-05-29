package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"
)

// Struktur data cuaca tambak garam
type DataCuaca struct {
	Suhu       float64   `json:"suhu"`
	Kelembaban float64   `json:"kelembaban"`
	Timestamp  time.Time `json:"timestamp"`
}

// In-memory database sederhana dengan Mutex agar aman dari race condition komunikasi data
var (
	dataStorage []DataCuaca
	mutex       sync.Mutex
)

func main() {
	// Endpoint untuk ESP32 mengirim data (POST)
	http.HandleFunc("/api/cuaca/update", handleUpdateCuaca)

	// Endpoint untuk Next.js dan Kelompok Lain mengambil data terbaru (GET)
	http.HandleFunc("/api/cuaca/latest", handleGetLatestCuaca)

	// Endpoint untuk mengambil semua riwayat data (GET)
	http.HandleFunc("/api/cuaca/history", handleGetHistoryCuaca)

	fmt.Println("Server API Tambak Garam berjalan di port :8080...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Gagal menjalankan server:", err)
	}
}

// Fungsi mendengarkan data masuk dari ESP32
func handleUpdateCuaca(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method tidak diizinkan", http.StatusMethodNotAllowed)
		return
	}

	var data DataCuaca // Langsung pakai struct DataCuaca yang ada di atas
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Tambahkan waktu saat ini dari server untuk menandai kapan paket data masuk
	data.Timestamp = time.Now()

	// Simpan ke storage dengan aman menggunakan Mutex
	mutex.Lock()
	dataStorage = append(dataStorage, data)
	mutex.Unlock()

	fmt.Printf("[%s] Data Masuk -> Suhu: %.2f°C, Kelembaban: %.2f%%\n",
		data.Timestamp.Format("15:04:05"), data.Suhu, data.Kelembaban)

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`{"message": "Data berhasil disimpan di server custom!"}`))
}

// Fungsi memberikan data terbaru ke Next.js / Kelompok Lain
func handleGetLatestCuaca(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // Izinkan CORS agar Next.js tidak error

	mutex.Lock()
	defer mutex.Unlock()

	if len(dataStorage) == 0 {
		w.Write([]byte(`{"message": "Belum ada data tersedia"}`))
		return
	}

	// Ambil elemen terakhir dari array
	latestData := dataStorage[len(dataStorage)-1]
	json.NewEncoder(w).Encode(latestData)
}

// Fungsi memberikan seluruh riwayat data
func handleGetHistoryCuaca(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	mutex.Lock()
	defer mutex.Unlock()

	json.NewEncoder(w).Encode(dataStorage)
}