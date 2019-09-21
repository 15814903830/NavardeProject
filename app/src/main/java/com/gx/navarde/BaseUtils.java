package com.gx.navarde;

import android.app.ActivityManager;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import com.gx.navarde.versionupdating.DataFormatUtil;

import java.util.List;

public class BaseUtils {

    public static final String KEY_ACCESS_TOKEN = "access_token";

    /**
     * 获取版本号
     *
     * @param context
     * @return
     */
    public static int getVersionCode(Context context) {
        PackageManager pm = context.getPackageManager();
        int code = 0;
        try {
            PackageInfo packageInfo = pm.getPackageInfo(context.getPackageName(), 0);
            code = packageInfo.versionCode;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return code;
    }

    /**
     * 获取版本名称
     *
     * @param context
     * @return
     */
    public static String getVersionName(Context context) {
        PackageManager manager = context.getPackageManager();
        String name = "";
        try {
            PackageInfo info = manager.getPackageInfo(context.getPackageName(), 0);
            name = info.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return name;
    }

    /**
     * 保存值
     *
     * @param context
     * @param key
     * @param value
     */
    public static void saveValue(Context context, String key, String value) {
        SharedPreferences sharedPreferences = context.getApplicationContext()
                .getSharedPreferences("base", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(key, value);
        editor.apply();
    }

    /**
     * 获取值
     *
     * @param context
     * @param key
     * @return
     */
    public static String getValue(Context context, String key) {
        SharedPreferences sharedPreferences = context.getApplicationContext()
                .getSharedPreferences("base", Context.MODE_PRIVATE);
        return sharedPreferences.getString(key, "");
    }

    /**
     * 保存access_token
     *
     * @param context
     * @param access_token
     */
    public static void saveAccessToken(Context context, String access_token) {
        saveValue(context, KEY_ACCESS_TOKEN, access_token);
    }

    /**
     * 复制内容
     *
     * @param context
     * @param content
     */
    public static void copyContent(Context context, String content) {
        ClipboardManager manager = (ClipboardManager)
                context.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clipData = ClipData.newPlainText("Label", content);
        if (manager != null) {
            manager.setPrimaryClip(clipData);
            MyToastUtil.showShortToast(context, "复制成功");
        }
    }

    /**
     * 判断应用是否已经启动
     *
     * @param context     一个context
     * @param packageName 要判断应用的包名
     * @return boolean
     * * 返回app运行状态
     * 1:程序在前台运行
     * 2:程序在后台运行
     * 3:程序未启动
     */
    public static int isAppAlive(Context context, String packageName) {
        ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningTaskInfo> list = am.getRunningTasks(20);
        //判断程序是否在栈顶
        if (list.get(0).topActivity.getPackageName().equals(packageName)) {
            return 1;
        } else {
            //判断程序是否在栈里
            for (ActivityManager.RunningTaskInfo info : list) {
                if (info.topActivity.getPackageName().equals(packageName)) {
                    return 2;
                }
            }
            return 3;//栈里找不到，返回3
        }
    }

    /**
     * 检查版本
     *
     * @param context
     * @param version
     * @return
     */
    public static boolean checkVersion(Context context, String version) {
        String[] versions = version.split("\\.");
        String[] curVersions = BaseUtils.getVersionName(context).split("\\.");
        boolean hasNewVersion = false;
        if (DataFormatUtil.stringToInt(versions[0]) > DataFormatUtil.stringToInt(curVersions[0])) {
            hasNewVersion = true;
        } else if (DataFormatUtil.stringToInt(versions[1]) > DataFormatUtil.stringToInt(curVersions[1])) {
            hasNewVersion = true;
        } else if (DataFormatUtil.stringToInt(versions[2]) > DataFormatUtil.stringToInt(curVersions[2])) {
            hasNewVersion = true;
        }
        return hasNewVersion;
    }
}
