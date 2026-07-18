# ChronoMate FireTab — Dev 0.1.0 First Build

This package adds the smallest practical Android WebView shell around the
existing ChronoMate files.

## First-build target

Install the APK, tap the icon, and confirm that ChronoMate opens offline.

No tablet layout changes are included in this build.

## Uploading these files

Extract this ZIP and upload its contents into the root of the
`ChronoMate-FireTab` repository.

Keep the folder structure exactly as supplied.

The repository root should then contain:

```text
ChronoMate.html
style.css
app.js
session.js
report.js
assets/
data/
app/
.github/
build.gradle
settings.gradle
gradle.properties
FIRST_BUILD.md
```

## Building the APK

After committing the files:

1. Open the repository's **Actions** tab.
2. Select **Build FireTab APK**.
3. Open the latest workflow run.
4. Wait for the green tick.
5. Download the artifact named **ChronoMate-FireTab-Dev-0.1.0**.
6. Extract the downloaded artifact ZIP.
7. Copy `ChronoMate-FireTab-Dev-0.1.0.apk` to the Fire tablet.
8. Allow installation from unknown apps when Fire OS asks.
9. Install and launch the APK.

## First test only

Check these items:

- APK installs.
- ChronoMate icon appears.
- App launches without a browser.
- Logo, CSS and pellet lists load.
- Page scrolls.
- Text boxes accept input.
- App still opens after completely closing and relaunching it.

Import, export and report/PDF behaviour will be tested after the basic shell
has successfully launched.
