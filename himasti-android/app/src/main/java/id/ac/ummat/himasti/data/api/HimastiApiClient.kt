package id.ac.ummat.himasti.data.api

import com.google.gson.Gson
import id.ac.ummat.himasti.data.model.FeedResponse
import id.ac.ummat.himasti.data.model.LoginRequest
import id.ac.ummat.himasti.data.model.LoginResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.util.concurrent.TimeUnit

object HimastiApiClient {
    private const val BASE_URL = "https://portal-himasti-beta.vercel.app"
    private val JSON_MEDIA = "application/json; charset=utf-8".toMediaType()
    private val gson = Gson()

    private val client = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .writeTimeout(15, TimeUnit.SECONDS)
        .build()

    suspend fun login(identifier: String, password: String): Result<LoginResponse> = withContext(Dispatchers.IO) {
        try {
            val reqBodyJson = gson.toJson(LoginRequest(identifier.trim(), password))
            val request = Request.Builder()
                .url("$BASE_URL/api/mobile/login")
                .post(reqBodyJson.toRequestBody(JSON_MEDIA))
                .header("User-Agent", "HIMASTI-Android-App/1.0")
                .build()

            val response = client.newCall(request).execute()
            val responseBody = response.body?.string() ?: ""

            if (!response.isSuccessful && responseBody.isEmpty()) {
                return@withContext Result.failure(Exception("HTTP Error ${response.code}"))
            }

            val loginResponse = gson.fromJson(responseBody, LoginResponse::class.java)
            if (loginResponse.success) {
                Result.success(loginResponse)
            } else {
                Result.failure(Exception(loginResponse.message ?: "Login gagal"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun fetchFeed(): Result<FeedResponse> = withContext(Dispatchers.IO) {
        try {
            val request = Request.Builder()
                .url("$BASE_URL/api/mobile/feed")
                .get()
                .header("User-Agent", "HIMASTI-Android-App/1.0")
                .build()

            val response = client.newCall(request).execute()
            val responseBody = response.body?.string() ?: ""

            if (!response.isSuccessful) {
                return@withContext Result.failure(Exception("HTTP Error ${response.code}"))
            }

            val feedResponse = gson.fromJson(responseBody, FeedResponse::class.java)
            Result.success(feedResponse)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
