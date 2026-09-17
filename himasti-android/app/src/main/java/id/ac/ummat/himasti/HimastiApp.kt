package id.ac.ummat.himasti

import android.app.Application
import id.ac.ummat.himasti.data.session.SessionManager

class HimastiApp : Application() {
    lateinit var sessionManager: SessionManager
        private set

    override fun onCreate() {
        super.onCreate()
        sessionManager = SessionManager(applicationContext)
    }
}
