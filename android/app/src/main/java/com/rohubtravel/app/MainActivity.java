package com.rohubtravel.app;

import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        bridge.setWebViewClient(new StaticExportWebViewClient(bridge));
    }

    /**
     * The site is a Next.js static export: every route is its own folder with an
     * index.html. Capacitor would answer every extensionless URL with the root
     * index.html, so reloads and deep links would show the home page instead.
     */
    private static final class StaticExportWebViewClient extends BridgeWebViewClient {

        private final Bridge bridge;

        StaticExportWebViewClient(Bridge bridge) {
            super(bridge);
            this.bridge = bridge;
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri url = request.getUrl();
            String path = url.getPath();
            boolean local = bridge.getHost().equals(url.getHost());
            if (local && path != null && !path.equals("/")) {
                String last = url.getLastPathSegment();
                if (last == null || !last.contains(".")) {
                    String asset = "public" + (path.endsWith("/") ? path : path + "/") + "index.html";
                    try {
                        InputStream stream = bridge.getContext().getAssets().open(asset);
                        InputStream injected = bridge.getLocalServer().getJavaScriptInjectedStream(stream);
                        return new WebResourceResponse("text/html", "UTF-8", injected);
                    } catch (IOException ignored) {
                        // Not a static route: fall through to Capacitor's default handling.
                    }
                }
            }
            return super.shouldInterceptRequest(view, request);
        }
    }
}
