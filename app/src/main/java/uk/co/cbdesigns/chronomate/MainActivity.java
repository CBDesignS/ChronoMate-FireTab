package uk.co.cbdesigns.chronomate;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.AssetFileDescriptor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
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

    private static final long SUCCESS_MESSAGE_DURATION_MS = 3000L;

    private WebView webView;
    private String pendingBackupJson;
    private Toast activeSuccessToast;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

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

        // Keep JavaScript support while replacing WebView's unattractive
        // file:// confirmation box with a native ChronoMate dialog.
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onJsConfirm(
                    WebView view,
                    String url,
                    String message,
                    final JsResult result
            ) {
                final AlertDialog dialog = new AlertDialog.Builder(MainActivity.this)
                        .setTitle("ChronoMate")
                        .setMessage(message)
                        .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int which) {
                                result.cancel();
                            }
                        })
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int which) {
                                result.confirm();
                            }
                        })
                        .create();

                dialog.setOnCancelListener(new DialogInterface.OnCancelListener() {
                    @Override
                    public void onCancel(DialogInterface dialogInterface) {
                        result.cancel();
                    }
                });
                dialog.show();
                if (dialog.getWindow() != null) {
                    dialog.getWindow().setBackgroundDrawableResource(
                            R.drawable.dialog_rounded_background
                    );
                }
                return true;
            }
        });
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
                    showTimedSuccessMessage(message);
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
        public void showVelocityKeyboard() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    // Some Fire OS keyboards close after the Enter/Done action
                    // even though the HTML velocity field has been refocused.
                    // Reopen the keyboard shortly after submission so the next
                    // shot can be entered without tapping the field again.
                    webView.requestFocus();
                    webView.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            InputMethodManager inputMethodManager =
                                    (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);

                            if (inputMethodManager != null) {
                                inputMethodManager.showSoftInput(
                                        webView,
                                        InputMethodManager.SHOW_IMPLICIT
                                );
                            }
                        }
                    }, 150L);
                }
            });
        }

        @JavascriptInterface
        public void importBackup() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    // Fire OS file pickers do not consistently recognise the
                    // application/json MIME type. Allow any openable document,
                    // then validate the selected file as JSON after reading it.
                    Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("*/*");

                    try {
                        startActivityForResult(intent, REQUEST_OPEN_BACKUP);
                    } catch (Exception openDocumentError) {
                        // Older or modified Android builds may not expose a full
                        // Storage Access Framework picker. ACTION_GET_CONTENT is
                        // the compatible fallback and still returns a content URI.
                        Intent fallbackIntent = new Intent(Intent.ACTION_GET_CONTENT);
                        fallbackIntent.addCategory(Intent.CATEGORY_OPENABLE);
                        fallbackIntent.setType("*/*");

                        try {
                            startActivityForResult(fallbackIntent, REQUEST_OPEN_BACKUP);
                        } catch (Exception getContentError) {
                            Toast.makeText(
                                    MainActivity.this,
                                    "No compatible file picker is available.",
                                    Toast.LENGTH_LONG
                            ).show();
                        }
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

    private void showTimedSuccessMessage(String message) {
        if (activeSuccessToast != null) {
            activeSuccessToast.cancel();
        }

        activeSuccessToast = Toast.makeText(
                MainActivity.this,
                message,
                Toast.LENGTH_LONG
        );
        activeSuccessToast.show();

        mainHandler.removeCallbacksAndMessages(null);
        mainHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (activeSuccessToast != null) {
                    activeSuccessToast.cancel();
                    activeSuccessToast = null;
                }
            }
        }, SUCCESS_MESSAGE_DURATION_MS);
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

        try {
            String backupJson = readBackupFile(source).trim();

            if (backupJson.startsWith("\uFEFF")) {
                backupJson = backupJson.substring(1).trim();
            }

            if (backupJson.isEmpty()) {
                throw new IllegalStateException("The selected file was empty.");
            }

            // Validate in Android before handing the object to the WebView. This
            // avoids the extra JSON.parse(string) step that fails on some older
            // Fire OS WebView versions while preserving ChronoMate's JS importer.
            new JSONObject(backupJson);

            final String validatedBackupJson = backupJson;
            webView.post(new Runnable() {
                @Override
                public void run() {
                    String javascript =
                            "try { importChronoMateBackup(" +
                            validatedBackupJson +
                            "); } catch (error) { " +
                            "showSuccessMessage('This backup file could not be read.'); }";

                    webView.evaluateJavascript(javascript, null);
                }
            });
        } catch (Exception error) {
            Toast.makeText(
                    this,
                    "ChronoMate could not read the selected backup file.",
                    Toast.LENGTH_LONG
            ).show();
        }
    }


    private String readBackupFile(Uri source) throws Exception {
        Exception streamError = null;

        // Keep the existing read path used successfully by Android 17 and the
        // 7th-generation Fire tablet.
        try (InputStream inputStream = getContentResolver().openInputStream(source)) {
            if (inputStream != null) {
                return readUtf8Stream(inputStream);
            }
        } catch (Exception error) {
            streamError = error;
        }

        // Some Fire OS 7 document providers return a valid selected URI but do
        // not expose it correctly through openInputStream(). Only in that case,
        // open the same URI through an AssetFileDescriptor instead.
        try (AssetFileDescriptor descriptor =
                     getContentResolver().openAssetFileDescriptor(source, "r")) {
            if (descriptor == null) {
                throw new IllegalStateException("Could not open the selected file.");
            }

            try (InputStream inputStream = descriptor.createInputStream()) {
                return readUtf8Stream(inputStream);
            }
        } catch (Exception fallbackError) {
            if (streamError != null) {
                fallbackError.addSuppressed(streamError);
            }
            throw fallbackError;
        }
    }

    private String readUtf8Stream(InputStream inputStream) throws Exception {
        try (BufferedReader reader =
                     new BufferedReader(new InputStreamReader(inputStream, "UTF-8"))) {
            StringBuilder text = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                text.append(line).append('\n');
            }

            return text.toString();
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

            showTimedSuccessMessage("ChronoMate backup saved.");
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
        mainHandler.removeCallbacksAndMessages(null);
        if (activeSuccessToast != null) {
            activeSuccessToast.cancel();
            activeSuccessToast = null;
        }

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
