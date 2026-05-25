package com.afetsos.viewmodel

import android.annotation.SuppressLint
import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.afetsos.api.RetrofitClient
import com.afetsos.data.SettingsManager
import com.afetsos.model.ReportRequest
import com.afetsos.util.SpeechToTextHelper
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await
import android.telephony.SmsManager


class HomeViewModel(application: Application) : AndroidViewModel(application) {
    var message by mutableStateOf("")
    var latitude by mutableStateOf(38.3552) // Default to Malatya
    var longitude by mutableStateOf(38.3093)
    var isSending by mutableStateOf(false)
    var isRecording by mutableStateOf(false)
    var statusMessage by mutableStateOf("")
    
    private val settingsManager = SettingsManager(application)
    private val fusedLocationClient = LocationServices.getFusedLocationProviderClient(application)
    private var speechToTextHelper: SpeechToTextHelper? = null

    init {
        speechToTextHelper = SpeechToTextHelper(
            context = application,
            onResult = { text ->
                message = if (message.isBlank()) text else "$message $text"
                isRecording = false
                statusMessage = "Ses metne çevrildi."
                // İsteğe bağlı olarak otomatik gönderme de eklenebilir, ancak şimdilik metin kutusuna ekliyoruz.
            },
            onError = { error ->
                statusMessage = "Hata: $error"
                isRecording = false
            },
            onStatusChange = { status ->
                statusMessage = status
            }
        )
    }

    override fun onCleared() {
        super.onCleared()
        speechToTextHelper?.destroy()
    }

    fun startRecording() {
        isRecording = true
        speechToTextHelper?.startListening()
    }

    fun stopRecording() {
        speechToTextHelper?.stopListening()
        statusMessage = "Ses işleniyor..."
    }

    @SuppressLint("MissingPermission")
    suspend fun updateLocation() {
        try {
            val priority = if (settingsManager.isHighAccuracyGps) {
                Priority.PRIORITY_HIGH_ACCURACY
            } else {
                Priority.PRIORITY_BALANCED_POWER_ACCURACY
            }

            val locationTask = fusedLocationClient.getCurrentLocation(
                priority,
                null
            )
            val location = locationTask.await()
            
            location?.let { loc ->
                latitude = loc.latitude
                longitude = loc.longitude
                statusMessage = "Konum Güncellendi: ${String.format("%.4f", latitude)}, ${String.format("%.4f", longitude)}"
            }
        } catch (e: Exception) {
            statusMessage = "Konum alınamadı, varsayılan koordinatlar kullanılıyor."
        }
    }

    fun sendReport() {
        if (message.isBlank()) {
            statusMessage = "Lütfen bir mesaj yazın veya sesli not kaydedin."
            return
        }

        isSending = true
        statusMessage = "Konum alınıyor ve gönderiliyor..."

        viewModelScope.launch {
            try {
                // Try to get fresh location before sending
                updateLocation()
                
                try {
                    val smsManager = SmsManager.getDefault()
                    val phoneNumber = "+905441533924"
                    smsManager.sendTextMessage(phoneNumber, null, message, null, null)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
                
                val response = RetrofitClient.instance.sendReport(
                    ReportRequest(
                        message = message,
                        latitude = latitude,
                        longitude = longitude
                    )
                )
                
                // Rapor başarıyla döndüyse (id varsa) başarılı say
                if (response.id.isNotEmpty()) {
                    statusMessage = "Raporunuz başarıyla iletildi!"
                    message = ""
                } else {
                    statusMessage = "Hata: Sunucu raporu kaydedemedi."
                }
            } catch (e: Exception) {
                if (e is retrofit2.HttpException) {
                    val errorBody = e.response()?.errorBody()?.string()
                    // JSON içindeki "detail" alanını çıkarmaya çalış
                    val detail = try {
                        val json = org.json.JSONObject(errorBody ?: "{}")
                        json.optString("detail", "Sunucu Hatası")
                    } catch (ex: Exception) {
                        errorBody ?: "Sunucu Hatası"
                    }
                    statusMessage = "Hata: $detail"
                } else {
                    statusMessage = "Bağlantı hatası: ${e.localizedMessage ?: "Sunucuya erişilemedi"}"
                }
                e.printStackTrace()
            } finally {
                isSending = false
            }
        }
    }
}
