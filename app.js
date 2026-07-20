/*
============================================================

 ChronoMate 2026
 Version : v1.1.1

 Author:
 Chris Bruce (CBDesignS)

 Developed with ChatGPT (OpenAI GPT-5.5)

 https://github.com/CBDesignS/ChronoMate

============================================================
*/


//============================================================
// Global Variables
//============================================================

let ammoDatabase = [];
let userAmmo = [];
let savedRifles = [];
let shotHistory = [];

const USER_AMMO_STORAGE_KEY = "ChronoMateUserAmmo";
const SAVED_RIFLES_STORAGE_KEY = "ChronoMateSavedRifles";


//============================================================
// DOM Elements
//============================================================

const calibreSelect      = document.getElementById("calibre");
const manufacturerSelect = document.getElementById("manufacturer");
const ammoSelect         = document.getElementById("ammo");

const customWeightInput  = document.getElementById("customWeight");
const customWeightUnit   = document.getElementById("customWeightUnit");

const userAmmoManufacturerInput = document.getElementById("userAmmoManufacturer");
const userAmmoNameInput         = document.getElementById("userAmmoName");
const userAmmoWeightInput       = document.getElementById("userAmmoWeight");
const userAmmoWeightUnit        = document.getElementById("userAmmoWeightUnit");
const userAmmoHeadSizeInput    = document.getElementById("userAmmoHeadSize");
const saveUserAmmoButton        = document.getElementById("btnSaveUserAmmo");
const deleteUserAmmoButton      = document.getElementById("btnDeleteUserAmmo");
const userAmmoPanel             = document.getElementById("userAmmoPanel");

const savedRifleSelect          = document.getElementById("savedRifleSelect");
const saveRifleButton           = document.getElementById("btnSaveRifle");
const loadRifleButton           = document.getElementById("btnLoadRifle");
const deleteRifleButton         = document.getElementById("btnDeleteRifle");

const velocityInput      = document.getElementById("velocity");
const shotEntryForm      = document.getElementById("shotEntryForm");
const shotTargetSelect   = document.getElementById("shotTarget");
const shotCounter        = document.getElementById("shotCounter");
const shotCounterBox     = document.getElementById("shotCounterBox");
const velocityUnits      = document.getElementById("velocityUnits");

const powerMode          = document.getElementById("powerMode");

const grainsDisplay      = document.getElementById("weightGrains");
const gramsDisplay       = document.getElementById("weightGrams");
const headSizeDisplay    = document.getElementById("headSizeDisplay");

const energyFTLB         = document.getElementById("energyFTLB");
const energyJoules       = document.getElementById("energyJoules");

const velocityFPS        = document.getElementById("velocityFPS");
const velocityMPS        = document.getElementById("velocityMPS");

const powerStatus        = document.getElementById("powerStatus");
const powerBar           = document.getElementById("powerBar");

const shotTable          = document.getElementById("shotTable");
const statistics         = document.getElementById("statistics");

const addShotButton      = document.getElementById("btnAddShot");


//============================================================
// Utility Functions
//============================================================

function grainsToGrams(grains)
{
    return grains * 0.06479891;
}


function gramsToGrains(grams)
{
    return grams / 0.06479891;
}


function metresToFPS(ms)
{
    return ms * 3.28084;
}


function fpsToMetres(fps)
{
    return fps / 3.28084;
}


//============================================================
// User Ammo Storage
//============================================================

function loadUserAmmo()
{
    try
    {
        userAmmo =
            JSON.parse(
                localStorage.getItem(USER_AMMO_STORAGE_KEY)
            ) || [];
    }
    catch(error)
    {
        userAmmo = [];
    }
}


function saveUserAmmo()
{
    localStorage.setItem(
        USER_AMMO_STORAGE_KEY,
        JSON.stringify(userAmmo)
    );
}


function getUserAmmoForCurrentCalibre()
{
    return userAmmo.filter(item =>
        item.calibre === calibreSelect.value
    );
}


function getAmmoListForSelectedManufacturer()
{
    const manufacturer =
        manufacturerSelect.value;

    if(manufacturer === "User Ammo")
    {
        return getUserAmmoForCurrentCalibre();
    }

    return ammoDatabase.filter(item =>
        item.manufacturer === manufacturer
    );
}


