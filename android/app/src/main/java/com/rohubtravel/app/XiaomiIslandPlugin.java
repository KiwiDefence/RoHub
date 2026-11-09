package com.rohubtravel.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Icon;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Posts Xiaomi HyperOS Focus / Dynamic Island (超级岛) notifications via
 * {@code miui.focus.param}. Falls back to a normal ongoing notification on
 * non-Xiaomi devices.
 */
@CapacitorPlugin(name = "XiaomiIsland")
public class XiaomiIslandPlugin extends Plugin {
    private static final String TAG = "XiaomiIsland";
    private static final String CHANNEL_ID = "rohub-xiaomi-island";
    private static final int DEFAULT_ID = 41001;
    private final Handler handler = new Handler(Looper.getMainLooper());

    @PluginMethod
    public void isSupported(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("xiaomi", isXiaomiDevice());
        ret.put("islandFeature", hasIslandFeature());
        ret.put("focusProtocol", focusProtocolVersion());
        ret.put("hasFocusPermission", hasFocusPermission());
        ret.put("supported", isXiaomiDevice() && (hasIslandFeature() || focusProtocolVersion() >= 1));
        call.resolve(ret);
    }

    @PluginMethod
    public void show(PluginCall call) {
        String title = call.getString("title", "RoHubTravel");
        String body = call.getString("body", "");
        String shortTitle = call.getString("shortTitle", "RoHub");
        String route = call.getString("route", "/calatorie/");
        boolean ongoing = Boolean.TRUE.equals(call.getBoolean("ongoing", true));
        boolean cancel = Boolean.TRUE.equals(call.getBoolean("cancel", false));
        int id = call.getInt("id", DEFAULT_ID);

        ensureChannel();
        if (cancel) {
            NotificationManagerCompat.from(getContext()).cancel(id);
            call.resolve();
            return;
        }

        try {
            postIsland(id, title, body, shortTitle, route, ongoing, false);
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "show failed", e);
            call.reject("Failed to show island notification", e);
        }
    }

    @PluginMethod
    public void cancel(PluginCall call) {
        int id = call.getInt("id", DEFAULT_ID);
        NotificationManagerCompat.from(getContext()).cancel(id);
        call.resolve();
    }

    @PluginMethod
    public void showSequence(PluginCall call) {
        JSArray items = call.getArray("items");
        if (items == null || items.length() == 0) {
            call.reject("items required");
            return;
        }
        ensureChannel();
        try {
            for (int i = 0; i < items.length(); i++) {
                JSONObject item = items.getJSONObject(i);
                final int id = item.optInt("id", DEMO_BASE + i);
                final String title = item.optString("title", "RoHubTravel");
                final String body = item.optString("body", "");
                final String shortTitle = item.optString("shortTitle", "RoHub");
                final String route = item.optString("route", "/calatorie/");
                final long delayMs = item.optLong("delayMs", (i + 1) * 10_000L);
                final boolean ongoing = item.optBoolean("ongoing", false);
                handler.postDelayed(
                    () -> {
                        try {
                            postIsland(id, title, body, shortTitle, route, ongoing, true);
                        } catch (Exception e) {
                            Log.e(TAG, "sequence item failed", e);
                        }
                    },
                    Math.max(0, delayMs)
                );
            }
            call.resolve();
        } catch (JSONException e) {
            call.reject("Invalid items", e);
        }
    }

    @PluginMethod
    public void openFocusSettings(PluginCall call) {
        Context ctx = getContext();
        try {
            Intent intent = new Intent("miui.intent.action.APP_PERM_EDITOR");
            intent.putExtra("extra_pkgname", ctx.getPackageName());
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ctx.startActivity(intent);
        } catch (Exception e) {
            Intent fallback = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            fallback.setData(Uri.parse("package:" + ctx.getPackageName()));
            fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ctx.startActivity(fallback);
        }
        call.resolve();
    }

    private static final int DEMO_BASE = 41500;

    private void ensureChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm =
            (NotificationManager) getContext().getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        NotificationChannel existing = nm.getNotificationChannel(CHANNEL_ID);
        if (existing != null) return;
        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            "Dynamic Island / Călătorie",
            NotificationManager.IMPORTANCE_DEFAULT
        );
        channel.setDescription("Status pe Dynamic Island (Xiaomi) și notificări live");
        channel.setShowBadge(false);
        nm.createNotificationChannel(channel);
    }

    private void postIsland(
        int id,
        String title,
        String body,
        String shortTitle,
        String route,
        boolean ongoing,
        boolean headsUp
    ) throws JSONException {
        Context ctx = getContext();
        Intent launch = new Intent(ctx, MainActivity.class);
        launch.setAction(Intent.ACTION_VIEW);
        launch.setData(Uri.parse("rohub:/" + (route.startsWith("/") ? route : "/" + route)));
        launch.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent contentIntent = PendingIntent.getActivity(
            ctx,
            id,
            launch,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        int smallIcon = R.drawable.ic_island;
        NotificationCompat.Builder builder = new NotificationCompat.Builder(ctx, CHANNEL_ID)
            .setSmallIcon(smallIcon)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
            .setContentIntent(contentIntent)
            .setOngoing(ongoing)
            .setOnlyAlertOnce(true)
            .setAutoCancel(!ongoing)
            .setCategory(NotificationCompat.CATEGORY_STATUS)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setPriority(
                headsUp
                    ? NotificationCompat.PRIORITY_HIGH
                    : NotificationCompat.PRIORITY_DEFAULT
            );

        if (headsUp) {
            builder.setDefaults(NotificationCompat.DEFAULT_ALL);
        }

        Icon appIcon = Icon.createWithResource(ctx, R.mipmap.ic_launcher);
        Bundle pics = new Bundle();
        pics.putParcelable("miui.focus.pic_logo", appIcon);
        pics.putParcelable("miui.focus.pic_ticker", appIcon);
        pics.putParcelable("miui.focus.pic_aod", appIcon);
        pics.putParcelable("miui.focus.pic_imageText", appIcon);

        Bundle extras = new Bundle();
        extras.putBundle("miui.focus.pics", pics);
        builder.addExtras(extras);

        Notification notification = builder.build();
        notification.extras.putString(
            "miui.focus.param",
            buildFocusParam(title, body, shortTitle, ongoing)
        );

        NotificationManagerCompat.from(ctx).notify(id, notification);
    }

    private String buildFocusParam(
        String title,
        String body,
        String shortTitle,
        boolean updatable
    ) throws JSONException {
        JSONObject textInfo = new JSONObject();
        textInfo.put("title", truncate(title, 24));
        textInfo.put("content", truncate(body, 40));
        textInfo.put("showHighlightColor", false);

        JSONObject picInfo = new JSONObject();
        picInfo.put("type", 1);
        picInfo.put("pic", "miui.focus.pic_logo");

        JSONObject imageTextLeft = new JSONObject();
        imageTextLeft.put("type", 1);
        imageTextLeft.put("picInfo", picInfo);
        imageTextLeft.put("textInfo", textInfo);

        JSONObject imageTextRight = new JSONObject();
        imageTextRight.put("type", 2);
        JSONObject rightText = new JSONObject();
        rightText.put("title", truncate(shortTitle, 10));
        imageTextRight.put("textInfo", rightText);

        JSONObject bigIsland = new JSONObject();
        bigIsland.put("imageTextInfoLeft", imageTextLeft);
        bigIsland.put("imageTextInfoRight", imageTextRight);
        // Also include plain textInfo for broader template support
        bigIsland.put("textInfo", textInfo);

        JSONObject smallIsland = new JSONObject();
        smallIsland.put("picInfo", picInfo);
        JSONObject smallText = new JSONObject();
        smallText.put("title", truncate(shortTitle, 8));
        smallIsland.put("textInfo", smallText);

        JSONObject island = new JSONObject();
        island.put("islandProperty", 1);
        island.put("islandTimeout", 60 * 60);
        island.put("highlightColor", "#1B7A57");
        island.put("bigIslandArea", bigIsland);
        island.put("smallIslandArea", smallIsland);
        JSONObject share = new JSONObject();
        share.put("title", title);
        share.put("content", body);
        share.put("shareContent", "https://rohubtravel.com/calatorie/");
        share.put("pic", "miui.focus.pic_logo");
        island.put("shareData", share);

        JSONObject baseInfo = new JSONObject();
        baseInfo.put("title", truncate(title, 28));
        baseInfo.put("content", truncate(body, 60));
        baseInfo.put("colorTitle", "#1B7A57");
        baseInfo.put("type", 1);

        JSONObject paramV2 = new JSONObject();
        paramV2.put("protocol", 1);
        paramV2.put("business", "travel");
        paramV2.put("enableFloat", true);
        paramV2.put("islandFirstFloat", true);
        paramV2.put("updatable", updatable);
        paramV2.put("reopen", "reopen");
        paramV2.put("filterWhenNoPermission", false);
        paramV2.put("timeout", 720);
        paramV2.put("ticker", truncate(title, 20));
        paramV2.put("tickerPic", "miui.focus.pic_ticker");
        paramV2.put("aodTitle", truncate(shortTitle.isEmpty() ? title : shortTitle, 16));
        paramV2.put("aodPic", "miui.focus.pic_aod");
        paramV2.put("param_island", island);
        paramV2.put("baseInfo", baseInfo);

        JSONObject root = new JSONObject();
        root.put("param_v2", paramV2);
        return root.toString();
    }

    private static String truncate(String s, int max) {
        if (s == null) return "";
        String t = s.trim();
        return t.length() <= max ? t : t.substring(0, max - 1) + "…";
    }

    private boolean isXiaomiDevice() {
        String m = Build.MANUFACTURER == null ? "" : Build.MANUFACTURER.toLowerCase();
        String b = Build.BRAND == null ? "" : Build.BRAND.toLowerCase();
        return m.contains("xiaomi")
            || m.contains("redmi")
            || b.contains("xiaomi")
            || b.contains("redmi")
            || b.contains("poco");
    }

    private boolean hasIslandFeature() {
        try {
            Class<?> clazz = Class.forName("android.os.SystemProperties");
            Object value = clazz
                .getMethod("getBoolean", String.class, boolean.class)
                .invoke(null, "persist.sys.feature.island", false);
            return value instanceof Boolean && (Boolean) value;
        } catch (Throwable t) {
            return false;
        }
    }

    private int focusProtocolVersion() {
        try {
            return Settings.System.getInt(
                getContext().getContentResolver(),
                "notification_focus_protocol",
                0
            );
        } catch (Throwable t) {
            return 0;
        }
    }

    private boolean hasFocusPermission() {
        try {
            android.net.Uri uri = android.net.Uri.parse(
                "content://miui.statusbar.notification.public"
            );
            Bundle extras = new Bundle();
            extras.putString("package", getContext().getPackageName());
            Bundle bundle = getContext()
                .getContentResolver()
                .call(uri, "canShowFocus", null, extras);
            return bundle != null && bundle.getBoolean("canShowFocus", false);
        } catch (Throwable t) {
            return false;
        }
    }
}
