package id.ac.ummat.himasti.data.model

import com.google.gson.annotations.SerializedName

data class KaderUser(
    val id: Int = 0,
    val name: String = "",
    val email: String = "",
    val nim: String? = null,
    val angkatan: String? = null,
    val status: String = "Aktif",
    val roles: List<String> = listOf("kader"),
    val xp: Int = 0,
    @SerializedName("custom_title")
    val customTitle: String = "Kader"
)

data class LoginRequest(
    val identifier: String,
    val password: String
)

data class LoginResponse(
    val success: Boolean,
    val message: String? = null,
    val user: KaderUser? = null
)

data class FeedResponse(
    val success: Boolean,
    val data: FeedData? = null
)

data class FeedData(
    val modules: List<ItModuleItem> = emptyList(),
    val competitions: List<CompetitionItem> = emptyList(),
    val meetings: List<MeetingItem> = emptyList(),
    val totalModules: Int = 0,
    val totalCompetitions: Int = 0
)

data class ItModuleItem(
    val id: Int,
    val title: String,
    val category: String,
    val description: String? = null,
    @SerializedName("code_snippet")
    val codeSnippet: String = ""
)

data class CompetitionItem(
    val id: Int,
    val title: String,
    val type: String,
    val organizer: String,
    val description: String? = null,
    val link: String? = null,
    val deadline: String? = null,
    val poster: String? = null
)

data class MeetingItem(
    val id: Int,
    val title: String,
    val description: String? = null,
    val type: String,
    @SerializedName("event_date")
    val eventDate: String? = null,
    val location: String = "",
    @SerializedName("is_active")
    val isActive: Boolean? = true
)