function convertWeightInputOnUnitChange(input, unitSelect)
{
    if(!input || !unitSelect)
        return;

    const previousUnit =
        unitSelect.dataset.previousUnit || "grains";

    const selectedUnit =
        unitSelect.value;

    const currentValue =
        parseFloat(input.value);

    if(!isNaN(currentValue) && currentValue > 0 && previousUnit !== selectedUnit)
    {
        input.value =
            selectedUnit === "grams"
                ? grainsToGrams(currentValue).toFixed(3)
                : gramsToGrains(currentValue).toFixed(2);
    }

    unitSelect.dataset.previousUnit = selectedUnit;
}


function saveUserAmmoFromForm()
{
    const manufacturer =
        userAmmoManufacturerInput?.value.trim() || "";

    const name =
        userAmmoNameInput?.value.trim() || "";

    const enteredWeight =
        parseFloat(userAmmoWeightInput?.value);

    const grains =
        userAmmoWeightUnit?.value === "grams"
            ? gramsToGrains(enteredWeight)
            : enteredWeight;

    const enteredHeadSize =
        parseFloat(userAmmoHeadSizeInput?.value);

    const headSize =
        !isNaN(enteredHeadSize) && enteredHeadSize > 0
            ? enteredHeadSize
            : null;

    if(!manufacturer || !name || isNaN(grains) || grains <= 0)
    {
        alert("Please enter manufacturer, pellet name, and a valid weight.");
        return;
    }

    const newAmmo = {
        id: Date.now().toString(),
        calibre: calibreSelect.value,
        manufacturer: manufacturer,
        name: name,
        grains: grains,
        headSize: headSize
    };

    userAmmo.push(newAmmo);
    saveUserAmmo();

    if(userAmmoManufacturerInput)
        userAmmoManufacturerInput.value = "";

    if(userAmmoNameInput)
        userAmmoNameInput.value = "";

    if(userAmmoWeightInput)
        userAmmoWeightInput.value = "";

    if(userAmmoHeadSizeInput)
        userAmmoHeadSizeInput.value = "";

    buildManufacturerList();

    manufacturerSelect.value = "User Ammo";
    buildAmmoList();

    ammoSelect.selectedIndex =
        getUserAmmoForCurrentCalibre().length - 1;

    updateSelectedAmmo();
}




function deleteSelectedUserAmmo()
{
    if(manufacturerSelect.value !== "User Ammo")
    {
        alert("Select User Ammo first.");
        return;
    }

    const ammoList =
        getUserAmmoForCurrentCalibre();

    const selectedAmmo =
        ammoList[ammoSelect.selectedIndex];

    if(!selectedAmmo)
    {
        alert("There is no selected User Pellet to delete.");
        return;
    }

    const confirmed = confirm(
        "Delete selected User Pellet?\n\n" +
        `${selectedAmmo.manufacturer} - ${selectedAmmo.name} ` +
        `(${selectedAmmo.grains.toFixed(2)} gr` +
        `${selectedAmmo.headSize ? `, ${Number(selectedAmmo.headSize).toFixed(2)} mm` : ""})`
    );

    if(!confirmed)
        return;

    userAmmo =
        userAmmo.filter(item => item.id !== selectedAmmo.id);

    saveUserAmmo();

    buildManufacturerList();
    manufacturerSelect.value = "User Ammo";
    buildAmmoList();

    const remainingAmmo =
        getUserAmmoForCurrentCalibre();

    if(remainingAmmo.length > 0)
    {
        ammoSelect.selectedIndex =
            Math.min(ammoSelect.selectedIndex, remainingAmmo.length - 1);

        updateSelectedAmmo();
    }
    else
    {
        grainsDisplay.textContent = "0.00";
        gramsDisplay.textContent = "0.000";

        if(headSizeDisplay)
            headSizeDisplay.textContent = "Not specified";

        calculateEnergy();
    }
}


function updateUserAmmoPanelVisibility()
{
    if(!userAmmoPanel)
        return;

    userAmmoPanel.style.display =
        manufacturerSelect.value === "User Ammo"
            ? "block"
            : "none";
}


//============================================================
// Saved Rifle Storage
//============================================================

function loadSavedRifles()
{
    try
    {
        savedRifles =
            JSON.parse(
                localStorage.getItem(SAVED_RIFLES_STORAGE_KEY)
            ) || [];
    }
    catch(error)
    {
        savedRifles = [];
    }
}


