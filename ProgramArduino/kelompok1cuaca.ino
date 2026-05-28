#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// ---------------- KONFIGURASI JARINGAN ----------------
#define WIFI_SSID "KOST PAK ANSORI"
#define WIFI_PASSWORD "anakkost"

// Masukkan URL Ngrok lu yang aktif di sini
const char* serverUrl = "https://783c-140-213-187-82.ngrok-free.app/api/cuaca/update";

// ---------------- DEFINISI HARDWARE ----------------
#define DHTPIN 4
#define DHTTYPE DHT11
#define LED_HIJAU 21
#define LED_KUNING 19
#define LED_MERAH 18
#define BUZZER 22

DHT dht(DHTPIN, DHTTYPE);
unsigned long prevMillis = 0;

void setup() {
  Serial.begin(115200);
  
  pinMode(LED_HIJAU, OUTPUT);
  pinMode(LED_KUNING, OUTPUT);
  pinMode(LED_MERAH, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  // Mematikan semua komponen di awal
  digitalWrite(LED_HIJAU, LOW);
  digitalWrite(LED_KUNING, LOW);
  digitalWrite(LED_MERAH, LOW);
  digitalWrite(BUZZER, LOW);

  dht.begin();

  // Koneksi WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Menghubungkan ke Jaringan");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("\nTersambung ke WiFi!");
}

void loop() {
  // Transmisi data dilakukan tiap 10 detik (10000 ms)
  if (millis() - prevMillis >= 10000) {
    prevMillis = millis();

    float suhu = dht.readTemperature();
    float kelembaban = dht.readHumidity();

    if (isnan(suhu) || isnan(kelembaban)) {
      Serial.println("Sensor DHT11 tidak terbaca!");
      return;
    }

    /* ===================================================
       LOGIKA KONDISI TAMBAK GARAM (SMART EXPERT SYSTEM)
       =================================================== */
       
    // 1. KONDISI IDEAL (Hijau nyala): Suhu Terik (>= 32°C) & Kering (<= 50%)
    if (suhu >= 32.0 && kelembaban <= 50.0) {
      digitalWrite(LED_HIJAU, HIGH);   
      digitalWrite(LED_KUNING, LOW);  
      digitalWrite(LED_MERAH, LOW);  
      digitalWrite(BUZZER, LOW);
    } 
    // 2. KONDISI BURUK (Merah & Buzzer nyala): Dingin (< 26°C) atau Lembab (>= 75%)
    else if (suhu < 26.0 || kelembaban >= 75.0) {
      digitalWrite(LED_HIJAU, LOW);    
      digitalWrite(LED_KUNING, LOW);  
      digitalWrite(LED_MERAH, HIGH); 
      digitalWrite(BUZZER, HIGH); // Peringatan keras untuk petambak
    } 
    // 3. KONDISI NORMAL (Kuning nyala): Kondisi pertengahan yang aman
    else {
      digitalWrite(LED_HIJAU, LOW);    
      digitalWrite(LED_KUNING, HIGH); 
      digitalWrite(LED_MERAH, LOW);  
      digitalWrite(BUZZER, LOW);
    }

    /* ===================================================
       PROSES PENGIRIMAN DATA KE SERVER GO LU
       =================================================== */
       
    if (WiFi.status() == WL_CONNECTED) {
      // Bypass sertifikat SSL HTTPS Ngrok
      WiFiClientSecure client;
      client.setInsecure(); 

      HTTPClient http;
      http.begin(client, serverUrl); // Kirim lewat client secure
      http.addHeader("Content-Type", "application/json");
      http.addHeader("Connection", "close"); // Minta server memutus rapi

      // Membungkus data jadi JSON
      StaticJsonDocument<200> doc;
      doc["suhu"] = suhu;
      doc["kelembaban"] = kelembaban;
      
      String requestBody;
      serializeJson(doc, requestBody);

      // Nembak paket POST
      int httpResponseCode = http.POST(requestBody);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.print("Sukses mengirim data! Respon Server: ");
        Serial.println(response);
      } else {
        Serial.print("Gagal kirim data, Error: ");
        Serial.println(http.errorToString(httpResponseCode).c_str());
      }
      
      // Bebaskan memori soket jaringan
      http.end();
    }
  }
}