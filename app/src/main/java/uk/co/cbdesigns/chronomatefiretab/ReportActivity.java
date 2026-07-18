package uk.co.cbdesigns.chronomatefiretab;

import android.app.Activity;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class ReportActivity extends Activity {

    public static final String EXTRA_REPORT_HTML = "report_html";

    private WebView reportWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        reportWebView = new WebView(this);
        reportWebView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        WebSettings settings = reportWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(true);

        reportWebView.setWebViewClient(new WebViewClient());
        setContentView(reportWebView);

        String reportHtml = getIntent().getStringExtra(EXTRA_REPORT_HTML);

        if (reportHtml == null || reportHtml.trim().isEmpty()) {
            finish();
            return;
        }

        reportWebView.loadDataWithBaseURL(
                "file:///android_asset/www/",
                reportHtml,
                "text/html",
                "UTF-8",
                null
        );
    }

    @Override
    public void onBackPressed() {
        if (reportWebView != null && reportWebView.canGoBack()) {
            reportWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (reportWebView != null) {
            reportWebView.loadUrl("about:blank");
            reportWebView.stopLoading();
            reportWebView.setWebViewClient(null);
            reportWebView.destroy();
            reportWebView = null;
        }
        super.onDestroy();
    }
}
