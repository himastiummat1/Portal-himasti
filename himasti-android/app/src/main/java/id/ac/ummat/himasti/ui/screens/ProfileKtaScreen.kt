package id.ac.ummat.himasti.ui.screens

import android.content.Context
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import id.ac.ummat.himasti.R
import id.ac.ummat.himasti.data.model.KaderUser
import id.ac.ummat.himasti.data.session.SessionManager
import id.ac.ummat.himasti.ui.theme.*

@Composable
fun ProfileKtaScreen(
    user: KaderUser,
    sessionManager: SessionManager,
    onLogout: () -> Unit
) {
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(horizontal = 16.dp)
            .verticalScroll(rememberScrollState()),
        contentPadding = PaddingValues(top = 16.dp, bottom = 80.dp)
    ) {
        Text(
            text = "PROFIL & KTA DIGITAL",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )
        Text(
            text = "Identitas resmi anggota HIMASTI UMMAT",
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Large Digital KTA Card
        Surface(
            color = CardDark,
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(24.dp)) {
                // Header of the card
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.ic_himasti_logo),
                            contentDescription = "Logo",
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(8.dp))
                        )
                        Column {
                            Text(
                                text = "KARTU TANDA ANGGOTA",
                                fontSize = 10.sp,
                                fontFamily = FontFamily.Monospace,
                                color = PrimaryLight,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = "HIMASTI UMMAT",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = TextMuted
                            )
                        }
                    }

                    Surface(
                        color = PrimaryBlue.copy(alpha = 0.2f),
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text(
                            text = user.status.uppercase(),
                            color = PrimaryLight,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Avatar and User Name
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(54.dp)
                            .clip(CircleShape)
                            .background(PrimaryBlue.copy(alpha = 0.2f))
                            .border(1.dp, PrimaryBlue, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = user.name.take(2).uppercase(),
                            color = PrimaryLight,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Column {
                        Text(
                            text = user.name,
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = user.email,
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextSecondary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                Divider(color = BorderSubtle, thickness = 1.dp)

                Spacer(modifier = Modifier.height(16.dp))

                // Data Points
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    KtaDataField(label = "NIM", value = user.nim ?: "-")
                    KtaDataField(label = "ANGKATAN", value = user.angkatan ?: "-")
                    KtaDataField(label = "POIN XP", value = "${user.xp} XP")
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Role Badges
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    user.roles.forEach { role ->
                        Surface(
                            color = SurfaceDark,
                            shape = RoundedCornerShape(4.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle)
                        ) {
                            Text(
                                text = role.replace("_", " ").uppercase(),
                                fontSize = 10.sp,
                                fontFamily = FontFamily.Monospace,
                                color = TextSecondary,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp)
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "INTEGRASI WEB & AKUN",
            style = MaterialTheme.typography.labelSmall,
            color = TextMuted,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace,
            modifier = Modifier.padding(start = 4.dp, bottom = 8.dp)
        )

        // Web SSO Button
        Button(
            onClick = {
                openWebPortal(context, "https://portal-himasti-beta.vercel.app/admin")
            },
            colors = ButtonDefaults.buttonColors(
                containerColor = SurfaceDark,
                contentColor = TextPrimary
            ),
            border = androidx.compose.foundation.BorderStroke(1.dp, BorderSubtle),
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            Icon(Icons.Default.Language, contentDescription = null, tint = PrimaryLight)
            Spacer(modifier = Modifier.width(10.dp))
            Text("Buka Portal Web Lengkap (SSO)", fontWeight = FontWeight.Medium, fontSize = 14.sp)
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Logout Button
        OutlinedButton(
            onClick = {
                sessionManager.clearSession()
                onLogout()
            },
            colors = ButtonDefaults.outlinedButtonColors(
                contentColor = DangerRed
            ),
            border = androidx.compose.foundation.BorderStroke(1.dp, DangerRed.copy(alpha = 0.5f)),
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            Icon(Icons.Default.ExitToApp, contentDescription = null, tint = DangerRed)
            Spacer(modifier = Modifier.width(10.dp))
            Text("Keluar dari Akun", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
        }
    }
}

@Composable
fun KtaDataField(label: String, value: String) {
    Column {
        Text(
            text = label,
            fontSize = 10.sp,
            fontFamily = FontFamily.Monospace,
            color = TextMuted,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = value,
            fontSize = 13.sp,
            fontFamily = FontFamily.Monospace,
            fontWeight = FontWeight.SemiBold,
            color = TextPrimary
        )
    }
}
