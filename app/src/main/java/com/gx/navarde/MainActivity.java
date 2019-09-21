package com.gx.navarde;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.alibaba.fastjson.JSON;
import com.alipay.sdk.app.PayTask;
import com.gx.navarde.dialog.BaseNiceDialog;
import com.gx.navarde.dialog.NiceDialog;
import com.gx.navarde.dialog.ViewConvertListener;
import com.gx.navarde.dialog.ViewHolder;
import com.gx.navarde.http.HttpCallBack;
import com.gx.navarde.http.OkHttpUtils;
import com.gx.navarde.paybase.Myinter;
import com.gx.navarde.paybase.PayResult;
import com.gx.navarde.status.StatusBarUtil;
import com.gx.navarde.versionupdating.Constants;
import com.gx.navarde.versionupdating.PermissionUtils;
import com.gx.navarde.wxapi.util.WXPayBase;
import com.gx.navarde.wxapi.util.WeiXinConstants;
import com.maning.updatelibrary.InstallUtils;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.winfo.photoselector.PhotoSelector;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import pub.devrel.easypermissions.EasyPermissions;

public class MainActivity extends AppCompatActivity implements EasyPermissions.PermissionCallbacks, HttpCallBack, Myinter {
    // IWXAPI 是第三方app和微信通信的openApi接口
    private IWXAPI msgApi;
    public String TAG = "MainActivity";
    public static final String KEY_IS_AGREEMENT = "agreement";
    public static final String KEY_REFRESH = "refresh";

    private static final String[] permissions = new String[]{
            Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.CAMERA};

    private static final String[] write_permissions = new String[]{
            Manifest.permission.WRITE_EXTERNAL_STORAGE};

    private static final int RC_CAMERA_PERM = 123;

    private static final String tip = "APP需要存储权限用来上传头像";

    private WebView webView;

    private ValueCallback<Uri[]> mCallback;

    private String mServiceUrl = "file:///android_asset/html/service-agreement.html";

    private String mUrl = "file:///android_asset/html/home.html";

    private String mCurUrl = "";
    private String mToken = "";
    private HttpCallBack httpCallBack;


    private static final int REQUEST_EXTERNAL_STORAGE = 1;
    private static String[] PERMISSIONS_STORAGE = {
            "android.permission.READ_EXTERNAL_STORAGE",
            "android.permission.WRITE_EXTERNAL_STORAGE"};
    private static final int RC_HANDLE_CAMERA_PERM_RGB = 1;
    private InstallUtils.DownloadCallBack downloadCallBack;
    private String apkDownloadPath = "";
    TextView tv_time;
    @SuppressLint("HandlerLeak")
    private Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            int requestId = msg.what;
            String response = (String) msg.obj;
            onHandlerMessageCallback(response, requestId);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        httpCallBack = this;
        //修改状态栏的文字颜色为黑色
        int flag = StatusBarUtil.StatusBarLightMode(this);
        StatusBarUtil.StatusBarLightMode(this, flag);

