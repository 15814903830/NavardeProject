package com.gx.navarde.wxapi;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import com.gx.navarde.App;
import com.gx.navarde.R;
import com.gx.navarde.paybase.UserUtils;
import com.gx.navarde.wxapi.util.WeiXinConstants;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

public class WXPayEntryActivity extends AppCompatActivity implements IWXAPIEventHandler {
    private IWXAPI msgApi;
    private UserUtils userUtils;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pay_success);
        regToWx();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        msgApi.handleIntent(intent, this);
    }
    @Override
    public void onReq(BaseReq req) {
    }

    @SuppressLint("StringFormatInvalid")
    @Override
    public void onResp(BaseResp resp) {
        if(resp.getType()==ConstantsAPI.COMMAND_PAY_BY_WX){
            if (resp.errCode==0){
                userUtils = ((App)getApplication()).getUserUtils();
                userUtils.PayState(true);
                finish();
            }else {
                userUtils = ((App)getApplication()).getUserUtils();
                userUtils.PayState(false);
                finish();
            }
        }
    }

    private void regToWx() {
        msgApi = WXAPIFactory.createWXAPI(this, WeiXinConstants.APP_ID);
        msgApi.handleIntent(getIntent(), this);
    }

}
