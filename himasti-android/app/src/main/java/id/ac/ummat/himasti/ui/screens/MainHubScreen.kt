package id.ac.ummat.himasti.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import id.ac.ummat.himasti.R
import id.ac.ummat.himasti.data.api.HimastiApiClient
import id.ac.ummat.himasti.data.model.FeedData
import id.ac.ummat.himasti.data.model.KaderUser
import id.ac.ummat.himasti.data.session.SessionManager
import id.ac.ummat.himasti.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun MainHubScreen(
    user: KaderUser,
    sessionManager: SessionManager,
    onLogout: () -> Unit
) {
    var selectedTab by remember { mutableIntStateOf(0) }
    var feedData by remember { mutableStateOf<FeedData?>(null) }
    var isLoadingFeed by remember { mutableStateOf(true) }
    val scope = rememberCoroutineScope()

    fun loadFeed() {
        isLoadingFeed = true
        scope.launch {
            val result = HimastiApiClient.fetchFeed()
            isLoadingFeed = false
            result.onSuccess { res ->
                feedData = res.data
            }
        }
    }

    LaunchedEffect(Unit) {
        loadFeed()
    }

    Scaffold(
        topBar = {
            Surface(
                color = BgDark,
                border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.ic_himasti_logo),
                            contentDescription = "HIMASTI Logo",
                            modifier = Modifier
                                .size(32.dp)
                                .clip(RoundedCornerShape(6.dp))
                        )
                        Text(
                            text = "HIMASTI HUB",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    }

                    IconButton(
                        onClick = { loadFeed() },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Refresh",
                            tint = TextSecondary,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
        },
        bottomBar = {
            NavigationBar(
                containerColor = SurfaceDark,
                tonalElevation = 0.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, BorderSubtle)
            ) {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Home, contentDescription = "Beranda") },
                    label = { Text("Beranda", fontSize = 11.sp) },
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryLight,
                        selectedTextColor = PrimaryLight,
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted,
                        indicatorColor = PrimaryBlue.copy(alpha = 0.2f)
                    )
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Code, contentDescription = "Modul") },
                    label = { Text("Modul", fontSize = 11.sp) },
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryLight,
                        selectedTextColor = PrimaryLight,
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted,
                        indicatorColor = PrimaryBlue.copy(alpha = 0.2f)
                    )
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.EmojiEvents, contentDescription = "Lomba") },
                    label = { Text("Lomba", fontSize = 11.sp) },
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryLight,
                        selectedTextColor = PrimaryLight,
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted,
                        indicatorColor = PrimaryBlue.copy(alpha = 0.2f)
                    )
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Person, contentDescription = "Profil") },
                    label = { Text("KTA", fontSize = 11.sp) },
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3 },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PrimaryLight,
                        selectedTextColor = PrimaryLight,
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted,
                        indicatorColor = PrimaryBlue.copy(alpha = 0.2f)
                    )
                )
            }
        },
        containerColor = BgDark
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when (selectedTab) {
                0 -> HomeScreen(
                    user = user,
                    feedData = feedData,
                    isLoading = isLoadingFeed,
                    onNavigateToModul = { selectedTab = 1 }
                )
                1 -> ModulScreen(
                    modules = feedData?.modules ?: emptyList(),
                    isLoading = isLoadingFeed
                )
                2 -> LombaScreen(
                    competitions = feedData?.competitions ?: emptyList(),
                    isLoading = isLoadingFeed
                )
                3 -> ProfileKtaScreen(
                    user = user,
                    sessionManager = sessionManager,
                    onLogout = onLogout
                )
            }
        }
    }
}