function saveSavedRifles()
{
    localStorage.setItem(
        SAVED_RIFLES_STORAGE_KEY,
        JSON.stringify(savedRifles)
    );
}


function getCurrentRifleFromForm()
{
    return {
        id: Date.now().toString(),
        manufacturer: document.getElementById("rifleManufacturer")?.value.trim() || "",
        model: document.getElementById("rifleModel")?.value.trim() || "",
        serial: document.getElementById("rifleSerial")?.value.trim() || "",
        configuration: document.getElementById("rifleConfiguration")?.value.trim() || ""
    };
}


function getRifleDisplayName(rifle)
{
    const parts = [
        rifle.manufacturer,
        rifle.model,
        rifle.configuration
    ].filter(Boolean);

    return parts.join(" - ") || "Unnamed Rifle";
}


function buildSavedRifleList()
{
    if(!savedRifleSelect)
        return;

    savedRifleSelect.innerHTML = "";

    if(savedRifles.length === 0)
    {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No saved rifles";
        savedRifleSelect.appendChild(option);
        return;
    }

    savedRifles.forEach(rifle =>
    {
        const option = document.createElement("option");
        option.value = rifle.id;
        option.textContent = getRifleDisplayName(rifle);
        savedRifleSelect.appendChild(option);
    });
}


function showSuccessMessage(message)
{
    if(window.AndroidBridge &&
       typeof window.AndroidBridge.showToast === "function")
    {
        window.AndroidBridge.showToast(message);
        return;
    }

    alert(message);
}


function saveCurrentRifle()
{
    const rifle =
        getCurrentRifleFromForm();

    if(!rifle.manufacturer && !rifle.model)
    {
        alert("Enter at least a rifle manufacturer or model before saving.");
        return;
    }

    savedRifles.push(rifle);
    saveSavedRifles();
    buildSavedRifleList();

    if(savedRifleSelect)
        savedRifleSelect.value = rifle.id;

    showSuccessMessage("Rifle saved successfully.");
}


function loadSelectedRifle()
{
    if(!savedRifleSelect || !savedRifleSelect.value)
    {
        alert("Select a saved rifle first.");
        return;
    }

    const rifle =
        savedRifles.find(item =>
            item.id === savedRifleSelect.value
        );

    if(!rifle)
        return;

    setValueById("rifleManufacturer", rifle.manufacturer);
    setValueById("rifleModel", rifle.model);
    setValueById("rifleSerial", rifle.serial);
    setValueById("rifleConfiguration", rifle.configuration);

    if(typeof saveFormToSession === "function")
    {
        saveFormToSession();
    }
}


function deleteSelectedRifle()
{
    if(!savedRifleSelect || !savedRifleSelect.value)
    {
        alert("Select a saved rifle first.");
        return;
    }

    const rifle =
        savedRifles.find(item =>
            item.id === savedRifleSelect.value
        );

    if(!rifle)
        return;

    const confirmed = confirm(
        "Delete saved rifle?\n\n" + getRifleDisplayName(rifle)
    );

    if(!confirmed)
        return;

    savedRifles =
        savedRifles.filter(item =>
            item.id !== rifle.id
        );

    saveSavedRifles();
    buildSavedRifleList();
}


//============================================================
// Load Ammo Database
//============================================================

function loadAmmoDatabase()
{
    switch(calibreSelect.value)
    {
        case ".177":
            ammoDatabase = ammo177;
            break;

        case ".22":
            ammoDatabase = ammo22;
            break;

        case ".25":
            ammoDatabase = ammo25;
            break;

        default:
            ammoDatabase = ammo177;
            break;
    }

    buildManufacturerList();
}


//============================================================
// Build Manufacturer List
//============================================================

function buildManufacturerList()
{
    manufacturerSelect.innerHTML = "";

    const selectedManufacturer =
        manufacturerSelect.value;

    const manufacturers =
        [...new Set(
            ammoDatabase.map(item => item.manufacturer)
        )].sort();

    // Always show the User Ammo option so new pellets can be added
    manufacturers.push("User Ammo");

    manufacturers.forEach(manufacturer =>
    {
        const option = document.createElement("option");

        option.value = manufacturer;
        option.textContent = manufacturer;

        manufacturerSelect.appendChild(option);
    });

    if(manufacturers.includes(selectedManufacturer))
    {
        manufacturerSelect.value = selectedManufacturer;
    }

    buildAmmoList();
}
//============================================================
// Build Ammo List
//============================================================

