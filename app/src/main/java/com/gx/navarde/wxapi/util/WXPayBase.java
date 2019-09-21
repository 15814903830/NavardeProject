package com.gx.navarde.wxapi.util;

public class WXPayBase {

    /**
     * code : 200
     * message : ok
     * data : {"payment_type":2,"order_info":{"appid":"wx4d72f0b3ff96cebc","partnerid":"1548343621","prepayid":"wx201401221130057c6b0c447b1881731000","timestamp":"1568959282","noncestr":"8UiUtv4cYMc5GusV","package":"Sign=WXPay","sign":"034A284C74429D5AE93E26D1B65B00DA"}}
     */

    private int code;
    private String message;
    private DataBean data;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public DataBean getData() {
        return data;
    }

    public void setData(DataBean data) {
        this.data = data;
    }

    public static class DataBean {
        /**
         * payment_type : 2
         * order_info : {"appid":"wx4d72f0b3ff96cebc","partnerid":"1548343621","prepayid":"wx201401221130057c6b0c447b1881731000","timestamp":"1568959282","noncestr":"8UiUtv4cYMc5GusV","package":"Sign=WXPay","sign":"034A284C74429D5AE93E26D1B65B00DA"}
         */

        private int payment_type;
        private OrderInfoBean order_info;

        public int getPayment_type() {
            return payment_type;
        }

        public void setPayment_type(int payment_type) {
            this.payment_type = payment_type;
        }

        public OrderInfoBean getOrder_info() {
            return order_info;
        }

        public void setOrder_info(OrderInfoBean order_info) {
            this.order_info = order_info;
        }

        public static class OrderInfoBean {
            /**
             * appid : wx4d72f0b3ff96cebc
             * partnerid : 1548343621
             * prepayid : wx201401221130057c6b0c447b1881731000
             * timestamp : 1568959282
             * noncestr : 8UiUtv4cYMc5GusV
             * package : Sign=WXPay
             * sign : 034A284C74429D5AE93E26D1B65B00DA
             */

            private String appid;
            private String partnerid;
            private String prepayid;
            private String timestamp;
            private String noncestr;
            private String packageX;
            private String sign;

            public String getAppid() {
                return appid;
            }

            public void setAppid(String appid) {
                this.appid = appid;
            }

            public String getPartnerid() {
                return partnerid;
            }

            public void setPartnerid(String partnerid) {
                this.partnerid = partnerid;
            }

            public String getPrepayid() {
                return prepayid;
            }

            public void setPrepayid(String prepayid) {
                this.prepayid = prepayid;
            }

            public String getTimestamp() {
                return timestamp;
            }

            public void setTimestamp(String timestamp) {
                this.timestamp = timestamp;
            }

            public String getNoncestr() {
                return noncestr;
            }

            public void setNoncestr(String noncestr) {
                this.noncestr = noncestr;
            }

            public String getPackageX() {
                return packageX;
            }

            public void setPackageX(String packageX) {
                this.packageX = packageX;
            }

            public String getSign() {
                return sign;
            }

            public void setSign(String sign) {
                this.sign = sign;
            }
        }
    }
}
