package com.afetsos.viewmodel

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.afetsos.api.RetrofitClient
import com.afetsos.model.ReportResponse
import kotlinx.coroutines.launch

class HistoryViewModel : ViewModel() {
    var historyItems by mutableStateOf<List<ReportResponse>>(emptyList())
    var isLoading by mutableStateOf(false)

    fun fetchHistory() {
        isLoading = true
        viewModelScope.launch {
            try {
                val response = RetrofitClient.instance.getReports()
                // Sort by created_at descending (newest first)
                historyItems = response.sortedByDescending { it.created_at }
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                isLoading = false
            }
        }
    }
}
