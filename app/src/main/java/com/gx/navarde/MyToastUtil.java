package com.gx.navarde;

import android.content.Context;
import android.widget.Toast;

/**
 * Toast工具类
 * Created by 70391 on 2019/4/29.
 */

public class MyToastUtil {

    private static Toast toast_short = null;
    private static Toast toast_long = null;

    /**
     * 显示短吐司
     *
     * @param context 上下文对象
     * @param content 吐司内容
     */
    public static void showShortToast(Context context, String content) {
        if (toast_short == null) {
            toast_short = Toast.makeText(context.getApplicationContext(), content, Toast.LENGTH_SHORT);
        } else {
            toast_short.setText(content);
        }
        toast_short.show();
    }

    /**
     * 显示长吐司
     *
     * @param context 上下文对象
     * @param content 吐司内容
     */
    public static void showLongToast(Context context, String content) {
        if (toast_long == null) {
            toast_long = Toast.makeText(context.getApplicationContext(), content, Toast.LENGTH_LONG);
        } else {
            toast_long.setText(content);
        }
        toast_long.show();
    }

}
