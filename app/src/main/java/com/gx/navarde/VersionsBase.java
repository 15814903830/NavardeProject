package com.gx.navarde;

public class VersionsBase {

    /**
     * code : 200
     * message : ok
     * data : {"ios":{"version":"1.0","force_update":0,"link":"www.baidu.com","summary":"版本描述版本描述"},"android":{"version":"1.0","force_update":0,"link":"www.baidu.com/2123","summary":"版本描述版本描述"}}
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
         * ios : {"version":"1.0","force_update":0,"link":"www.baidu.com","summary":"版本描述版本描述"}
         * android : {"version":"1.0","force_update":0,"link":"www.baidu.com/2123","summary":"版本描述版本描述"}
         */

        private IosBean ios;
        private AndroidBean android;

        public IosBean getIos() {
            return ios;
        }

        public void setIos(IosBean ios) {
            this.ios = ios;
        }

        public AndroidBean getAndroid() {
            return android;
        }

        public void setAndroid(AndroidBean android) {
            this.android = android;
        }

        public static class IosBean {
            /**
             * version : 1.0
             * force_update : 0
             * link : www.baidu.com
             * summary : 版本描述版本描述
             */

            private String version;
            private int force_update;
            private String link;
            private String summary;

            public String getVersion() {
                return version;
            }

            public void setVersion(String version) {
                this.version = version;
            }

            public int getForce_update() {
                return force_update;
            }

            public void setForce_update(int force_update) {
                this.force_update = force_update;
            }

            public String getLink() {
                return link;
            }

            public void setLink(String link) {
                this.link = link;
            }

            public String getSummary() {
                return summary;
            }

            public void setSummary(String summary) {
                this.summary = summary;
            }
        }

        public static class AndroidBean {
            /**
             * version : 1.0
             * force_update : 0
             * link : www.baidu.com/2123
             * summary : 版本描述版本描述
             */

            private String version;
            private int force_update;
            private String link;
            private String summary;

            public String getVersion() {
                return version;
            }

            public void setVersion(String version) {
                this.version = version;
            }

            public int getForce_update() {
                return force_update;
            }

            public void setForce_update(int force_update) {
                this.force_update = force_update;
            }

            public String getLink() {
                return link;
            }

            public void setLink(String link) {
                this.link = link;
            }

            public String getSummary() {
                return summary;
            }

            public void setSummary(String summary) {
                this.summary = summary;
            }
        }
    }
}
