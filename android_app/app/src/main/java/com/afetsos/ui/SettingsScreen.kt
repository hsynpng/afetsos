package com.afetsos.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.afetsos.ui.theme.*

@Composable
fun SettingsScreen(viewModel: com.afetsos.viewmodel.SettingsViewModel) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(20.dp)
    ) {
        Text(
            "Ayarlar",
            color = MaterialTheme.colorScheme.onSurface,
            fontSize = 24.sp,
            fontWeight = FontWeight.Black,
            modifier = Modifier.padding(vertical = 10.dp)
        )

        Spacer(Modifier.height(20.dp))

        // Server Configuration
        SettingsSection(title = "Sunucu Bağlantısı") {
            Column(modifier = Modifier.padding(top = 8.dp)) {
                Text("API Sunucu Adresi", color = TextGrey, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(
                    value = viewModel.serverUrl,
                    onValueChange = { viewModel.updateServerUrl(it) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    placeholder = { Text("http://10.0.2.2:8000/", color = TextGrey.copy(alpha = 0.3f)) },
                    colors = OutlinedTextFieldDefaults.colors(
                        unfocusedContainerColor = MaterialTheme.colorScheme.background.copy(alpha = 0.5f),
                        focusedContainerColor = MaterialTheme.colorScheme.background.copy(alpha = 0.5f),
                        unfocusedBorderColor = BorderColor,
                        focusedBorderColor = PrimaryRed,
                        focusedTextColor = MaterialTheme.colorScheme.onSurface,
                        unfocusedTextColor = MaterialTheme.colorScheme.onSurface
                    )
                )
            }
        }

        Spacer(Modifier.height(16.dp))

        // Appearance
        SettingsSection(title = "Görünüm") {
            SettingsToggle(
                label = "Karanlık Mod", 
                checked = viewModel.isDarkMode, 
                onCheckedChange = { viewModel.updateDarkMode(it) }
            )
        }

        Spacer(Modifier.height(16.dp))

        // Permissions
        SettingsSection(title = "İzinler") {
            SettingsToggle(
                label = "Yüksek Doğruluklu GPS", 
                checked = viewModel.isHighAccuracyGps, 
                onCheckedChange = { viewModel.updateHighAccuracy(it) }
            )
        }

        Spacer(Modifier.height(16.dp))

        // Auto Signal
        SettingsSection(title = "Otomatik Sinyal") {
            Column(modifier = Modifier.padding(top = 8.dp)) {
                Text("Tekrar aralığı (saniye)", color = TextGrey, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(
                    value = viewModel.signalInterval,
                    onValueChange = { viewModel.updateInterval(it) },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        unfocusedContainerColor = MaterialTheme.colorScheme.background.copy(alpha = 0.5f),
                        focusedContainerColor = MaterialTheme.colorScheme.background.copy(alpha = 0.5f),
                        unfocusedBorderColor = BorderColor,
                        focusedBorderColor = PrimaryRed,
                        focusedTextColor = MaterialTheme.colorScheme.onSurface,
                        unfocusedTextColor = MaterialTheme.colorScheme.onSurface
                    )
                )
            }
        }
    }
}

@Composable
fun SettingsSection(title: String, content: @Composable ColumnScope.() -> Unit) {
    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                title,
                color = MaterialTheme.colorScheme.onSurface,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 12.dp)
            )
            content()
        }
    }
}

@Composable
fun SettingsToggle(label: String, checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(label, color = MaterialTheme.colorScheme.secondary, fontSize = 13.sp, fontWeight = FontWeight.Medium)
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = PrimaryRed,
                uncheckedThumbColor = MaterialTheme.colorScheme.secondary,
                uncheckedTrackColor = MaterialTheme.colorScheme.background
            )
        )
    }
}
