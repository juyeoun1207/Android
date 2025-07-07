package com.myfirstapp

import android.media.MediaScannerConnection
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MediaScannerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MediaScanner"
    }

    @ReactMethod
    fun scanFile(path: String, mimeType: String?) {
        MediaScannerConnection.scanFile(
            reactApplicationContext,
            arrayOf(path),
            arrayOf(mimeType),
            null
        )
    }
}