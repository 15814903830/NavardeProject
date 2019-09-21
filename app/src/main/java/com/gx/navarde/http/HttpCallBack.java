package com.gx.navarde.http;

public interface HttpCallBack {

    void onResponse(String response, int requestId);

    void onHandlerMessageCallback(String response, int requestId);

}
