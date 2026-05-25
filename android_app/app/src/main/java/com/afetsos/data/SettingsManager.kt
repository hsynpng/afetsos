package com.afetsos.data

import android.content.Context
import android.content.SharedPreferences

class SettingsManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("afetsos_prefs", Context.MODE_PRIVATE)

    companion object {
        const val KEY_SERVER_URL = "server_url"
        const val KEY_DARK_MODE = "dark_mode"
        const val KEY_GPS_HIGH_ACCURACY = "gps_high_accuracy"
        const val KEY_SIGNAL_INTERVAL = "signal_interval"
        const val KEY_USER_NAME = "user_name"
        const val KEY_BLOOD_TYPE = "blood_type"
        const val KEY_EMERGENCY_CONTACT = "emergency_contact"
        const val DEFAULT_SERVER = "http://10.0.2.2:8000/"
    }

    var serverUrl: String
        get() = prefs.getString(KEY_SERVER_URL, DEFAULT_SERVER) ?: DEFAULT_SERVER
        set(value) = prefs.edit().putString(KEY_SERVER_URL, value).apply()

    var userName: String
        get() = prefs.getString(KEY_USER_NAME, "") ?: ""
        set(value) = prefs.edit().putString(KEY_USER_NAME, value).apply()

    var bloodType: String
        get() = prefs.getString(KEY_BLOOD_TYPE, "") ?: ""
        set(value) = prefs.edit().putString(KEY_BLOOD_TYPE, value).apply()

    var emergencyContact: String
        get() = prefs.getString(KEY_EMERGENCY_CONTACT, "") ?: ""
        set(value) = prefs.edit().putString(KEY_EMERGENCY_CONTACT, value).apply()

    var isDarkMode: Boolean
        get() = prefs.getBoolean(KEY_DARK_MODE, true)
        set(value) = prefs.edit().putBoolean(KEY_DARK_MODE, value).apply()

    var isHighAccuracyGps: Boolean
        get() = prefs.getBoolean(KEY_GPS_HIGH_ACCURACY, false)
        set(value) = prefs.edit().putBoolean(KEY_GPS_HIGH_ACCURACY, value).apply()

    var signalInterval: Int
        get() = prefs.getInt(KEY_SIGNAL_INTERVAL, 30)
        set(value) = prefs.edit().putInt(KEY_SIGNAL_INTERVAL, value).apply()
}
