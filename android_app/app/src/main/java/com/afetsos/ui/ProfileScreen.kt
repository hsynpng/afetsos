package com.afetsos.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.afetsos.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(viewModel: com.afetsos.viewmodel.ProfileViewModel) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(20.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth().padding(vertical = 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "Profil",
                color = MaterialTheme.colorScheme.onSurface,
                fontSize = 24.sp,
                fontWeight = FontWeight.Black
            )
            
            Surface(
                color = Color.White.copy(alpha = 0.05f),
                shape = RoundedCornerShape(100.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.1f))
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Shield, null, tint = TextGrey, modifier = Modifier.size(12.dp))
                    Spacer(Modifier.width(6.dp))
                    Text("Yerel Depolama", color = TextGrey, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        Spacer(Modifier.height(20.dp))

        // Profile Form Card
        Card(
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Text(
                    "Kişisel Bilgiler",
                    color = MaterialTheme.colorScheme.secondary,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )

                ProfileField(label = "Ad Soyad", value = viewModel.nameSurname, onValueChange = { viewModel.nameSurname = it }, placeholder = "Adınız ve soyadınız")
                
                // Blood Type Dropdown
                var expanded by remember { mutableStateOf(false) }
                val bloodTypes = listOf("A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-")
                
                Column {
                    Text("Kan Grubu", color = TextGrey, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 8.dp))
                    ExposedDropdownMenuBox(
                        expanded = expanded,
                        onExpandedChange = { expanded = !expanded }
                    ) {
                        OutlinedTextField(
                            value = viewModel.bloodType,
                            onValueChange = {},
                            readOnly = true,
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                            modifier = Modifier.fillMaxWidth().menuAnchor(),
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
                        ExposedDropdownMenu(
                            expanded = expanded,
                            onDismissRequest = { expanded = false },
                            modifier = Modifier.background(MaterialTheme.colorScheme.surface)
                        ) {
                            bloodTypes.forEach { type ->
                                DropdownMenuItem(
                                    text = { Text(type, color = MaterialTheme.colorScheme.onSurface) },
                                    onClick = {
                                        viewModel.bloodType = type
                                        expanded = false
                                    }
                                )
                            }
                        }
                    }
                }

                ProfileField(
                    label = "Acil Durum İletişim", 
                    value = viewModel.emergencyContact, 
                    onValueChange = { viewModel.emergencyContact = it }, 
                    placeholder = "Telefon numarası",
                    keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(keyboardType = androidx.compose.ui.text.input.KeyboardType.Number)
                )
            }
        }

        Spacer(Modifier.weight(1f))

        if (viewModel.statusMessage.isNotEmpty()) {
            Text(
                viewModel.statusMessage,
                color = OnlineGreen,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.CenterHorizontally).padding(bottom = 16.dp)
            )
        }

        // Save Button
        Button(
            onClick = { viewModel.saveProfile() },
            modifier = Modifier.fillMaxWidth().height(60.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryRed)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Save, null, tint = Color.White, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(12.dp))
                Text(
                    "PROFİLİ KAYDET",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Black
                )
            }
        }
    }
}

@Composable
fun ProfileField(
    label: String, 
    value: String, 
    onValueChange: (String) -> Unit, 
    placeholder: String = "",
    keyboardOptions: androidx.compose.foundation.text.KeyboardOptions = androidx.compose.foundation.text.KeyboardOptions.Default
) {
    Column {
        Text(label, color = MaterialTheme.colorScheme.secondary, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 8.dp))
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            placeholder = { Text(placeholder, color = MaterialTheme.colorScheme.secondary.copy(alpha = 0.3f), fontSize = 14.sp) },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            keyboardOptions = keyboardOptions,
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
