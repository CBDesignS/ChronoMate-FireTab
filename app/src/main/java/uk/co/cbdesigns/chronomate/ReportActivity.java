package uk.co.cbdesigns.chronomate;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
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

        reportWebView.addJavascriptInterface(new ReportPrintBridge(), "AndroidReportBridge");
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

    private class ReportPrintBridge {
        @JavascriptInterface
        public void printReport() {
            runOnUiThread(() -> startReportPrint());
        }
    }

    private void startReportPrint() {
        if (reportWebView == null) {
            return;
        }

        PrintManager printManager =
                (PrintManager) getSystemService(Context.PRINT_SERVICE);

        if (printManager == null) {
            return;
        }

        PrintDocumentAdapter printAdapter =
                reportWebView.createPrintDocumentAdapter("ChronoMate Report");

        PrintAttributes printAttributes = new PrintAttributes.Builder()
                .setMediaSize(PrintAttributes.MediaSize.ISO_A4.asLandscape())
                .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
                .build();

        printManager.print(
                "ChronoMate Report",
                printAdapter,
                printAttributes
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
            reportWebView.removeJavascriptInterface("AndroidReportBridge");
            reportWebView.loadUrl("about:blank");
            reportWebView.stopLoading();
            reportWebView.setWebViewClient(null);
            reportWebView.destroy();
            reportWebView = null;
        }
        super.onDestroy();
    }
}
