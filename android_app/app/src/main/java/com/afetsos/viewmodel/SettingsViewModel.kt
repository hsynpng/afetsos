package com.afetsos.viewmodel

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import com.afetsos.api.RetrofitClient
import com.afetsos.data.SettingsManager

class SettingsViewModel(application: Application) : AndroidViewModel(application) {
    private val settingsManager = SettingsManager(application)

    var serverUrl by mutableStateOf(settingsManager.serverUrl)
    var isDarkMode by mutableStateOf(settingsManager.isDarkMode)
    var isHighAccuracyGps by mutableStateOf(settingsManager.isHighAccuracyGps)
    var signalInterval by mutableStateOf(settingsManager.signalInterval.toString())

    init {
        // Initial sync with Retrofit
        RetrofitClient.updateBaseUrl(serverUrl)
    }

    fun updateServerUrl(url: String) {
        serverUrl = url
        settingsManager.serverUrl = url
        RetrofitClient.updateBaseUrl(url)
    }

    fun updateDarkMode(enabled: Boolean) {
        isDarkMode = enabled
        settingsManager.isDarkMode = enabled
    }

    fun updateHighAccuracy(enabled: Boolean) {
        isHighAccuracyGps = enabled
        settingsManager.isHighAccuracyGps = enabled
    }

    fun updateInterval(interval: String) {
        signalInterval = interval
        interval.toIntOrNull()?.let {
            settingsManager.signalInterval = it
        }
    }
}