function buildAmmoList()
{
    ammoSelect.innerHTML = "";

    const ammoList =
        getAmmoListForSelectedManufacturer();

    ammoList.forEach((ammo, index) =>
    {
        const option = document.createElement("option");

        option.value = index;

        const headSizeText =
            ammo.headSize
                ? `, ${Number(ammo.headSize).toFixed(2)} mm`
                : "";

        if(manufacturerSelect.value === "User Ammo")
        {
            option.textContent =
                `${ammo.manufacturer} - ${ammo.name} (${ammo.grains.toFixed(2)} gr${headSizeText})`;
        }
        else
        {
            option.textContent =
                `${ammo.name} (${ammo.grains.toFixed(2)} gr${headSizeText})`;
        }

        ammoSelect.appendChild(option);
    });

    updateSelectedAmmo();
    updateUserAmmoPanelVisibility();
}


//============================================================
// Update Selected Ammo
//============================================================

function updateSelectedAmmo()
{
    const ammoList =
        getAmmoListForSelectedManufacturer();

    const selectedAmmo = ammoList[ammoSelect.selectedIndex];

    if (!selectedAmmo)
        return;

    grainsDisplay.textContent =
        selectedAmmo.grains.toFixed(2);

    gramsDisplay.textContent =
        grainsToGrams(selectedAmmo.grains).toFixed(3);

    if(headSizeDisplay)
    {
        headSizeDisplay.textContent =
            selectedAmmo.headSize
                ? `${Number(selectedAmmo.headSize).toFixed(2)} mm`
                : "Not specified";
    }

    calculateEnergy();
}


//============================================================
// Get Current Pellet Weight
//============================================================

function getCurrentWeight()
{
    const custom =
        parseFloat(customWeightInput.value);

    if (!isNaN(custom) && custom > 0)
    {
        return customWeightUnit?.value === "grams"
            ? gramsToGrains(custom)
            : custom;
    }

    const ammoList =
        getAmmoListForSelectedManufacturer();

    const selectedAmmo =
        ammoList[ammoSelect.selectedIndex];

    if (!selectedAmmo)
        return 0;

    return selectedAmmo.grains;
}


//============================================================
// Register Event Listeners
//============================================================

calibreSelect.addEventListener(
    "change",
    loadAmmoDatabase
);

manufacturerSelect.addEventListener(
    "change",
    buildAmmoList
);

ammoSelect.addEventListener(
    "change",
    updateSelectedAmmo
);

customWeightInput.addEventListener(
    "input",
    calculateEnergy
);

if(customWeightUnit)
{
    customWeightUnit.dataset.previousUnit = customWeightUnit.value;

    customWeightUnit.addEventListener(
        "change",
        function()
        {
            convertWeightInputOnUnitChange(
                customWeightInput,
                customWeightUnit
            );

            calculateEnergy();
        }
    );
}

if(userAmmoWeightUnit)
{
    userAmmoWeightUnit.dataset.previousUnit = userAmmoWeightUnit.value;

    userAmmoWeightUnit.addEventListener(
        "change",
        function()
        {
            convertWeightInputOnUnitChange(
                userAmmoWeightInput,
                userAmmoWeightUnit
            );
        }
    );
}


if(saveUserAmmoButton)
{
    saveUserAmmoButton.addEventListener(
        "click",
        saveUserAmmoFromForm
    );
}

if(deleteUserAmmoButton)
{
    deleteUserAmmoButton.addEventListener(
        "click",
        deleteSelectedUserAmmo
    );
}

if(saveRifleButton)
{
    saveRifleButton.addEventListener(
        "click",
        saveCurrentRifle
    );
}

if(loadRifleButton)
{
    loadRifleButton.addEventListener(
        "click",
        loadSelectedRifle
    );
}

if(deleteRifleButton)
{
    deleteRifleButton.addEventListener(
        "click",
        deleteSelectedRifle
    );
}

velocityInput.addEventListener(
    "input",
    calculateEnergy
);

if(shotEntryForm)
{
    shotEntryForm.addEventListener(
        "submit",
        function(event)
        {
            event.preventDefault();
            addShot();
        }
    );
}

velocityInput.addEventListener(
    "keydown",
    function(event)
    {
        if (event.key === "Enter" || event.keyCode === 13)
        {
            event.preventDefault();
            addShot();
        }
    }
);

