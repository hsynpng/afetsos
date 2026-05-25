package com.afetsos.api

import com.afetsos.model.ReportRequest
import com.afetsos.model.ReportResponse
import com.afetsos.model.VoiceUploadResponse
import okhttp3.MultipartBody
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part

interface ApiService {
    @POST("reports/")
    suspend fun sendReport(@Body request: ReportRequest): ReportResponse

    @GET("reports/")
    suspend fun getReports(): List<ReportResponse>

    @Multipart
    @POST("upload/voice")
    suspend fun uploadVoice(@Part file: MultipartBody.Part): VoiceUploadResponse
}
