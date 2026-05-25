package com.afetsos.viewmodel

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import com.afetsos.data.SettingsManager

class ProfileViewModel(application: Application) : AndroidViewModel(application) {
    private val settingsManager = SettingsManager(application)

    var nameSurname by mutableStateOf(settingsManager.userName)
    var bloodType by mutableStateOf(settingsManager.bloodType)
    var emergencyContact by mutableStateOf(settingsManager.emergencyContact)
    var statusMessage by mutableStateOf("")

    fun saveProfile() {
        settingsManager.userName = nameSurname
        settingsManager.bloodType = bloodType
        settingsManager.emergencyContact = emergencyContact
        statusMessage = "Profil başarıyla kaydedildi!"
    }
}
