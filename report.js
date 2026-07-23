/*
============================================================

 ChronoMate 2026
 Version v1.1.1
 Report Window Module

============================================================
*/


function openReportWindow(report) {
    console.log(report);

    const safe = value => value || "Not entered";

    const isDarkReport = document.body.classList.contains("dark");

    const reportTheme = {
        bodyBg: isDarkReport ? "#0f172a" : "#ffffff",
        text: isDarkReport ? "#e5e7eb" : "#111111",
        panel: isDarkReport ? "#111827" : "#ffffff",
        border: isDarkReport ? "#374151" : "#cccccc",
        tableHeader: isDarkReport ? "#1f2937" : "#f3f4f6",
        muted: isDarkReport ? "#9ca3af" : "#555555"
    };

    const isSub12Report =
        report.statistics?.selectedLimit === "Sub-12 ft-lb";

    const shotRows = report.shots.map((shot, index) => {
        let warningClass = "";

        if (isSub12Report)
        {
            if (shot.ftlb >= 12)
            {
                warningClass = "shot-over-limit";
            }
            else if (shot.ftlb >= 11.7)
            {
                warningClass = "shot-near-limit";
            }
        }

        return `
            <tr class="${warningClass}">
                <td>${index + 1}</td>
                <td>${shot.fps.toFixed(1)}</td>
                <td>${shot.ftlb.toFixed(2)}</td>
                <td>${shot.joules.toFixed(2)}</td>
            </tr>
        `;
    }).join("");

    const reportHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ChronoMate Report</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 24px;
                    color: ${reportTheme.text};
                    background: ${reportTheme.bodyBg};
                }

                .report-toolbar {
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    display: flex;
                    justify-content: flex-end;
                }

                .report-toolbar button {
                    padding: 10px 16px;
                    border: none;
                    border-radius: 8px;
                    background: #8bc53f;
                    color: #111;
                    font-size: 1rem;
                    font-weight: bold;
                    cursor: pointer;
                }

                .report-toolbar button:hover {
                    filter: brightness(0.95);
                }

                .print-note {
                    margin-right: 12px;
                    align-self: center;
                    font-size: 0.85rem;
                    color: ${reportTheme.muted};
                }
                .report-header {
                    text-align: center;
                    border-bottom: 3px solid #8bc53f;
                    padding-bottom: 14px;
                    margin-bottom: 14px;
                }

                .report-header img {
                    width: 86px;
                    height: auto;
                    display: block;
                    margin: 0 auto 10px auto;
                }

                h1 {
                    margin: 0;
                    text-align: center;
                    font-size: 2.1rem;
                }

                .report-header p {
                    margin: 6px 0 0 0;
                    font-size: 1.05rem;
                }

                h2 {
                    margin: 0 0 8px 0;
                    border-bottom: 1px solid #8bc53f;
                    padding-bottom: 5px;
                    font-size: 1.25rem;
                }

                .result-banner {
                    margin: 10px 0 14px 0;
                    padding: 10px;
                    text-align: center;
                    font-size: 1.35rem;
                    font-weight: bold;
                    border-radius: 8px;
                    background: ${report.statistics.result === "PASS" ? "#dcfce7" : "#fee2e2"};
                    color: ${report.statistics.result === "PASS" ? "#166534" : "#991b1b"};
                }

                .report-layout {
                    display: grid;
                    grid-template-columns: 1fr 1.1fr;
                    gap: 18px;
                    align-items: start;
                }

                .report-panel {
                    border: 1px solid #8bc53f;
                    border-radius: 8px;
                    padding: 14px;
                    background: ${reportTheme.panel};
                }

                .report-section {
                    margin-bottom: 18px;
                }

                .report-section:last-child {
                    margin-bottom: 0;
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 7px 18px;
                }

                .session-notes {
                    margin-top: 7px;
                }

                .stacked-info {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 7px;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 7px 18px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }

                th, td {
                    border: 1px solid ${reportTheme.border};
                    padding: 7px;
                    text-align: center;
                }

                th {
                    background: ${reportTheme.tableHeader};
                }

                .shot-near-limit td {
                    background: #ffe4b5;
                    color: #111111;
                }

                .shot-over-limit td {
                    background: #f8caca;
                    color: #111111;
                }

                footer {
                    margin-top: 18px;
                    padding-top: 10px;
                    border-top: 1px solid ${reportTheme.border};
                    font-size: 0.82rem;
                    color: ${reportTheme.muted};
                    text-align: center;
                }

                @media screen and (max-width: 760px) {
                    body {
                        margin: 14px;
                    }

                    .report-toolbar {
                        position: static;
                        margin-bottom: 14px;
                    }

                    .print-note {
                        display: none;
                    }

                    .report-header img {
                        width: 74px;
                    }

                    h1 {
                        font-size: 1.75rem;
                    }

                    .report-layout {
                        grid-template-columns: 1fr;
                        gap: 14px;
                    }

                    .report-panel {
                        min-width: 0;
                        padding: 12px;
                    }

                    .info-grid,
                    .stats-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 7px 12px;
                    }

                    table {
                        font-size: .92rem;
                    }

                    th, td {
                        padding: 7px 5px;
                    }
                }

                @media screen and (max-width: 430px) {
                    body {
                        margin: 10px;
                    }

                    .report-toolbar button {
                        width: 100%;
                    }

                    .info-grid,
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    h2 {
                        font-size: 1.15rem;
                    }
                }

                @media print {

                    @page {
                        size: A4 landscape;
                        margin: 10mm;
                    }
                    
                    .report-toolbar {
                        display: none;
                    }

                    html,
                    body {
                        background: #ffffff !important;
                        color: #111111 !important;
                        margin: 0;
                        font-size: 12.5px;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    .report-panel {
                        background: #ffffff !important;
                        color: #111111 !important;
                        border-color: #8bc53f !important;
                    }

                    .report-panel *,
                    .report-header,
                    .report-header *,
                    table,
                    tbody,
                    tr,
                    td {
                        color: #111111 !important;
                    }

                    th {
                        background: #f3f4f6 !important;
                        color: #111111 !important;
                        border-color: #cccccc !important;
                    }

                    td {
                        background: #ffffff !important;
                        border-color: #cccccc !important;
                    }

                    .shot-near-limit td {
                        background: #ffe4b5 !important;
                        color: #111111 !important;
                    }

                    .shot-over-limit td {
                        background: #f8caca !important;
                        color: #111111 !important;
                    }

                    .report-header {
                        padding-bottom: 8px;
                        margin-bottom: 8px;
                    }

                    .report-header img {
                        width: 60px;
                        margin-bottom: 6px;
                    }

                    h1 {
                        font-size: 22px;
                    }

                    .report-header p {
                        font-size: 12px;
                        margin-top: 3px;
                    }

                    h2 {
                        font-size: 14px;
                        margin-bottom: 5px;
                        padding-bottom: 3px;
                    }

                    .result-banner {
                        margin: 7px 0 9px 0;
                        padding: 6px;
                        font-size: 15px;
                    }

                    .report-layout {
                        grid-template-columns: 1fr 1.08fr;
                        gap: 10px;
                    }

                    .report-panel {
                        padding: 14px;
                        border-radius: 6px;
                    }

                    .report-section {
                        margin-bottom: 16px;
                    }

                    .info-grid,
                    .stats-grid {
                        gap: 4px 10px;
                    }

                    .stacked-info {
                        gap: 4px;
                    }

                    table {
                        margin-top: 6px;
                    }

                    th, td {
                        padding: 6px;
                    }

                    footer {
                        display: none !important;
                    }
                }
            </style>
        </head>
        <body>
            <script>
                function printChronoMateReport() {
                    if (window.AndroidReportBridge &&
                        typeof window.AndroidReportBridge.printReport === "function") {
                        window.AndroidReportBridge.printReport();
                        return;
                    }

                    window.print();
                }
            </script>

            <div class="report-toolbar">
                <div class="print-note">Best printed in A4 landscape</div>
                <button onclick="printChronoMateReport()">🖨 Print Report</button>
            </div>

            <div class="report-header">
                <img src="assets/logo.png" alt="ChronoMate Logo">
                <h1>ChronoMate 2026</h1>
                <p>Chronograph Report</p>
            </div>

            <div class="result-banner">
                ${report.statistics.result || "NO RESULT"}
            </div>

            <main class="report-layout">
                <section class="report-panel">
                    <div class="report-section">
                        <h2>Session Information</h2>
                        <div class="info-grid">
                            <div><strong>Tester:</strong> ${safe(report.session.tester)}</div>
                            <div><strong>Chronograph:</strong> ${safe(report.session.chronograph)}</div>
                            <div><strong>Date:</strong> ${safe(report.session.sessionDate)}</div>
                            <div><strong>Time:</strong> ${safe(report.session.sessionTime)}</div>
                        </div>
                        <div class="session-notes">
                            <strong>Notes:</strong> ${safe(report.session.notes)}
                        </div>
                    </div>

                    <div class="report-section">
                        <h2>Rifle Information</h2>
                        <div class="stacked-info">
                            <div><strong>Manufacturer:</strong> ${safe(report.session.rifle.manufacturer)}</div>
                            <div><strong>Model:</strong> ${safe(report.session.rifle.model)}</div>
                            <div><strong>Serial:</strong> ${safe(report.session.rifle.serial)}</div>
                            <div><strong>Configuration:</strong> ${safe(report.session.rifle.configuration)}</div>
                        </div>
                    </div>

                    <div class="report-section">
                        <h2>Ammunition</h2>
                        <div class="stacked-info">
                            <div><strong>Calibre:</strong> ${safe(report.ammo?.calibre)}</div>
                            <div><strong>Manufacturer:</strong> ${safe(report.ammo?.manufacturer)}</div>
                            <div><strong>Pellet:</strong> ${safe(report.ammo?.name)}</div>
                            <div><strong>Weight:</strong> ${report.ammo ? report.ammo.grains.toFixed(2) + " gr" : "Not entered"}</div>
                            ${report.ammo?.headSize
                                ? `<div><strong>Head Size:</strong> ${Number(report.ammo.headSize).toFixed(2)} mm</div>`
                                : ""}
                        </div>
                    </div>

                    <div class="report-section">
                        <h2>Statistics</h2>
                        <div class="stats-grid">
                            <div><strong>Shots:</strong> ${report.statistics.shotCount || 0}</div>
                            <div><strong>Average FPS:</strong> ${report.statistics.averageFPS ? report.statistics.averageFPS.toFixed(1) : "N/A"}</div>
                            <div><strong>Highest FPS:</strong> ${report.statistics.highestFPS ? report.statistics.highestFPS.toFixed(1) : "N/A"}</div>
                            <div><strong>Lowest FPS:</strong> ${report.statistics.lowestFPS ? report.statistics.lowestFPS.toFixed(1) : "N/A"}</div>
                            <div><strong>Extreme Spread:</strong> ${report.statistics.extremeSpreadFPS ? report.statistics.extremeSpreadFPS.toFixed(1) : "N/A"}</div>
                            <div><strong>Highest ft-lb:</strong> ${report.statistics.highestFTLB ? report.statistics.highestFTLB.toFixed(2) : "N/A"}</div>
                        </div>
                    </div>
                </section>

                <section class="report-panel">
                    <div class="report-section">
                        <h2>Shot String</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Velocity FPS</th>
                                    <th>ft-lb</th>
                                    <th>Joules</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${shotRows || `<tr><td colspan="4">No shots recorded</td></tr>`}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            <footer>
                ChronoMate version ${report.software.version} |
                Generated ${new Date(report.software.generated).toLocaleString()} |
                https://github.com/CBDesignS/ChronoMate
            </footer>
        </body>
        </html>
    `;

    // FireTab Android wrapper: open the report in a dedicated native WebView.
    if (window.AndroidBridge && typeof window.AndroidBridge.openReport === "function") {
        window.AndroidBridge.openReport(reportHtml);
        return;
    }

    // Desktop browser fallback.
    const reportWindow = window.open("", "ChronoMateReport");

    if (!reportWindow) {
        alert("The report window could not be opened.");
        return;
    }

    reportWindow.document.write(reportHtml);
    reportWindow.document.close();
}
