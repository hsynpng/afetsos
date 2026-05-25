package com.afetsos

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.outlined.History
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.afetsos.ui.HomeScreen
import com.afetsos.ui.ProfileScreen
import com.afetsos.ui.SettingsScreen
import com.afetsos.ui.HistoryScreen
import com.afetsos.ui.theme.AFETSOSTheme
import com.afetsos.ui.theme.DarkBackground
import com.afetsos.ui.theme.PrimaryRed
import com.afetsos.ui.theme.TextGrey
import com.afetsos.viewmodel.HomeViewModel

class MainActivity : ComponentActivity() {
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        // İzin sonuçları burada işlenebilir (opsiyonel)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // İzinleri kontrol et ve iste
        val permissions = arrayOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.SEND_SMS
        )
        
        if (permissions.any { ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED }) {
            requestPermissionLauncher.launch(permissions)
        }

        setContent {
            val settingsViewModel: com.afetsos.viewmodel.SettingsViewModel = viewModel()
            AFETSOSTheme(darkTheme = settingsViewModel.isDarkMode) {
                MainLayout(settingsViewModel)
            }
        }
    }
}

@Composable
fun MainLayout(settingsViewModel: com.afetsos.viewmodel.SettingsViewModel) {
    val navController = rememberNavController()
    val homeViewModel: HomeViewModel = viewModel()
    val profileViewModel: com.afetsos.viewmodel.ProfileViewModel = viewModel()
    val historyViewModel: com.afetsos.viewmodel.HistoryViewModel = viewModel()
    var selectedTab by remember { mutableIntStateOf(0) }

    val items = listOf(
        NavigationItem("Ana Sayfa", Icons.Filled.Home, Icons.Outlined.Home, "home"),
        NavigationItem("Profil", Icons.Filled.Person, Icons.Outlined.Person, "profile"),
        NavigationItem("Ayarlar", Icons.Filled.Settings, Icons.Outlined.Settings, "settings"),
        NavigationItem("Geçmiş", Icons.Filled.History, Icons.Outlined.History, "history")
    )

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = DarkBackground,
                tonalElevation = 8.dp
            ) {
                items.forEachIndexed { index, item ->
                    NavigationBarItem(
                        selected = selectedTab == index,
                        onClick = {
                            selectedTab = index
                            navController.navigate(item.route)
                        },
                        icon = {
                            Icon(
                                if (selectedTab == index) item.selectedIcon else item.unselectedIcon,
                                contentDescription = item.title,
                                tint = if (selectedTab == index) PrimaryRed else TextGrey
                            )
                        },
                        label = {
                            Text(
                                item.title,
                                fontSize = 10.sp,
                                color = if (selectedTab == index) PrimaryRed else TextGrey
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            indicatorColor = Color.Transparent
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(innerPadding)
        ) {
            composable("home") { HomeScreen(homeViewModel) }
            composable("profile") { ProfileScreen(profileViewModel) }
            composable("settings") { SettingsScreen(settingsViewModel) }
            composable("history") { HistoryScreen(historyViewModel) }
        }
    }
}

data class NavigationItem(
    val title: String,
    val selectedIcon: androidx.compose.ui.graphics.vector.ImageVector,
    val unselectedIcon: androidx.compose.ui.graphics.vector.ImageVector,
    val route: String
)
