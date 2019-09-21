package com.gx.navarde.http;

import android.support.annotation.NonNull;

/**
 * 网络请求参数
 */
public class RequestParams implements Comparable<RequestParams> {

    private String key;
    private String value;

    public RequestParams() {
    }

    public RequestParams(String key, String value) {
        this.key = key;
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public int compareTo(@NonNull RequestParams o) {
        return (this.getKey().compareTo(o.getKey()));
    }
}