velocityUnits.addEventListener(
    "change",
    calculateEnergy
);

powerMode.addEventListener(
    "change",
    calculateEnergy
);
//============================================================
// Calculate Energy
//============================================================

function calculateEnergy()
{
    const weight = getCurrentWeight();

    let fps = parseFloat(velocityInput.value);

    if (isNaN(fps))
        fps = 0;

    if (velocityUnits.value === "mps")
    {
        fps = metresToFPS(fps);
    }

    const mps = fpsToMetres(fps);

    const ftlb =
        (weight * fps * fps) / 450240;

    const joules =
        ftlb * 1.35582;

    velocityFPS.textContent =
        fps.toFixed(1);

    velocityMPS.textContent =
        mps.toFixed(1);

    energyFTLB.textContent =
        ftlb.toFixed(2);

    energyJoules.textContent =
        joules.toFixed(2);

    updatePowerBar(ftlb);

    return {

        fps: fps,

        mps: mps,

        ftlb: ftlb,

        joules: joules

    };
}


//============================================================
// Update Power Bar
//============================================================

function updatePowerBar(ftlb)
{
    let maxPower = 12;

    if (powerMode.value === "999")
    {
        maxPower = 40;
    }

    const percentage =
        Math.min(
            (ftlb / maxPower) * 100,
            100
        );

    powerBar.style.width =
        percentage + "%";

    if (powerMode.value === "999")
    {
        powerBar.style.background =
            "#2563eb";

        powerStatus.className =
            "status";

        powerStatus.textContent =
            "FAC MODE";

        return;
    }

    if (ftlb < 11.50)
    {
        powerBar.style.background =
            "#22c55e";

        powerStatus.className =
            "status safe";

        powerStatus.textContent =
            "SAFE";
    }
    else if (ftlb < 12.00)
    {
        powerBar.style.background =
            "#f59e0b";

        powerStatus.className =
            "status warning";

        powerStatus.textContent =
            "CAUTION";
    }
    else
    {
        powerBar.style.background =
            "#ef4444";

        powerStatus.className =
            "status danger";

        powerStatus.textContent =
            "OVER LIMIT";
    }
}
//============================================================
// Shot Counter
//============================================================

function updateShotCounter()
{
    if(!shotTargetSelect || !shotCounter)
    {
        return;
    }

    const target =
        Number(shotTargetSelect.value) || 10;

    const recorded =
        shotHistory.length;

    const complete =
        recorded >= target;

    shotCounter.textContent =
        complete
            ? `${recorded} of ${target} ✓`
            : `${recorded} of ${target}`;

    if(shotCounterBox)
    {
        shotCounterBox.classList.toggle(
            "complete",
            complete
        );
    }
}


if(shotTargetSelect)
{
    shotTargetSelect.addEventListener(
        "change",
        updateShotCounter
    );
}


//============================================================
// Add Shot
//============================================================


