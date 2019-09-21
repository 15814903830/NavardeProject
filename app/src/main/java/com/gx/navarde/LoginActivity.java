package com.gx.navarde;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.AppCompatActivity;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.style.ForegroundColorSpan;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.gx.navarde.dialog.BaseNiceDialog;
import com.gx.navarde.dialog.NiceDialog;
import com.gx.navarde.dialog.ViewConvertListener;
import com.gx.navarde.dialog.ViewHolder;
import com.gx.navarde.http.HttpCallBack;
import com.gx.navarde.http.OkHttpUtils;
import com.gx.navarde.status.StatusBarUtil;

import org.json.JSONException;
import org.json.JSONObject;

public class LoginActivity extends AppCompatActivity implements View.OnClickListener, HttpCallBack {

    public static final String HTTP_URL_PRE = "http://app.cnwdhome.com";
    //发送验证码
    private static final String sendCodeUrl = HTTP_URL_PRE + "/default/verify-code";
    //登录
    private static final String loginUrl = HTTP_URL_PRE + "/user/login";

    private EditText et_phone;
    private EditText et_code;
    private TextView tv_send;
    private TextView tv_login;
    private TextView tv_agreement;

    private Context mContext;

    private HttpCallBack mCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        //修改状态栏的文字颜色为黑色
        int flag = StatusBarUtil.StatusBarLightMode(this);
        StatusBarUtil.StatusBarLightMode(this, flag);

        mContext = this;

        mCallback = this;

        initView();
        initEvents();

        String token = BaseUtils.getValue(this, BaseUtils.KEY_ACCESS_TOKEN);
        if (!token.isEmpty()) {
            turnToMain();
        }
    }

    private void initEvents() {
        tv_send.setOnClickListener(this);
        tv_login.setOnClickListener(this);
        tv_agreement.setOnClickListener(this);
    }

    private void initView() {
        et_phone = findViewById(R.id.et_phone_login);
        et_code = findViewById(R.id.et_code_login);
        tv_send = findViewById(R.id.tv_send_login);
        tv_login = findViewById(R.id.tv_login);
        tv_agreement = findViewById(R.id.tv_agreement_login);

        tv_send.setText("发送验证码");
        setAgreementText();
    }

    private void setAgreementText() {
        String one = "登录即代表您已同意";
        String two = "《APP服务协议》";
        String agreement = one + two;
        SpannableString ss = new SpannableString(agreement);
        ss.setSpan(new ForegroundColorSpan(Color.parseColor("#E2BD8A")),
                one.length(), agreement.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        tv_agreement.setText(ss);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.tv_send_login:
                sendCode();
                break;
            case R.id.tv_login:
                login();
                break;
            case R.id.tv_agreement_login:
                turnToAgreement();
                break;
        }
    }

    /**
     * 发送验证码
     */
    private void sendCode() {
        final String phone = et_phone.getText().toString();
        if (phone.isEmpty()) {
            MyToastUtil.showShortToast(mContext, "请输入手机号");
            return;
        }
        new Thread() {
            @Override
            public void run() {
                super.run();
                try {
                    JSONObject object = new JSONObject();
                    object.put("phone", phone);
                    OkHttpUtils.doPostJson(sendCodeUrl, object.toString(), mCallback, 0);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }.start();
    }

    private CountDownTimer mTimer = new CountDownTimer(60000, 1000) {
        @Override
        public void onTick(long millisUntilFinished) {
            tv_send.setEnabled(false);
            long last = millisUntilFinished / 1000;
            String send = last + "s重新发送";
            tv_send.setText(send);
        }

        @Override
        public void onFinish() {
            tv_send.setEnabled(true);
            tv_send.setText("发送验证码");
        }
    };

    /**
     * 登录
     */
    private void login() {
        final String phone = et_phone.getText().toString();
        if (phone.isEmpty()) {
            MyToastUtil.showShortToast(mContext, "请输入手机号");
            return;
        }
        final String code = et_code.getText().toString();
        if (code.isEmpty()) {
            MyToastUtil.showShortToast(mContext, "请输入验证码");
            return;
        }
        showLoading();
        new Thread() {
            @Override
            public void run() {
                super.run();
                try {
                    JSONObject object = new JSONObject();
                    object.put("phone", phone);
                    object.put("verify_code", code);
                    OkHttpUtils.doPostJson(loginUrl, object.toString(), mCallback, 1);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }.start();
    }

    /**
     * 前往查看协议
     */
    private void turnToAgreement() {
        Intent intent = new Intent(mContext, MainActivity.class);
        intent.putExtra(MainActivity.KEY_IS_AGREEMENT, true);
        startActivity(intent);
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (isFinishing()) {
            if (mTimer != null) {
                mTimer.cancel();
                mTimer = null;
            }
        }
    }

    @Override
    public void onResponse(String response, int requestId) {
        Message message = mHandler.obtainMessage();
        message.what = requestId;
        message.obj = response;
        mHandler.sendMessage(message);
    }

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
    public void onHandlerMessageCallback(String response, int requestId) {
        Log.e("TAG", "onHandlerMessageCallback: " + response);
        hideLoading();
        switch (requestId) {
            case 0:
                try {
                    JSONObject object = new JSONObject(response);
                    int code = object.optInt("code", -1);
                    if (code == 200) {
                        mTimer.start();
                    } else {
                        String message = object.getString("message");
                        MyToastUtil.showShortToast(mContext, message);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case 1:
                try {
                    JSONObject object = new JSONObject(response);
                    int code = object.optInt("code", -1);
                    if (code == 200) {
                        JSONObject json = object.getJSONObject("data");
                        String token = json.getString("access_token");
                        BaseUtils.saveAccessToken(mContext, token);
                        turnToMain();
                    } else {
                        String message = object.getString("message");
                        MyToastUtil.showShortToast(mContext, message);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
        }
    }

    /**
     * 前往主页
     */
    private void turnToMain() {
//        Intent intent = new Intent();
//        intent.putExtra(MainActivity.KEY_REFRESH, true);
//        setResult(0, intent);
//        finish();
        startActivity(new Intent(mContext, MainActivity.class));
        finish();
    }

    private BaseNiceDialog mDialog;

    /**
     * 显示loading
     */
    public void showLoading() {
        NiceDialog.init()
                .setLayoutId(R.layout.dialog_loading_layout)
                .setConvertListener(new ViewConvertListener() {
                    @Override
                    protected void convertView(ViewHolder holder, BaseNiceDialog dialog) {
                        mDialog = dialog;
                    }
                })
                .setOutCancel(false)
                .setWidth(48)
                .setHeight(48)
                .setShowBottom(false)
                .show(getSupportFragmentManager());
    }

    /**
     * 隐藏loading
     */
    public void hideLoading() {
        if (mDialog != null) {
            mDialog.dismiss();
        }
    }

}
