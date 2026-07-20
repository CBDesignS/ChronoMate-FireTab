package uk.co.cbdesigns.chronomate;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;

import org.json.JSONObject;

public class MainActivity extends Activity {

    private static final int REQUEST_CREATE_BACKUP = 1001;
    private static final int REQUEST_OPEN_BACKUP = 1002;

    private WebView webView;
    private String pendingBackupJson;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);

        // Required by the existing fully offline HTML/CSS/JavaScript app.
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);

        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");

        // Enables JavaScript alert/confirm dialogs used by ChronoMate.
        // The Clear Shot String button relies on confirm() before deleting shots.
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient());
        setContentView(webView);

        if (savedInstanceState == null) {
            webView.loadUrl("file:///android_asset/www/ChronoMate.html");
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    private class AndroidBridge {
        @JavascriptInterface
        public void showToast(final String message) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(
                            MainActivity.this,
                            message,
                            Toast.LENGTH_SHORT
                    ).show();
                }
            });
        }

        @JavascriptInterface
        public void openReport(final String reportHtml) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Intent intent = new Intent(MainActivity.this, ReportActivity.class);
                    intent.putExtra(ReportActivity.EXTRA_REPORT_HTML, reportHtml);
                    startActivity(intent);
                }
            });
        }

        @JavascriptInterface
        public void importBackup() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("application/json");

                    try {
                        startActivityForResult(intent, REQUEST_OPEN_BACKUP);
                    } catch (Exception error) {
                        Toast.makeText(
                                MainActivity.this,
                                "No compatible file picker is available.",
                                Toast.LENGTH_LONG
                        ).show();
                    }
                }
            });
        }

        @JavascriptInterface
        public void exportBackup(final String jsonData, final String suggestedFileName) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (jsonData == null || jsonData.trim().isEmpty()) {
                        Toast.makeText(
                                MainActivity.this,
                                "There is no backup data to export.",
                                Toast.LENGTH_LONG
                        ).show();
                        return;
                    }

                    pendingBackupJson = jsonData;

                    Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("application/json");
                    intent.putExtra(
                            Intent.EXTRA_TITLE,
                            normaliseBackupFileName(suggestedFileName)
                    );

                    try {
                        startActivityForResult(intent, REQUEST_CREATE_BACKUP);
                    } catch (Exception error) {
                        pendingBackupJson = null;
                        Toast.makeText(
                                MainActivity.this,
                                "No compatible save location is available.",
                                Toast.LENGTH_LONG
                        ).show();
                    }
                }
            });
        }
    }

    private String normaliseBackupFileName(String suggestedFileName) {
        String fileName = suggestedFileName == null
                ? ""
                : suggestedFileName.trim();

        if (fileName.isEmpty()) {
            fileName = "ChronoMate_Backup.json";
        }

        if (!fileName.toLowerCase().endsWith(".json")) {
            fileName += ".json";
        }

        return fileName;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == REQUEST_OPEN_BACKUP) {
            handleBackupImportResult(resultCode, data);
            return;
        }

        if (requestCode == REQUEST_CREATE_BACKUP) {
            handleBackupExportResult(resultCode, data);
        }
    }

    private void handleBackupImportResult(int resultCode, Intent data) {
        if (resultCode != RESULT_OK || data == null || data.getData() == null) {
            return;
        }

        Uri source = data.getData();

        try (InputStream inputStream = getContentResolver().openInputStream(source);
             BufferedReader reader = inputStream == null
                     ? null
                     : new BufferedReader(new InputStreamReader(inputStream, "UTF-8"))) {

            if (reader == null) {
                throw new IllegalStateException("Could not open the selected file.");
            }

            StringBuilder jsonBuilder = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                jsonBuilder.append(line).append('\n');
            }

            final String backupJson = jsonBuilder.toString().trim();

            if (backupJson.isEmpty()) {
                throw new IllegalStateException("The selected file was empty.");
            }

            String javascript =
                    "try { importChronoMateBackup(JSON.parse(" +
                    JSONObject.quote(backupJson) +
                    ")); } catch (error) { alert('This backup file could not be read.'); }";

            webView.evaluateJavascript(javascript, null);
        } catch (Exception error) {
            Toast.makeText(
                    this,
                    "ChronoMate could not read the selected backup file.",
                    Toast.LENGTH_LONG
            ).show();
        }
    }

    private void handleBackupExportResult(int resultCode, Intent data) {
        if (resultCode != RESULT_OK || data == null || data.getData() == null) {
            pendingBackupJson = null;
            return;
        }

        Uri destination = data.getData();
        String backupJson = pendingBackupJson;
        pendingBackupJson = null;

        if (backupJson == null) {
            Toast.makeText(
                    this,
                    "The backup data was no longer available.",
                    Toast.LENGTH_LONG
            ).show();
            return;
        }

        try (OutputStream outputStream = getContentResolver().openOutputStream(destination);
             OutputStreamWriter writer = outputStream == null
                     ? null
                     : new OutputStreamWriter(outputStream, "UTF-8")) {

            if (writer == null) {
                throw new IllegalStateException("Could not open the selected file.");
            }

            writer.write(backupJson);
            writer.flush();

            Toast.makeText(
                    this,
                    "ChronoMate backup saved.",
                    Toast.LENGTH_SHORT
            ).show();
        } catch (Exception error) {
            Toast.makeText(
                    this,
                    "ChronoMate could not save the backup file.",
                    Toast.LENGTH_LONG
            ).show();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.loadUrl("about:blank");
            webView.stopLoading();
            webView.removeJavascriptInterface("AndroidBridge");
            webView.setWebViewClient(null);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
