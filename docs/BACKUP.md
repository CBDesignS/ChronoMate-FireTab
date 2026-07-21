# ChronoMate Android Backup & Restore Guide

## Introduction

ChronoMate Android includes a built-in Backup & Restore system to help protect your data.

Creating regular backups is recommended, particularly before installing application updates or moving to a new Android device.

Backup files are fully compatible with the desktop edition of ChronoMate.

---

## What is Included?

A backup contains your personal ChronoMate data, including:

- Saved rifles
- User pellet database
- Application settings
- Session information

Built-in pellet data is **not** included, as it is already part of every ChronoMate release.

---

## Creating a Backup

Creating a backup only takes a few seconds.

1. Open **ChronoMate**.
2. Tap **Export Data**.
3. Choose a location using the Android file picker.
4. Enter a filename if required.
5. Tap **Save**.

Your backup file has now been created.

It is good practice to keep more than one backup and store copies somewhere safe.

---

## Restoring a Backup

To restore a previously created backup:

1. Open **ChronoMate**.
2. Tap **Import Data**.
3. Select your backup file using the Android file picker.
4. Wait for the confirmation message.

Your saved data is restored immediately.

---

## Backup Compatibility

ChronoMate backup files are compatible across supported platforms.

You can:

- Restore an Android backup into the desktop edition.
- Restore a desktop backup into ChronoMate Android.

This makes it easy to move between devices while keeping all of your rifles, pellets and settings.

---

## Before Updating

Although application updates normally preserve your saved data, creating a backup before installing a new version is always recommended.

A backup provides a quick and reliable way to restore everything should it ever be required.

---

## Moving to a New Device

When changing Android devices:

1. Export a backup from your existing device.
2. Copy the backup file to your new device.
3. Install ChronoMate.
4. Import the backup.

All supported data will be restored.

---

## Troubleshooting

### Import does not open the file picker

If **Developer Options** are enabled, ensure **Don't keep activities** is **disabled**.

Enabling this option forces Android to close applications whenever they lose focus and may prevent the file picker from returning correctly.

---

### Backup file cannot be found

Use your preferred file manager to locate the folder where the backup was saved, then browse to that location using the Android file picker.

---

### Import failed

Ensure the selected file is a valid ChronoMate backup.

If the backup was transferred from another device, verify that the transfer completed successfully before attempting the import again.

---

## Documentation

← [User Guide](USERGUIDE.md)

↑ [Project README](../README.md)

→ [Installation Guide](INSTALL.md)

→ [Frequently Asked Questions](FAQ.md)

Doc Version 1.1.1
