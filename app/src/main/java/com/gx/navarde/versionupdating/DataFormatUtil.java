package com.gx.navarde.versionupdating;

public class DataFormatUtil {
    /**
     * String转int
     * 如果格式错误，返回-1
     *
     * @param value
     * @return
     */
    public static int stringToInt(String value) {
        try {
            return Integer.valueOf(value);
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    /**
     * 格式化时间
     *
     * @param date
     * @return
     */
    public static String formatDate(String date) {
        String format;
        if (date.contains("T")) {
            format = date.split("T")[0];
            String time = date.split("T")[1];
            if (time.contains(":") && time.split(":").length >= 2) {
                format = format + " " + time.split(":")[0] + ":" + time.split(":")[1];
            }
        } else {
            format = date;
        }
        return format;
    }

    /**
     * 格式化星期
     *
     * @param originalValue
     * @return
     */
    public static String formatWeekDay(String originalValue) {
        String value;
        if (originalValue.contains(",")) {
            StringBuilder sb = new StringBuilder();
            String[] strings = originalValue.split(",");
            for (int i = 0; i < strings.length; i++) {
                String weekDay = getWeekDayForIndex(strings[i]);
                if (!weekDay.isEmpty()) {
                    if (i != 0) {
                        sb.append(",");
                    }
                    sb.append(weekDay);
                }
            }
            value = sb.toString();
        } else {
            value = getWeekDayForIndex(originalValue);
        }
        return value;
    }

    /**
     * 通过索引获取星期
     *
     * @param index
     * @return
     */
    private static String getWeekDayForIndex(String index) {
        String weekDay;
        switch (index) {
            case "1":
                weekDay = "星期一";
                break;
            case "2":
                weekDay = "星期二";
                break;
            case "3":
                weekDay = "星期三";
                break;
            case "4":
                weekDay = "星期四";
                break;
            case "5":
                weekDay = "星期五";
                break;
            case "6":
                weekDay = "星期六";
                break;
            case "0":
                weekDay = "星期日";
                break;
            default:
                weekDay = "";
                break;
        }
        return weekDay;
    }


    /**
     * 判断路径是否是视频
     *
     * @param path
     * @return
     */
    public static boolean isVideo(String path) {
        return path.contains(".mp4");
    }



}
