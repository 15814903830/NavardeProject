package com.gx.navarde.versionupdating;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class AppInstallReceiver extends BroadcastReceiver {



    @Override
    public void onReceive(Context context, Intent intent) {

        if (intent.getAction().equals("com.example.downloadandinstallapk.apk")) {
            intent=null;
            Log.e("getAction","----------");
        }


    }

}