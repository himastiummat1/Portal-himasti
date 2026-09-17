package id.ac.ummat.himasti.data.session

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import id.ac.ummat.himasti.data.model.KaderUser

class SessionManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private val gson = Gson()

    companion object {
        private const val PREF_NAME = "himasti_session_prefs"
        private const val KEY_IS_LOGGED_IN = "is_logged_in"
        private const val KEY_USER_DATA = "user_data"
        private const val KEY_AUTH_TOKEN = "auth_token"
    }

    fun saveUser(user: KaderUser, token: String? = null) {
        val editor = prefs.edit()
        editor.putBoolean(KEY_IS_LOGGED_IN, true)
        editor.putString(KEY_USER_DATA, gson.toJson(user))
        if (token != null) {
            editor.putString(KEY_AUTH_TOKEN, token)
        }
        editor.apply()
    }

    fun getUser(): KaderUser? {
        val userJson = prefs.getString(KEY_USER_DATA, null) ?: return null
        return try {
            gson.fromJson(userJson, KaderUser::class.java)
        } catch (e: Exception) {
            null
        }
    }

    fun isLoggedIn(): Boolean {
        return prefs.getBoolean(KEY_IS_LOGGED_IN, false) && getUser() != null
    }

    fun getAuthToken(): String? {
        return prefs.getString(KEY_AUTH_TOKEN, null)
    }

    fun clearSession() {
        prefs.edit().clear().apply()
    }
}
