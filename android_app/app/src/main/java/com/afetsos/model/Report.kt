package com.afetsos.model

import com.google.gson.annotations.SerializedName

data class ReportRequest(
    @SerializedName("message") val message: String,
    @SerializedName("latitude") val latitude: Double,
    @SerializedName("longitude") val longitude: Double,
    @SerializedName("user_id") val userId: String? = null,
    @SerializedName("voice_url") val voiceUrl: String? = null
)

data class ReportResponse(
    @SerializedName("id") val id: String,
    @SerializedName("message") val message: String,
    @SerializedName("latitude") val latitude: Double,
    @SerializedName("longitude") val longitude: Double,
    @SerializedName("urgency_level") val urgency_level: String?,
    @SerializedName("status") val status: String?,
    @SerializedName("created_at") val created_at: String,
    @SerializedName("need_type") val need_type: String?,
    @SerializedName("voice_url") val voiceUrl: String? = null
)
