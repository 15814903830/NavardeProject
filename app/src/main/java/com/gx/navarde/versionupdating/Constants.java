package com.gx.navarde.versionupdating;

import android.os.Environment;

/**
 * @author glsite.com
 * @version $Rev$
 * @des ${TODO}
 * @updateAuthor $Author$
 * @updateDes ${TODO}
 */
public class Constants {
    public static final String APK_URL_01 = "http://download.fir.im/v2/app/install/56dd4bb7e75e2d27f2000046?download_token=e415c0fd1ac3b7abcb65ebc6603c59d9&source=update";
    public static final String APK_URL_02 = "http://download.fir.im/v2/app/install/5a52e936ca87a8600e0002f9?download_token=cd8662357947f151de92975b46082ba6&source=update";
    public static final String APK_SAVE_PATH = Environment.getExternalStorageDirectory().getAbsolutePath() + "/MNUpdateAPK/update.apk";
}
