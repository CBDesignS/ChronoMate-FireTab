# ChronoMate Android Changelog

## v0.6.5

### Fixed

- Improved backup-file selection compatibility on older Fire OS tablets by allowing any openable document instead of relying on the inconsistently recognised `application/json` MIME type.
- Added an `ACTION_GET_CONTENT` fallback for Android builds that do not provide a working `ACTION_OPEN_DOCUMENT` picker.
- Backup files are now read and validated natively by Android before being passed directly into ChronoMate's existing JavaScript import function.
- Removed the additional WebView `JSON.parse()` hand-off step that could fail on older Fire OS WebView versions.
- Added handling for an optional UTF-8 byte-order mark at the start of a backup file.

### Changed

- Updated Android application version to v0.6.5 with versionCode 19.
- Updated GitHub Actions to generate `ChronoMate-v0.6.5.apk`.

### Notes

This release changes Android backup-file selection and hand-off only.
The ChronoMate backup format, validation rules, export process, desktop import path and stored user data are unchanged.

## v0.6.4

### Fixed

- Fixed the remaining raw WebView `file://` alert shown when **Add User Pellet** is pressed without the required pellet details.
- The **Please enter manufacturer, pellet name, and a valid weight** message now uses the same timed Android bottom notification as the other app messages.
- Desktop browser behaviour retains the existing alert fallback.

### Changed

- Updated Android application version to v0.6.4 with versionCode 18.
- Updated GitHub Actions to generate `ChronoMate-v0.6.4.apk`.

### Notes

This release fixes one missed Android notification path only.
No pellet-saving logic, chronograph calculations, reports, backups or stored data were changed.

## v0.6.3

### Fixed

- Fixed the remaining raw WebView `file://` alert shown when **Clear Shot String** is pressed with no recorded shots.
- The **There are no shots to clear** message now uses the same timed Android bottom notification as the other app messages.
- Desktop browser behaviour retains the existing alert fallback.

### Changed

- Updated Android application version to v0.6.3 with versionCode 17.
- Updated GitHub Actions to generate `ChronoMate-v0.6.3.apk`.

### Notes

This release fixes one missed Android notification path only.
No shot-clearing logic, chronograph calculations, reports, backups or stored data were changed.

## v0.6.2

### Improved

- Native Android confirmation dialogs now use a rounded-corner background.
- Clear Shot String, Delete Saved Rifle and Delete User Pellet confirmations retain the improved ChronoMate wording while presenting a softer, more modern dialog shape.

### Changed

- Updated Android application version to v0.6.2 with versionCode 16.
- Updated GitHub Actions to generate `ChronoMate-v0.6.2.apk`.

### Notes

This release changes confirmation-dialog appearance only.
No confirmation logic, chronograph calculations, backup data, report generation or storage behaviour were changed.

## v0.6.1

### Improved

- Success notifications now close after a fixed three-second display period.
- Rifle save, data import and data export notifications now use the same timed bottom banner behaviour.
- JavaScript confirmation prompts now open as native Android ChronoMate dialogs.
- Clear Shot String, Delete Saved Rifle and Delete User Pellet confirmations no longer display the WebView `file://` message.

### Changed

- Updated Android application version to v0.6.1 with versionCode 15.
- Updated GitHub Actions to generate `ChronoMate-v0.6.1.apk`.

### Notes

This release changes Android notification and confirmation presentation only.
No chronograph calculations, backup data, report generation or storage behaviour were changed.

## v0.6.0

### Improved

- Replaced JavaScript success alert dialogs with native Android toast notifications.
- Rifle save confirmation now uses a native Android notification.
- Backup import confirmation now uses a native Android notification.
- Export notification behaviour remains consistent across the application.

### Changed

- Updated Android application version to v0.6.0.
- Updated GitHub Actions release workflow to generate ChronoMate-v0.6.0.apk.

### Notes

This release focuses on Android UI refinement only.
No changes have been made to chronograph calculations or report generation.

## v0.5.1 - Report Print Layout Improvements

### Changed
- Improved printed report appearance on Android and desktop.
- Print output now uses a dedicated light theme for improved readability.
- Report panels now print with light backgrounds and dark text regardless of the selected application theme.
- Improved table readability in printed reports.

### Fixed
- Fixed dark mode causing poor contrast in printed reports.
- Fixed printed report styling to produce a cleaner PDF output.
- Improved consistency between desktop and Android report printing.
- Fixed report footer causing an unnecessary second page when printing or saving as PDF.

### Android
- Native Android PrintManager support retained.
- Improved Android PDF output layout and readability.
- Continued compatibility with desktop report format.

## v0.5.0
- Added native Android report printing through Android PrintManager.
- The report Print button now opens Android print preview and supports Save as PDF.
- Android report output defaults to A4 landscape.
- Desktop browser printing remains unchanged through window.print().
- No chronograph calculations, backup data or user-storage behaviour were changed.

## v0.4.1
- Version update to verify in-place APK upgrades using the permanent release signing key.
- No functional changes.

## v0.4.0

- Established permanent release signing for in-place Android updates.
- GitHub Actions now builds a signed release APK instead of a temporary debug APK.
- Signing key and passwords are supplied only through GitHub Actions secrets.
- Added signing setup and recovery guidance.
- Updated Android build to versionCode 10 / versionName 0.4.0.

## v0.3.3

- Added Android-native **Import Data** support.
- Import now opens Android's standard file picker for selecting a ChronoMate JSON backup.
- The selected JSON is passed into ChronoMate's existing backup validation and import function.
- The desktop browser file-input import path remains unchanged.
- The shared backup format is unchanged, allowing backups to move between desktop and Android.
- No PDF functionality was added in this release.

## v0.3.2

- Added Android-native **Export Data** support.
- The existing ChronoMate backup builder and JSON format remain unchanged.
- Export now opens Android's standard **Save As** picker, allowing the user to choose any available document location.
- No broad storage permission is required.
- The desktop browser export path remains unchanged.
- No Import or PDF functionality was added in this release.

## v0.3.1

- Added on-screen keyboard Enter/Done support for the Velocity field.
- Pressing Enter/Done now records the shot exactly like the **Add Shot** button.
- The Velocity field clears and remains focused so the next reading can be entered immediately.
- Desktop and physical-keyboard Enter behaviour remains supported.
- No Export, Import or PDF functionality was added in this release.

## v0.3.0

- Enabled JavaScript alert and confirmation dialogs in the Android WebView.
- Activated the existing **Clear Shot String** button and its confirmation prompt.
- Clearing a shot string removes only the current recorded shots and resets the displayed results.
- No Export, Import or PDF functionality was added in this release.

## v0.2.3

- Added a responsive narrow-screen header layout for Android phones.
- Added a single-column phone layout for generated reports.
- Added viewport handling to the Android report page.
- Preserved the existing tablet, desktop and print layouts.
- No chronograph calculation or session functionality was changed.

## v0.2.2

- Renamed the installed application to **ChronoMate**.
- Changed the Android package ID to `uk.co.cbdesigns.chronomate`.
- Added branded legacy and adaptive launcher icons.
- Renamed the GitHub Actions APK artifact to `ChronoMate-v0.2.2`.
- No ChronoMate application functionality was changed.
