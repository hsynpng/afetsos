package com.afetsos.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.afetsos.ui.theme.*

data class HistoryItem(
    val status: String,
    val delivery: String,
    val message: String,
    val date: String,
    val color: Color
)

@Composable
fun HistoryScreen(viewModel: com.afetsos.viewmodel.HistoryViewModel) {
    LaunchedEffect(Unit) {
        viewModel.fetchHistory()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(20.dp)
    ) {
        Text(
            "Durum Geçmişi",
            color = MaterialTheme.colorScheme.onSurface,
            fontSize = 24.sp,
            fontWeight = FontWeight.Black,
            modifier = Modifier.padding(vertical = 10.dp)
        )

        Spacer(Modifier.height(20.dp))

        if (viewModel.isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = PrimaryRed)
            }
        } else if (viewModel.historyItems.isEmpty()) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Henüz bir vaka kaydınız bulunmuyor.", color = TextGrey, fontSize = 14.sp)
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(viewModel.historyItems) { report ->
                    val statusColor = when(report.urgency_level) {
                        "Critical" -> PrimaryRed
                        "High" -> Color(0xFFF97316)
                        else -> Color(0xFF3B82F6)
                    }

                    Row(modifier = Modifier.fillMaxWidth()) {
                        // Timeline Line & Icon
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.width(40.dp)
                        ) {
                            Surface(
                                color = Color.White.copy(alpha = 0.1f),
                                shape = RoundedCornerShape(100.dp),
                                modifier = Modifier.size(32.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(Icons.Default.Schedule, null, tint = TextGrey, modifier = Modifier.size(16.dp))
                                }
                            }
                            Box(
                                modifier = Modifier
                                    .width(2.dp)
                                    .weight(1f) // Changed height to weight
                                    .background(Color.White.copy(alpha = 0.05f))
                            )
                        }

                        // Card
                        Card(
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            shape = RoundedCornerShape(16.dp),
                            modifier = Modifier.fillMaxWidth().padding(start = 8.dp)
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Badge(containerColor = statusColor.copy(alpha = 0.2f), contentColor = statusColor) {
                                        Text(report.urgency_level ?: "Belirsiz", fontWeight = FontWeight.Black, fontSize = 9.sp)
                                    }
                                    Badge(containerColor = if (report.status == "Resolved") OnlineGreen.copy(alpha = 0.2f) else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.05f), 
                                          contentColor = if (report.status == "Resolved") OnlineGreen else MaterialTheme.colorScheme.onSurface) {
                                        Text(if (report.status == "Resolved") "ÇÖZÜLDÜ" else "İŞLENİYOR", fontWeight = FontWeight.Bold, fontSize = 9.sp)
                                    }
                                }
                                Spacer(Modifier.height(12.dp))
                                Text(report.message, color = MaterialTheme.colorScheme.onSurface, fontSize = 14.sp, fontWeight = FontWeight.Medium)
                                Spacer(Modifier.height(8.dp))
                                Text(report.created_at, color = MaterialTheme.colorScheme.secondary, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun Badge(containerColor: Color, contentColor: Color, content: @Composable RowScope.() -> Unit) {
    Surface(
        color = containerColor,
        shape = RoundedCornerShape(4.dp),
        contentColor = contentColor
    ) {
        Row(modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)) {
            content()
        }
    }
}