function addShot()
{
    const result = calculateEnergy();

    if (result.fps <= 0)
        return;

    if (shotHistory.length === 0)
    {
        if(typeof saveFormToSession === "function")
        {
            saveFormToSession();
        }

        if(typeof refreshSessionTimestamp === "function")
        {
            refreshSessionTimestamp();
        }
    }

    shotHistory.push(result);

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${shotHistory.length}</td>
        <td>${result.fps.toFixed(1)}</td>
        <td>${result.ftlb.toFixed(2)}</td>
        <td>${result.joules.toFixed(2)}</td>
    `;

    shotTable.appendChild(row);

    updateStatistics();

    updateShotCounter();

    velocityInput.value = "";
    velocityInput.focus();
}


//============================================================
// Update Statistics
//============================================================

function updateStatistics()
{
    if (shotHistory.length === 0)
    {
        statistics.textContent =
            "No shots recorded.";

        return;
    }

    const fpsValues =
        shotHistory.map(shot => shot.fps);

    const highest =
        Math.max(...fpsValues);

    const lowest =
        Math.min(...fpsValues);

    const average =
        fpsValues.reduce((a, b) => a + b, 0)
        / fpsValues.length;

    const spread =
        highest - lowest;

    statistics.innerHTML = `
        Shots : ${shotHistory.length}<br>
        Average FPS : ${average.toFixed(1)}<br>
        Highest FPS : ${highest.toFixed(1)}<br>
        Lowest FPS : ${lowest.toFixed(1)}<br>
        Extreme Spread : ${spread.toFixed(1)}
    `;
}


//============================================================
// Application Initialisation
//============================================================

addShotButton.addEventListener(
    "click",
    addShot
);

loadUserAmmo();
loadSavedRifles();
buildSavedRifleList();
loadAmmoDatabase();
//============================================================
// Theme Support
//============================================================

const themeButton =
    document.getElementById("themeToggle");


function setTheme(theme)
{
    if(theme==="dark")
    {
        document.body.classList.add("dark");

        themeButton.textContent="🌙 Dark";
    }
    else
    {
        document.body.classList.remove("dark");

        themeButton.textContent="☀ Light";
    }

    localStorage.setItem(
        "chronomate-theme",
        theme
    );
}


themeButton.addEventListener(
    "click",
    () =>
    {
        const dark =
            document.body.classList.contains("dark");

        setTheme(
            dark ? "light" : "dark"
        );
    }
);


const savedTheme =
    localStorage.getItem(
        "chronomate-theme"
    );

setTheme(
    savedTheme ?? "dark"
);
//============================================================
// Report Data Helpers
//============================================================

function getSelectedAmmoForReport()
{
    const ammoList =
        getAmmoListForSelectedManufacturer();

    const selectedAmmo =
        ammoList[ammoSelect.selectedIndex];

    if (!selectedAmmo)
        return null;

    return {
        calibre : calibreSelect.value,
        manufacturer : selectedAmmo.manufacturer,
        name : selectedAmmo.name,
        grains : selectedAmmo.grains,
        grams : grainsToGrams(selectedAmmo.grains),
        headSize : selectedAmmo.headSize || null
    };
}


function getStatisticsForReport()
{
    if (shotHistory.length === 0)
    {
        return {
            shotCount : 0
        };
    }

    const fpsValues =
        shotHistory.map(shot => shot.fps);

    const energyValues =
        shotHistory.map(shot => shot.ftlb);

    const highestFPS =
        Math.max(...fpsValues);

    const lowestFPS =
        Math.min(...fpsValues);

    const averageFPS =
        fpsValues.reduce((a, b) => a + b, 0)
        / fpsValues.length;

    const highestFTLB =
        Math.max(...energyValues);

    const lowestFTLB =
        Math.min(...energyValues);

    const averageFTLB =
        energyValues.reduce((a, b) => a + b, 0)
        / energyValues.length;

    return {
        shotCount : shotHistory.length,
        averageFPS : averageFPS,
        highestFPS : highestFPS,
        lowestFPS : lowestFPS,
        extremeSpreadFPS : highestFPS - lowestFPS,
        averageFTLB : averageFTLB,
        highestFTLB : highestFTLB,
        lowestFTLB : lowestFTLB,
        selectedLimit : powerMode.value === "999" ? "FAC" : "Sub-12 ft-lb",
        result :
            powerMode.value === "999"
                ? "FAC MODE"
                : highestFTLB < 12
                    ? "PASS"
                    : "OVER SELECTED LIMIT"
    };
}


function getChronoMateReport()
{
    return buildReportSnapshot(
        getSelectedAmmoForReport(),
        structuredClone(shotHistory),
        getStatisticsForReport()
    );
}
//============================================================
// Generate Report Preview
//============================================================

const generateReportButton =
    document.getElementById("btnGenerateReport");

function generateReportPreview() {
    const report = getChronoMateReport();

    openReportWindow(report);
}

if(generateReportButton)
{
    generateReportButton.addEventListener(
        "click",
        generateReportPreview
    );
}

//============================================================
// Export / Import ChronoMate Backup
//============================================================

const exportBackupButton =
    document.getElementById("btnExportBackup");

const importBackupButton =
    document.getElementById("btnImportBackup");

const backupFileInput =
    document.getElementById("backupFileInput");


function getValueById(id)
{
    return document.getElementById(id)?.value || "";
}


function setValueById(id, value)
{
    const field =
        document.getElementById(id);

    if(field)
    {
        field.value =
            value || "";
    }
}


function exportChronoMateBackup()
{
    const backup = {
        software: {
            name: "ChronoMate 2026",
            version: CHRONOMATE_VERSION,
            created: new Date().toISOString()
        },

        session: {
            tester: getValueById("testerName"),
            chronograph: getValueById("chronographName"),
            notes: getValueById("sessionNotes")
        },

        currentRifle: {
            manufacturer: getValueById("rifleManufacturer"),
            model: getValueById("rifleModel"),
            serial: getValueById("rifleSerial"),
            configuration: getValueById("rifleConfiguration")
        },

        userAmmo: userAmmo,
        savedRifles: savedRifles
    };

    const json =
        JSON.stringify(backup, null, 4);

    const timestamp =
        new Date().toISOString().slice(0, 16).replace("T", "_").replace(":", "");

    const filename =
        `ChronoMate_Backup_${timestamp}.json`;

    // Android WebView uses the system Save As picker. The browser path
    // below remains unchanged for the desktop version of ChronoMate.
    if(window.AndroidBridge &&
       typeof window.AndroidBridge.exportBackup === "function")
    {
        window.AndroidBridge.exportBackup(json, filename);
        return;
    }

    const blob =
        new Blob([json], { type: "application/json" });

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        filename;

    link.click();

    URL.revokeObjectURL(link.href);
}


function importChronoMateBackup(backup)
{
    if(!backup || !backup.software || backup.software.name !== "ChronoMate 2026")
    {
        alert("This is not a valid ChronoMate backup file.");
        return;
    }

    const importedSession =
        backup.session || {};

    const importedRifle =
        backup.currentRifle || backup.rifle || {};

    setValueById("testerName", importedSession.tester);
    setValueById("chronographName", importedSession.chronograph);
    setValueById("sessionNotes", importedSession.notes);

    setValueById("rifleManufacturer", importedRifle.manufacturer);
    setValueById("rifleModel", importedRifle.model);
    setValueById("rifleSerial", importedRifle.serial);
    setValueById("rifleConfiguration", importedRifle.configuration);

    if(Array.isArray(backup.userAmmo))
    {
        userAmmo = backup.userAmmo;
        saveUserAmmo();
        loadAmmoDatabase();
    }

    if(Array.isArray(backup.savedRifles))
    {
        savedRifles = backup.savedRifles;
        saveSavedRifles();
        buildSavedRifleList();
    }

    if(typeof saveFormToSession === "function")
    {
        saveFormToSession();
    }

    showSuccessMessage("ChronoMate backup imported successfully.");
}


function handleBackupFileSelected(event)
{
    const file =
        event.target.files[0];

    if(!file)
    {
        return;
    }

    const reader =
        new FileReader();

    reader.onload = function(loadEvent)
    {
        try
        {
            const backup =
                JSON.parse(loadEvent.target.result);

            importChronoMateBackup(backup);
        }
        catch(error)
        {
            alert("This backup file could not be read.");
        }

        backupFileInput.value =
            "";
    };

    reader.readAsText(file);
}


if(exportBackupButton)
{
    exportBackupButton.addEventListener(
        "click",
        exportChronoMateBackup
    );
}


if(importBackupButton && backupFileInput)
{
    importBackupButton.addEventListener(
        "click",
        function()
        {
            // Android WebView uses the system Open File picker. The hidden
            // file input remains unchanged for the desktop browser version.
            if(window.AndroidBridge &&
               typeof window.AndroidBridge.importBackup === "function")
            {
                window.AndroidBridge.importBackup();
                return;
            }

            backupFileInput.click();
        }
    );

    backupFileInput.addEventListener(
        "change",
        handleBackupFileSelected
    );
}


//============================================================
// Clear Shot String
//============================================================

const clearShotsButton =
    document.getElementById("btnClearShots");


if(clearShotsButton)
{

    clearShotsButton.addEventListener(

        "click",

        clearShotHistory

    );

}


function clearShotHistory()
{
    if(shotHistory.length===0)
    {
        alert("There are no shots to clear.");
        return;
    }

    const confirmed = confirm(
        "Clear the current shot string?\n\nAll recorded shots for this session will be removed."
    );

    if(!confirmed)
        return;

    shotHistory = [];

    shotTable.innerHTML = "";

    statistics.textContent =
        "No shots recorded.";

    energyFTLB.textContent = "0.00";
    energyJoules.textContent = "0.00";
    velocityFPS.textContent = "0";
    velocityMPS.textContent = "0";

    powerStatus.textContent = "READY";
    powerStatus.className = "status safe";

    powerBar.style.width = "0%";
}



//============================================================
// Initialise Shot Counter
//============================================================

updateShotCounter();
