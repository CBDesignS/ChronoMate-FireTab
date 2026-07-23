/*
============================================================
 ChronoMate 2026
 Session Management
 Version : v1.1.1
 Author  : Chris Bruce (CBDesignS)
 Developed with ChatGPT (OpenAI GPT-5.5)
============================================================
*/

"use strict";

const STORAGE_KEYS = {
    SESSION : "ChronoMateSession"
};

const CHRONOMATE_VERSION = "1.1.1";

let chronoSession = {
    tester : "",
    chronograph : "",
    notes : "",
    sessionDate : "",
    sessionTime : "",
    rifle : {
        manufacturer : "",
        model : "",
        serial : "",
        configuration : "",
        calibre : ".177"
    }
};

function createSessionTimestamp()
{
    const now = new Date();
    chronoSession.sessionDate = now.toLocaleDateString();
    chronoSession.sessionTime = now.toLocaleTimeString();
}


function refreshSessionTimestamp()
{
    createSessionTimestamp();
    saveSession();
}

function saveSession()
{
    localStorage.setItem(
        STORAGE_KEYS.SESSION,
        JSON.stringify(chronoSession)
    );
}

function loadSession()
{
    const storedSession = localStorage.getItem(STORAGE_KEYS.SESSION);

    if (storedSession) {
        chronoSession = JSON.parse(storedSession);
    } else {
        createSessionTimestamp();
        saveSession();
    }
}

function resetSession()
{
    chronoSession = {
        tester : "",
        chronograph : "",
        notes : "",
        sessionDate : "",
        sessionTime : "",
        rifle : {
            manufacturer : "",
            model : "",
            serial : "",
            configuration : "",
            calibre : ".177"
        }
    };

    createSessionTimestamp();
    saveSession();
}

function getSession()
{
    return chronoSession;
}

loadSession();

const sessionFields = {
    tester: document.getElementById("testerName"),
    chronograph: document.getElementById("chronographName"),
    notes: document.getElementById("sessionNotes"),
    rifleManufacturer: document.getElementById("rifleManufacturer"),
    rifleModel: document.getElementById("rifleModel"),
    rifleSerial: document.getElementById("rifleSerial"),
    rifleConfiguration: document.getElementById("rifleConfiguration")
};

function loadSessionIntoForm()
{
    sessionFields.tester.value = chronoSession.tester || "";
    sessionFields.chronograph.value = chronoSession.chronograph || "";
    sessionFields.notes.value = chronoSession.notes || "";
    sessionFields.rifleManufacturer.value = chronoSession.rifle.manufacturer || "";
    sessionFields.rifleModel.value = chronoSession.rifle.model || "";
    sessionFields.rifleSerial.value = chronoSession.rifle.serial || "";
    sessionFields.rifleConfiguration.value = chronoSession.rifle.configuration || "";
}

function saveFormToSession()
{
    chronoSession.tester = sessionFields.tester.value.trim();
    chronoSession.chronograph = sessionFields.chronograph.value.trim();
    chronoSession.notes = sessionFields.notes.value.trim();
    chronoSession.rifle.manufacturer = sessionFields.rifleManufacturer.value.trim();
    chronoSession.rifle.model = sessionFields.rifleModel.value.trim();
    chronoSession.rifle.serial = sessionFields.rifleSerial.value.trim();
    chronoSession.rifle.configuration = sessionFields.rifleConfiguration.value.trim();

    saveSession();
}

Object.values(sessionFields).forEach(field => {
    field.addEventListener("input", saveFormToSession);
});

loadSessionIntoForm();

function buildReportSnapshot(ammoData, shotData, statisticsData)
{
    return {
        software : {
            name : "ChronoMate 2026",
            version : CHRONOMATE_VERSION,
            generated : new Date().toISOString()
        },
        session : structuredClone(chronoSession),
        ammo : ammoData,
        shots : shotData,
        statistics : statisticsData
    };
}
