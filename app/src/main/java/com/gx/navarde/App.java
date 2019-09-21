package com.gx.navarde;

import android.app.Application;

import com.gx.navarde.paybase.UserUtils;
import com.tencent.smtt.sdk.QbSdk;

public class App extends Application {
    private UserUtils userUtils;
    @Override
    public void onCreate() {
        super.onCreate();
        QbSdk.initX5Environment(this, null);
        userUtils = new UserUtils();
    }

    public UserUtils getUserUtils() {
        return userUtils;
    }
}
