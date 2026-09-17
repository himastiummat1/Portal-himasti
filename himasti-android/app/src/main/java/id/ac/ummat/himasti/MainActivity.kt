package id.ac.ummat.himasti

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.*
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import id.ac.ummat.himasti.data.model.KaderUser
import id.ac.ummat.himasti.data.session.SessionManager
import id.ac.ummat.himasti.ui.screens.LoginScreen
import id.ac.ummat.himasti.ui.screens.MainHubScreen
import id.ac.ummat.himasti.ui.theme.HimastiTheme

class MainActivity : ComponentActivity() {
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        // 1. Install Android 12+ Official SplashScreen (X & Instagram standard)
        val splashScreen = installSplashScreen()

        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        sessionManager = (application as HimastiApp).sessionManager

        setContent {
            HimastiTheme {
                var currentUser by remember { mutableStateOf<KaderUser?>(sessionManager.getUser()) }

                if (currentUser != null) {
                    MainHubScreen(
                        user = currentUser!!,
                        sessionManager = sessionManager,
                        onLogout = {
                            currentUser = null
                        }
                    )
                } else {
                    LoginScreen(
                        sessionManager = sessionManager,
                        onLoginSuccess = {
                            currentUser = sessionManager.getUser()
                        }
                    )
                }
            }
        }
    }
}
