package com.myfirstapp

import android.app.usage.UsageStatsManager
import java.util.Calendar
import android.app.ActivityManager
import android.content.Context
import android.content.Intent
import android.util.Log
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.util.Base64
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import java.io.ByteArrayOutputStream
import com.facebook.react.bridge.*
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap

class UsageMonitorModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "UsageMonitor"

    @ReactMethod
    fun startMonitoring() {
    	Log.e("MONITOR_MODULE", "startMonitoring 호출됨")
		try {
			val intent = Intent(reactApplicationContext, MonitoringService::class.java)
			reactApplicationContext.startForegroundService(intent)
			Log.e("MONITOR_MODULE", "MonitoringService 실행 요청 완료")
		} catch (e: Exception) {
			Log.e("MONITOR_MODULE", "startMonitoring 실패: ${e.message}", e)
		}
    }

    @ReactMethod
    fun stopMonitoring() {
        val intent = Intent(reactApplicationContext, MonitoringService::class.java)
        reactApplicationContext.stopService(intent)
    }

    private fun isServiceRunning(serviceClass: Class<*>): Boolean {
        val manager = reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        for (service in manager.getRunningServices(Int.MAX_VALUE)) {
            if (serviceClass.name == service.service.className) {
                return true
            }
        }
        return false
    }

	@ReactMethod
    fun setUsageThreshold(packageName: String, seconds: Int, promise: Promise) {
        try {
            val prefs = reactApplicationContext.getSharedPreferences("usage_thresholds", Context.MODE_PRIVATE)
            prefs.edit().putInt(packageName, seconds).apply()
            promise.resolve(null)
        } catch (e: Exception) {
            Log.e("MONITOR_MODULE", "setUsageThreshold 실패: ${e.message}", e)
            promise.reject("SET_THRESHOLD_ERROR", e)
        }
    }
	@ReactMethod
	fun removeUsageThreshold(packageName: String, promise: Promise) {
		try {
			val prefs = reactApplicationContext.getSharedPreferences("usage_thresholds", Context.MODE_PRIVATE)
			prefs.edit().remove(packageName).apply()
			MonitoringService.resetAlertedApp(packageName)
			promise.resolve(null)
		} catch (e: Exception) {
			Log.e("MONITOR_MODULE", "removeUsageThreshold 실패: ${e.message}", e)
			promise.reject("REMOVE_THRESHOLD_ERROR", e)
		}
	}
	@ReactMethod
	fun resetAlertedApps() {
		try {
			MonitoringService.resetAlertedApps()
			Log.e("USAGE_MONITOR", "alertedApps 초기화 성공")
		} catch (e: Exception) {
			Log.e("USAGE_MONITOR", "alertedApps 초기화 실패: ${e.message}", e)
		}
	}
	@ReactMethod
	fun resetAlertedApp(packageName: String) {
		try {
			MonitoringService.resetAlertedApp(packageName)
			Log.e("USAGE_MONITOR", "$packageName 알림 기록 초기화 성공")
		} catch (e: Exception) {
			Log.e("USAGE_MONITOR", "$packageName 알림 기록 초기화 실패: ${e.message}", e)
		}
	}
	@ReactMethod
	fun isUsageThresholdSet(packageName: String, promise: Promise) {
		try {
			val prefs = reactApplicationContext.getSharedPreferences("usage_thresholds", Context.MODE_PRIVATE)
			val threshold = prefs.getInt(packageName, -1)  // 저장된 값이 없으면 -1 반환
			promise.resolve(threshold != -1)
		} catch (e: Exception) {
			Log.e("MONITOR_MODULE", "isUsageThresholdSet 실패: ${e.message}", e)
			promise.reject("CHECK_THRESHOLD_ERROR", e)
		}
	}
	@ReactMethod
	fun getUsageThreshold(packageName: String, promise: Promise) {
		try {
			val prefs = reactApplicationContext.getSharedPreferences("usage_thresholds", Context.MODE_PRIVATE)
			if (prefs.contains(packageName)) {
				val seconds = prefs.getInt(packageName, -1)
				promise.resolve(seconds) // 초 단위로 리턴
			} else {
				promise.resolve(null) // 설정된 값이 없을 경우 null
			}
		} catch (e: Exception) {
			Log.e("MONITOR_MODULE", "getUsageThreshold 실패: ${e.message}", e)
			promise.reject("GET_THRESHOLD_ERROR", e)
		}
	}
	private fun getAppIconBase64(packageName: String): String? {
		return try {
			val pm = reactApplicationContext.packageManager
			val drawable = pm.getApplicationIcon(packageName)
			val bitmap = drawableToBitmap(drawable)
			val stream = ByteArrayOutputStream()
			bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)
			val byteArray = stream.toByteArray()
			Base64.encodeToString(byteArray, Base64.NO_WRAP)
		} catch (e: Exception) {
			null
		}
	}

	private fun drawableToBitmap(drawable: Drawable): Bitmap {
		if (drawable is BitmapDrawable) {
			return drawable.bitmap
		}
		val width = drawable.intrinsicWidth.coerceAtLeast(1)
		val height = drawable.intrinsicHeight.coerceAtLeast(1)
		val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
		val canvas = Canvas(bitmap)
		drawable.setBounds(0, 0, canvas.width, canvas.height)
		drawable.draw(canvas)
		return bitmap
	}
	private fun getAppNameFromPackage(packageName: String): String {
		return try {
			val pm = reactApplicationContext.packageManager
			val appInfo = pm.getApplicationInfo(packageName, 0)
			pm.getApplicationLabel(appInfo).toString()
		} catch (e: Exception) {
			packageName // 실패 시 fallback
		}
	}
	@ReactMethod
    fun getAppUsageStats(promise: Promise) {
        try {
            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
			//앱별 오늘 사용시간
			val now = System.currentTimeMillis()
			val calendar = Calendar.getInstance().apply{
				set(Calendar.HOUR_OF_DAY, 0)
				set(Calendar.MINUTE, 0)
				set(Calendar.SECOND, 0)
				set(Calendar.MILLISECOND, 0)
			}
			val todayStart = calendar.timeInMillis
			val todayStats = usageStatsManager.queryUsageStats(
				UsageStatsManager.INTERVAL_DAILY, todayStart, now
			)
			//앱별 주간 사용시간
			val cal = Calendar.getInstance()
			cal.set(Calendar.HOUR_OF_DAY, 0)
			cal.set(Calendar.MINUTE, 0)
			cal.set(Calendar.SECOND, 0)
			cal.set(Calendar.MILLISECOND, 0)
			cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY)
			val weekStart = cal.timeInMillis
			val dailyStats = usageStatsManager.queryUsageStats(
				UsageStatsManager.INTERVAL_DAILY, weekStart, now
			)
			val weeklyMap = mutableMapOf<String, MutableMap<String, Double>>()
			dailyStats?.forEach { usage ->
				if (usage.totalTimeInForeground <= 0) return@forEach

				val usageCal = Calendar.getInstance().apply {
					timeInMillis = usage.firstTimeStamp  // 또는 usage.lastTimeUsed
				}

				// 오늘 이전까지만 포함 (예: 수요일이면 일~수)
				if (usageCal.timeInMillis > now) return@forEach

				val dayOfWeek = usageCal.get(Calendar.DAY_OF_WEEK)
				val weekdayName = when (dayOfWeek) {
					Calendar.SUNDAY -> "일"
					Calendar.MONDAY -> "월"
					Calendar.TUESDAY -> "화"
					Calendar.WEDNESDAY -> "수"
					Calendar.THURSDAY -> "목"
					Calendar.FRIDAY -> "금"
					Calendar.SATURDAY -> "토"
					else -> "기타"
				}

				val appName = getAppNameFromPackage(usage.packageName)
				val key = usage.packageName

				val appTimeMap = weeklyMap.getOrPut(weekdayName) { mutableMapOf() }
				appTimeMap[key] = (appTimeMap[key] ?: 0.0) + usage.totalTimeInForeground.toDouble() / 1000
			}
			//앱별 이번 달 사용시간
			val calMonth = Calendar.getInstance().apply{
				set(Calendar.DAY_OF_MONTH, 1)
				set(Calendar.HOUR_OF_DAY, 0)
				set(Calendar.MINUTE, 0)
				set(Calendar.SECOND, 0)
				set(Calendar.MILLISECOND, 0)
			}
			val monthStart = cal.timeInMillis
			val monthlyStats = usageStatsManager.queryUsageStats(
				UsageStatsManager.INTERVAL_DAILY, monthStart, now
			)

            val result = WritableNativeMap()
			val todayArr = WritableNativeArray()
            todayStats?.filter { it.totalTimeInForeground > 0 }?.forEach { usage ->
                val item = WritableNativeMap()
                item.putString("packageName", usage.packageName)
				item.putString("appName", getAppNameFromPackage(usage.packageName))
				item.putString("iconBase64", getAppIconBase64(usage.packageName))
                item.putDouble("totalTimeInForeground", usage.totalTimeInForeground.toDouble() / 1000) // 초 단위
                todayArr.pushMap(item)
            }
			result.putArray("today", todayArr)

			val weeklyByDay = WritableNativeMap()
            for ((day: String, appMap: MutableMap<String, Double>) in weeklyMap) {
				val dayArray = WritableNativeArray()

				for ((packageName, timeInSec) in appMap) {
					val item = WritableNativeMap()
					item.putString("packageName", packageName)
					item.putString("appName", getAppNameFromPackage(packageName))
					item.putString("iconBase64", getAppIconBase64(packageName))
					item.putDouble("totalTimeInForeground", timeInSec)
					dayArray.pushMap(item)
				}

				weeklyByDay.putArray(day, dayArray)
			}
			result.putMap("weekly", weeklyByDay)

			val monthlyArr = WritableNativeArray()
            monthlyStats?.filter { it.totalTimeInForeground > 0 }?.forEach { usage ->
                val item = WritableNativeMap()
                item.putString("packageName", usage.packageName)
				item.putString("appName", getAppNameFromPackage(usage.packageName))
				item.putString("iconBase64", getAppIconBase64(usage.packageName))
                item.putDouble("totalTimeInForeground", usage.totalTimeInForeground.toDouble() / 1000) // 초 단위
                monthlyArr.pushMap(item)
            }
			result.putArray("monthly", monthlyArr)

            promise.resolve(result)
        } catch (e: Exception) {
            Log.e("USAGE_MONITOR", "Failed to fetch usage stats", e)
            promise.reject("USAGE_ERROR", "Failed to get usage stats", e)
        }
    }
}

