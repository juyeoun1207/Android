package com.myfirstapp

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.*
import android.util.Log
import androidx.core.app.NotificationCompat
import android.app.usage.UsageStatsManager
import com.facebook.react.HeadlessJsTaskService
import java.util.*

class MonitoringService : Service() {

    private lateinit var usageStatsManager: UsageStatsManager
    private val handler = Handler(Looper.getMainLooper())
    private val checkInterval: Long = 10 * 1000 // 10초 마다 확인

    // 앱별 제한 시간 설정 (예시)
    //private val usageLimits = mapOf(
    //    "com.instagram.android" to 30 * 60 * 1000L, // 30분
    //    "com.android.chrome" to 5 * 1000L      // 5초
    //)
	// 이미 알림을 보낸 앱 추적
	companion object {
    	private val alertedApps = mutableSetOf<String>()

		fun resetAlertedApps() {
			alertedApps.clear()
		}
		
		fun resetAlertedApp(packageName: String) {
			alertedApps.remove(packageName)
		}
	}
	//알람 호출
	private fun showOveruseNotification(pkg: String, appName: String) {
		val alarmId = "alarm_${System.currentTimeMillis()}"

		val intent = Intent(this, MainActivity::class.java).apply {
			flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
		}

		// 👉 JS에서 읽을 수 있도록 data를 extras에 명시적으로 담아줌
		val extras = Bundle().apply {
			putString("alarm_id", alarmId)
			putString("app_name", appName)
			putString("pkg_name", pkg)
		}

		val pendingIntent = PendingIntent.getActivity(
			this, 0, intent,
			PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
		)

		val actionIntent = Intent(this, MainActivity::class.java).apply {
			putExtra("pressAction", "camera")
			putExtras(extras)
		}
		val actionPendingIntent = PendingIntent.getActivity(
			this, 1, actionIntent,
			PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
		)

		val notification = NotificationCompat.Builder(this, "alarm")
			.setContentTitle("⚠️ 사용시간 초과")
			.setContentText("$appName 앱을 너무 오래 사용하고 있어요.")
			.setSmallIcon(android.R.drawable.ic_dialog_alert)
			.setContentIntent(pendingIntent)
			.setAutoCancel(true)
			.setExtras(extras) // 🔥 Notifee에서 읽기 위한 핵심
			.addAction(android.R.drawable.ic_menu_camera, "바로 기록하기", actionPendingIntent)
			.addAction(android.R.drawable.ic_menu_close_clear_cancel, "나중에 할래요", null)
			.build()

		val manager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
		manager.notify(alarmId.hashCode(), notification)
	}
    // 하루 리셋용 시간 추적
    private var lastAlertReset: Long = System.currentTimeMillis()

    private val runnable = object : Runnable {
        override fun run() {
            checkUsage()
            handler.postDelayed(this, checkInterval)
        }
    }

    override fun onCreate() {
		try {
			usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
			startForegroundNotification()
			handler.post(runnable)
		} catch (e: Exception) {
			Log.e("MONITOR", "onCreate에서 예외 발생: ${e.message}", e)
		}
    }

    override fun onDestroy() {
        handler.removeCallbacks(runnable)
        super.onDestroy()
    }

    private fun startForegroundNotification() {
        val channelId = "monitor_channel"
        val channel = NotificationChannel(channelId, "사용시간 모니터링", NotificationManager.IMPORTANCE_LOW)
        val manager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        manager.createNotificationChannel(channel)

        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("앱 사용시간 모니터링 중")
            .setSmallIcon(android.R.drawable.ic_menu_info_details)
            .build()

        startForeground(1, notification)
    }

    private fun checkUsage() {
		val now = System.currentTimeMillis()
		if (now - lastAlertReset > 24 * 60 * 60 * 1000) {
            alertedApps.clear()
            lastAlertReset = now
        }
		val begin = now - 24 * 60 * 60 * 1000
		val stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, begin, now)

		val prefs = getSharedPreferences("usage_thresholds", Context.MODE_PRIVATE)

		for (usage in stats) {
			val pkg = usage.packageName
			val time = usage.totalTimeInForeground

			val limitSeconds = prefs.getInt(pkg, -1)
			if (limitSeconds != -1 && time > limitSeconds * 1000L && !alertedApps.contains(pkg)) {
				alertedApps.add(pkg)
                triggerAlert(pkg)
            }

			//val limit = usageLimits[pkg]
			//if (limit != null && time > limit) {
			//	Log.e("MonitoringService", "Overuse detected: $pkg")
			//	triggerAlert(pkg)
			//}
		}
    }

    private fun triggerAlert(pkg: String) {
    	//val appName = getAppNameFromPackage(pkg)
    	//showOveruseNotification(pkg, appName)
        val appName = getAppNameFromPackage(pkg)

        val bundle = Bundle().apply {
            putString("appName", appName)
    		putString("packageName", pkg)
        }

        val intent = Intent(applicationContext, HeadlessService::class.java).apply {
            putExtras(bundle)
        }
		try {
			applicationContext.startService(intent)
			HeadlessJsTaskService.acquireWakeLockNow(applicationContext)
		} catch (e: Exception) {
			Log.e("MonitoringService", "HeadlessService 시작 실패", e)
		}
    }

    private fun getAppNameFromPackage(packageName: String): String {
        return try {
            val pm = packageManager
            val appInfo = pm.getApplicationInfo(packageName, 0)
            pm.getApplicationLabel(appInfo).toString()
        } catch (e: Exception) {
            packageName
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