        boolean isAgreement = getIntent().getBooleanExtra(KEY_IS_AGREEMENT, false);
        if (isAgreement) {
            mUrl = mServiceUrl;
        }
        initView();
        initEvents();
        mToken = BaseUtils.getValue(this, BaseUtils.KEY_ACCESS_TOKEN);
        if (mToken.isEmpty()) {
            webView.loadUrl(mUrl);
        } else {
            mCurUrl = mUrl;
            refresh();
        }
        initCallBack();
        initPermission();
        getversion();
    }

    private void initEvents() {
        webView.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                if (mCurUrl.contains("share-it.html")) {
                    WebView.HitTestResult hitTestResult = webView.getHitTestResult();
                    if (hitTestResult.getType() == WebView.HitTestResult.IMAGE_TYPE ||
                            hitTestResult.getType() == WebView.HitTestResult.SRC_IMAGE_ANCHOR_TYPE) {
                        showSaveImage("html/img/share-poster.png");
                        return true;
                    }
                }
                return false;
            }
        });
    }

    /**
     * 显示保存图片对话框
     *
     * @param imageUrl
     */
    private void showSaveImage(String imageUrl) {
        NiceDialog.init()
                .setLayoutId(R.layout.dialog_save_image_layout)
                .setConvertListener(new ViewConvertListener() {
                    @Override
                    protected void convertView(ViewHolder holder, BaseNiceDialog dialog) {
                        TextView tv_save = holder.getView(R.id.tv_save_image_dialog);
                        tv_save.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                if (EasyPermissions.hasPermissions(MainActivity.this, permissions)) {
                                    saveImage(imageUrl);
                                    dialog.dismiss();
                                } else {
                                    EasyPermissions.requestPermissions(MainActivity.this, tip, RC_CAMERA_PERM, permissions);
                                }
                            }
                        });
                    }
                })
                .setMargin(64)
                .setHeight(44)
                .show(getSupportFragmentManager());
    }

    private String mImageUrl = "";

    /**
     * 保存图片
     *
     * @param imageUrl
     */
    private void saveImage(String imageUrl) {
        mImageUrl = imageUrl;
        new Thread() {
            @Override
            public void run() {
                super.run();
                imageUrlToBitmap(imageUrl);
            }
        }.start();
    }

    /**
     * 图片链接转bitmap
     *
     * @param imageUrl
     */
    private void imageUrlToBitmap(String imageUrl) {
        Bitmap bitmap = null;
        AssetManager assetManager = getAssets();
        try {
            InputStream inputStream = assetManager.open(imageUrl);
            bitmap = BitmapFactory.decodeStream(inputStream);
            if (bitmap != null) {
                save2Album(bitmap);
            }
            inputStream.close();

//            URL iconUrl = new URL(imageUrl);
//            URLConnection conn = iconUrl.openConnection();
//            HttpURLConnection http = (HttpURLConnection) conn;
//            int length = http.getContentLength();
//            conn.connect();
//            // 获得图像的字符流
//            InputStream is = conn.getInputStream();
//            BufferedInputStream bis = new BufferedInputStream(is, length);
//            bitmap = BitmapFactory.decodeStream(bis);
//            bis.close();
//            is.close();
//            if (bitmap != null) {
//                save2Album(bitmap);
//            }

        } catch (Exception e) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    MyToastUtil.showShortToast(MainActivity.this, "保存失败");
                }
            });
            e.printStackTrace();
        }
    }

    /**
     * 保存到相册
     *
     * @param bitmap
     */
    private void save2Album(Bitmap bitmap) {
        File appDir = new File(Environment.getExternalStorageDirectory(), "Navarde");
        if (!appDir.exists()) appDir.mkdir();
        String[] str = mImageUrl.split("/");
        String fileName = str[str.length - 1];
        File file = new File(appDir, fileName);
        try {
            FileOutputStream fos = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, fos);
            fos.flush();
            fos.close();
            onSaveSuccess(file);
        } catch (IOException e) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    MyToastUtil.showShortToast(MainActivity.this, "保存失败");
                }
            });
            e.printStackTrace();
        }
    }

    /**
     * 保存成功，并发送广播通知相册
     *
     * @param file
     */
    private void onSaveSuccess(final File file) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.fromFile(file)));
                MyToastUtil.showShortToast(MainActivity.this, "保存成功");
            }
        });
    }

    private void initPermission() {
        if (!EasyPermissions.hasPermissions(this, permissions)) {
            EasyPermissions.requestPermissions(this, tip, RC_CAMERA_PERM, permissions);
        }
    }

    private void initView() {
        webView = findViewById(R.id.web_view);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView webView, String s) {
                if (s.contains("www.gx11.cn")) {
                    finish();
                } else if (s.contains("login")) {
                    BaseUtils.saveAccessToken(MainActivity.this, "");
                    startActivity(new Intent(MainActivity.this, LoginActivity.class));
                } else if (s.contains("order_id")) {
                    commitanswers(s.split("\\?")[1].split("=")[1]);
                } else {
                    mCurUrl = s;
                    webView.loadUrl(s);
                }
                return true;
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> valueCallback, FileChooserParams fileChooserParams) {
                mCallback = valueCallback;
                chooseImage();
                return true;
            }
        });
        initWebSettings();
    }

    /**
     * 选择图片
     */
    private void chooseImage() {
        if (!EasyPermissions.hasPermissions(this, permissions)) {
            EasyPermissions.requestPermissions(this, tip, RC_CAMERA_PERM, permissions);
        } else {
            PhotoSelector.builder()
                    .setShowCamera(true)//显示拍照
                    .setSingle(true)
                    .setCrop(true)
                    .setCropMode(PhotoSelector.CROP_CIRCLE)
                    .start(MainActivity.this, 1);
        }
    }

    private void turnToLogin() {
        Intent intent = new Intent(this, LoginActivity.class);
        startActivityForResult(intent, 2);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1) {
            if (resultCode == RESULT_OK && data != null) {
                Uri resultUri = PhotoSelector.getCropImageUri(data);
                mCallback.onReceiveValue(new Uri[]{resultUri});
                mCallback = null;
            }
        } else if (requestCode == 2) {
            if (data != null) {
                boolean isNeedRefresh = data.getBooleanExtra(KEY_REFRESH, false);
                if (isNeedRefresh) {
                    mToken = BaseUtils.getValue(this, BaseUtils.KEY_ACCESS_TOKEN);
                    refresh();
                }
            }
        }
    }

    /**
     * 刷新网页
     */
    private void refresh() {
        if (webView != null) {
            webView.clearHistory();
            webView.loadUrl(mCurUrl + "?user_token=" + mToken);
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void initWebSettings() {
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        //允许js代码
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        //禁用放缩
        webSettings.setDisplayZoomControls(false);
        webSettings.setBuiltInZoomControls(false);
        //禁用文字缩放
        webSettings.setTextZoom(100);
        //自动加载图片
        webSettings.setLoadsImagesAutomatically(true);
        //允许访问文件
        webSettings.setAllowFileAccess(true);

        webSettings.setLoadWithOverviewMode(true);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (webView != null) {
            webView.loadDataWithBaseURL(null, "", "text/html", "utf-8", null);
            webView.clearHistory();

            ((ViewGroup) webView.getParent()).removeView(webView);
            webView.destroy();
            webView = null;
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        EasyPermissions.onRequestPermissionsResult(requestCode, permissions, grantResults, this);
    }

    @Override
    public void onPermissionsGranted(int requestCode, @NonNull List<String> perms) {

    }

    @Override
    public void onPermissionsDenied(int requestCode, @NonNull List<String> perms) {

    }

    private void commitanswers(String order_id) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("order_id", order_id);//订单id
                    OkHttpUtils.doPostJson(LoginActivity.HTTP_URL_PRE + "/order/payment?user_token=" + mToken, jsonObject.toString(), httpCallBack, 0);
                } catch (JSONException e) {
                    e.printStackTrace();

                }
            }
        }).start();
    }

    private void getversion() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                OkHttpUtils.doGet(LoginActivity.HTTP_URL_PRE + "/default/app-info", httpCallBack, 1);
            }
        }).start();
    }


    @Override
    public void onResponse(String response, int requestId) {
        Message message = mHandler.obtainMessage();
        message.what = requestId;
        message.obj = response;
        mHandler.sendMessage(message);
    }

    @Override
    public void onHandlerMessageCallback(String response, int requestId) {
        Log.e(TAG, response);
        switch (requestId) {
            case 0:
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    JSONObject jsonObject2 = new JSONObject(jsonObject.getString("data"));
                    String payment_type = jsonObject2.getString("payment_type");
                    if (payment_type.equals("2")) {
                        //微信
                        WXPayBase wxPayBase = JSON.parseObject(response, WXPayBase.class);
                        wxpay(wxPayBase);
                    } else {
                        //支付宝
                        paystart(jsonObject2.getString("order_info"));
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                break;
            case 1:
                VersionsBase versionsBase = JSON.parseObject(response, VersionsBase.class);
                showupdata(versionsBase);
                break;
        }
    }


    private void paystart(final String info) {
        Log.e("info", info);
        Runnable payRunnable = new Runnable() {
            @Override
            public void run() {
                Log.e("info", info);
                PayTask alipay = new PayTask(MainActivity.this);
                Map<String, String> result = alipay.payV2(info, true);
                Message msg = new Message();
                msg.what = 1;
                msg.obj = result;
                mHandler2.sendMessage(msg);
            }
        };
        // 必须异步调用
        Thread payThread = new Thread(payRunnable);
        payThread.start();
    }

    private void wxpay(WXPayBase wxPayBase) {
        Log.e("wxpay", "-------wxpay");
        PayReq request = new PayReq();
        request.appId = wxPayBase.getData().getOrder_info().getAppid();
        request.partnerId = wxPayBase.getData().getOrder_info().getPartnerid();
        request.prepayId = wxPayBase.getData().getOrder_info().getPrepayid();
        request.packageValue = "Sign=WXPay";
        request.nonceStr = wxPayBase.getData().getOrder_info().getNoncestr();
        request.timeStamp = wxPayBase.getData().getOrder_info().getTimestamp();
        request.sign = wxPayBase.getData().getOrder_info().getSign();
        boolean result = msgApi.sendReq(request);
        if (result) {

        } else {
            Toast.makeText(this, "支付失败", Toast.LENGTH_SHORT).show();
        }
    }

    private void regToWx() {
        msgApi = WXAPIFactory.createWXAPI(this, WeiXinConstants.APP_ID, false);
        // 将该app注册到微信
        msgApi.registerApp(WeiXinConstants.APP_ID);
    }

    @Override
    protected void onStart() {
        super.onStart();
        regToWx();
        ((App) getApplication()).getUserUtils().setiFun(this);
    }

    @SuppressLint("HandlerLeak")
    private Handler mHandler2 = new Handler() {
        @SuppressWarnings("unused")
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case 1: {
                    @SuppressWarnings("unchecked")
                    PayResult payResult = new PayResult((Map<String, String>) msg.obj);
                    /**
                     对于支付结果，请商户依赖服务端的异步通知结果。同步通知结果，仅作为支付结束的通知。
                     */
                    String resultInfo = payResult.getResult();// 同步返回需要验证的信息
                    String resultStatus = payResult.getResultStatus();
                    // 判断resultStatus 为9000则代表支付成功
                    if (TextUtils.equals(resultStatus, "9000")) {
                        // 该笔订单是否真实支付成功，需要依赖服务端的异步通知。
                        webView.loadUrl("file:///android_asset/html/pay-ok.html");
                    } else {
                        // 该笔订单真实的支付结果，需要依赖服务端的异步通知。
                        Toast.makeText(MainActivity.this, "支付已取消", Toast.LENGTH_SHORT).show();
                    }
                    break;
                }
            }
        }
    };

    @Override
    public void myss(boolean mboolean) {
        if (mboolean) {
            webView.loadUrl("file:///android_asset/html/pay-ok.html");
        } else {
            Toast.makeText(this, "支付已取消", Toast.LENGTH_SHORT).show();
        }
    }

    public void showupdata(final VersionsBase versionsBase) {
        if (BaseUtils.checkVersion(this,versionsBase.getData().getAndroid().getVersion())){
            showversiondialog(versionsBase);
        }
    }


    public void showversiondialog(VersionsBase versionsBase) {
        NiceDialog.init()
                .setLayoutId(R.layout.version_updating)
                .setConvertListener(new ViewConvertListener() {
                    @Override
                    protected void convertView(ViewHolder holder, final BaseNiceDialog dialog) {
                        TextView tv_text = holder.getView(R.id.tv_text);//更新内容
                        tv_text.setText(versionsBase.getData().getAndroid().getSummary());
                        LinearLayout ll_suspend_for_immediately = holder.getView(R.id.ll_suspend_for_immediately);//暂停更新和立即更新
                        TextView tv_suspend = holder.getView(R.id.tv_suspend);//取消更新
                        TextView tv_immediately = holder.getView(R.id.tv_immediately);//立即更新
                         tv_time = holder.getView(R.id.tv_time);//更新进度
                        if (versionsBase.getData().getAndroid().getForce_update()==1){
                            tv_suspend.setVisibility(View.GONE);
                        }
                        tv_suspend.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                dialog.dismiss();
                            }
                        });


                        tv_immediately.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                ll_suspend_for_immediately.setVisibility(View.GONE);
                                tv_time.setVisibility(View.VISIBLE);
                                //   initCallBack();
                                Toast.makeText(MainActivity.this, "正在更新请勿退出", Toast.LENGTH_SHORT).show();
                                Intent intent = new Intent("com.example.downloadandinstallapk.apk");
                                //也可以像注释这样写
                                sendBroadcast(intent);//发送标准广播
                                sendOrderedBroadcast(intent, null);//发送有序广播
                                //意思就是发送值为com.example.mymessage的这样一条广播
                                //申请SD卡权限''
                                if (!PermissionUtils.isGrantSDCardReadPermission(MainActivity.this)) {
                                    Log.e("if", "-----");
                                    verifyStoragePermissions(MainActivity.this);
                                    PermissionUtils.requestSDCardReadPermission(MainActivity.this, 100);
                                } else {
                                    InstallUtils.with(MainActivity.this)
                                            //必须-下载地址
                                            .setApkUrl(versionsBase.getData().getAndroid().getLink())
                                            //非必须-下载保存的文件的完整路径+name.apk
                                            .setApkPath(Constants.APK_SAVE_PATH)
                                            //非必须-下载回调
                                            .setCallBack(downloadCallBack)
                                            //开始下载
                                            .startDownload();
                                }
                            }
                        });
                        tv_suspend.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                dialog.dismiss();
                            }
                        });

                    }
                })
                .setDimAmount(0.3f)
                .setShowBottom(false)
                .setAnimStyle(R.style.PracticeModeAnimation)
                .setOutCancel(false) //触摸外部是否取消
                .show(getSupportFragmentManager());
    }


    public static void verifyStoragePermissions(Activity activity) {

        try {
            //检测是否有写的权限
            int permission = ActivityCompat.checkSelfPermission(activity,
                    "android.permission.WRITE_EXTERNAL_STORAGE");
            if (permission != PackageManager.PERMISSION_GRANTED) {
                // 没有写的权限，去申请写的权限，会弹出对话框
                ActivityCompat.requestPermissions(activity, PERMISSIONS_STORAGE, REQUEST_EXTERNAL_STORAGE);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void initCallBack() {
        downloadCallBack = new InstallUtils.DownloadCallBack() {
            @Override
            public void onStart() {
                //                tv_progress.setText("0%");
                //                tv_info.setText("正在下载...");
                //                btnDownload.setClickable(false);
                //                btnDownload.setBackgroundResource(R.color.colorPrimary);
            }

            @Override
            public void onComplete(String path) {
                apkDownloadPath = path;
                //先判断有没有安装权限
                InstallUtils.checkInstallPermission(MainActivity.this, new InstallUtils.InstallPermissionCallBack() {
                    @Override
                    public void onGranted() {
                        //去安装APK
                        installApk(apkDownloadPath);
                    }

                    @Override
                    public void onDenied() {
                        //弹出弹框提醒用户
                        AlertDialog alertDialog = new AlertDialog.Builder(MainActivity.this)
                                .setTitle("温馨提示")
                                .setMessage("必须授权才能安装APK，请设置允许安装")
                                .setNegativeButton("取消", null)
                                .setPositiveButton("设置", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        //打开设置页面
                                        InstallUtils.openInstallPermissionSetting(MainActivity.this, new InstallUtils.InstallPermissionCallBack() {
                                            @Override
                                            public void onGranted() {
                                                //去安装APK
                                                installApk(apkDownloadPath);
                                            }

                                            @Override
                                            public void onDenied() {
                                                //还是不允许咋搞？
                                            }
                                        });
                                    }
                                })
                                .create();
                        alertDialog.show();
                    }
                });
            }

            @Override
            public void onLoading(long total, long current) {
                //内部做了处理，onLoading 进度转回progress必须是+1，防止频率过快
                int progress = (int) (current * 100 / total);
                tv_time.setText("正在更新中" + progress + "%"+"，请勿关闭APP");
            }

            @Override
            public void onFail(Exception e) {
            }

            @Override
            public void cancle() {
            }
        };
    }

    private void installApk(String path) {
        InstallUtils.installAPK(MainActivity.this, path, new InstallUtils.InstallCallBack() {
            @Override
            public void onSuccess() {
                //onSuccess：表示系统的安装界面被打开
                //防止用户取消安装，在这里可以关闭当前应用，以免出现安装被取消
                Toast.makeText(MainActivity.this, "正在安装程序", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFail(Exception e) {
                //tv_info.setText("安装失败:" + e.toString());
            }
        });
    }

}
