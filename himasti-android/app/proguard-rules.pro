# HIMASTI Proguard Rules
-keepattributes *Annotation*
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
-keep class id.ac.ummat.himasti.data.model.** { *; }
