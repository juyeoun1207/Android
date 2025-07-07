package com.myfirstapp

import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

class HeadlessService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        Log.e("HEADLESS", "getTaskConfig 호출됨")
		return try {
			val extras: Bundle? = intent?.extras
			val appName = extras?.getString("appName") ?: "앱"
			val data = Arguments.createMap().apply {
				putString("appName", appName)
			}
			Log.e("HEADLESS", "Headless Task 구성 완료 - appName: $appName")
			HeadlessJsTaskConfig("UsageOverLimitTask", data, 5000, true)
		} catch (e: Exception) {
			Log.e("HEADLESS", "getTaskConfig 오류: ${e.message}", e)
			null
		}
    }
}
