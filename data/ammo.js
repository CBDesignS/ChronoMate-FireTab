/*
============================================================

 ChronoMate 2026
 Version : v1.3.0

 Built-in Ammo Database

 Author:
 Chris Bruce (CBDesignS)

 Developed with ChatGPT (OpenAI GPT-5.5)

============================================================
*/


// Optional pellet head size may be added to any entry as:
// headSize: 5.52
// Entries without a verified head size should omit the property.

//============================================================
// .177
//============================================================

const ammo177 = [

    { manufacturer: "Air Arms", name: "Diabolo Field", grains: 8.44 },
    { manufacturer: "Air Arms", name: "Diabolo Field Express", grains: 7.87 },
    { manufacturer: "Air Arms", name: "Diabolo Field Heavy", grains: 10.34 },

    { manufacturer: "BSA", name: "Gold Star", grains: 8.64 },
    { manufacturer: "BSA", name: "Interceptor", grains: 7.87 },

    { manufacturer: "Bisley", name: "Magnum", grains: 10.65 },
    { manufacturer: "Bisley", name: "Practice", grains: 8.18 },
    { manufacturer: "Bisley", name: "Pest Control", grains: 8.64 },

    { manufacturer: "Crosman", name: "Premier", grains: 7.90 },
    { manufacturer: "Crosman", name: "Premier Hollow Point", grains: 7.90 },
    { manufacturer: "Crosman", name: "Premier Ultra Magnum", grains: 10.50 },

    { manufacturer: "Daystate", name: "Rangemaster Kaiser", grains: 8.44 },
    { manufacturer: "Daystate", name: "Rangemaster Sovereign", grains: 8.44 },

    { manufacturer: "FX", name: "Pellet", grains: 8.44 },

    { manufacturer: "Gamo", name: "Match", grains: 7.71 },
    { manufacturer: "Gamo", name: "Pro Magnum", grains: 7.56 },
    { manufacturer: "Gamo", name: "TS-10", grains: 10.49 },

    { manufacturer: "H&N", name: "Baracuda", grains: 10.65 },
    { manufacturer: "H&N", name: "Baracuda Hunter Extreme", grains: 9.57 },
    { manufacturer: "H&N", name: "Baracuda Match", grains: 10.65 },
    { manufacturer: "H&N", name: "Excite Econ II", grains: 7.48 },
    { manufacturer: "H&N", name: "Field Target Trophy", grains: 8.64 },
    { manufacturer: "H&N", name: "Hornet", grains: 9.57 },
    { manufacturer: "H&N", name: "Sport", grains: 8.18 },
    { manufacturer: "H&N", name: "Terminator", grains: 7.25 },

    { manufacturer: "JSB", name: "Exact", grains: 8.44 },
    { manufacturer: "JSB", name: "Exact Express", grains: 7.87 },
    { manufacturer: "JSB", name: "Exact Heavy", grains: 10.34 },
    { manufacturer: "JSB", name: "Exact Monster Redesigned", grains: 13.43 },
    { manufacturer: "JSB", name: "Exact RS", grains: 7.33 },
    { manufacturer: "JSB", name: "Hades", grains: 10.34 },

    { manufacturer: "QYS", name: "Domed", grains: 8.48 },
    { manufacturer: "QYS", name: "Domed Heavy", grains: 9.56 },
    { manufacturer: "QYS", name: "Flat Head", grains: 8.18 },
    { manufacturer: "QYS", name: "Pointed", grains: 8.48 },
    { manufacturer: "QYS", name: "Pointed Heavy", grains: 9.56 },
    { manufacturer: "QYS", name: "Streamlined", grains: 8.48 },
    { manufacturer: "QYS", name: "Streamlined Heavy", grains: 9.56 },

    { manufacturer: "RWS", name: "Hobby", grains: 7.00 },
    { manufacturer: "RWS", name: "Meisterkugeln", grains: 8.20 },
    { manufacturer: "RWS", name: "R10 Match", grains: 8.20 },
    { manufacturer: "RWS", name: "Super Field", grains: 8.40 },
    { manufacturer: "RWS", name: "Super H Point", grains: 6.90 },
    { manufacturer: "RWS", name: "Superdome", grains: 8.30 },

    { manufacturer: "Weihrauch", name: "FT Exact", grains: 8.64 }

];


//============================================================
// .22
//============================================================

const ammo22 = [

    { manufacturer: "Air Arms", name: "Diabolo Field", grains: 16.00 },
    { manufacturer: "Air Arms", name: "Diabolo Field Express", grains: 14.66 },
    { manufacturer: "Air Arms", name: "Diabolo Field Heavy", grains: 18.00 },

    { manufacturer: "BSA", name: "Fury", grains: 18.50, headSize: "5.50" },
    { manufacturer: "BSA", name: "Gold Star", grains: 15.89 },
    { manufacturer: "BSA", name: "Gold Star", grains: 14.66, headSize: "5.53" },
    { manufacturer: "BSA", name: "Interceptor", grains: 14.66 },

    { manufacturer: "Bisley", name: "Magnum", grains: 21.14 },
    { manufacturer: "Bisley", name: "Pest Control", grains: 18.21 },

    { manufacturer: "Crosman", name: "Premier", grains: 14.30 },
    { manufacturer: "Crosman", name: "Premier Hollow Point", grains: 14.30 },
    { manufacturer: "Crosman", name: "Premier Ultra Magnum", grains: 14.30 },

    { manufacturer: "Daystate", name: "Rangemaster Kaiser", grains: 15.89 },
    { manufacturer: "Daystate", name: "Rangemaster Sovereign", grains: 15.89 },

    { manufacturer: "FX", name: "Pellet", grains: 15.89 },
    { manufacturer: "FX", name: "Pellet Heavy", grains: 18.13 },

    { manufacturer: "Gamo", name: "Hunter", grains: 15.43 },
    { manufacturer: "Gamo", name: "Pro Magnum", grains: 15.42 },
    { manufacturer: "Gamo", name: "Rocket", grains: 14.30 },
    { manufacturer: "Gamo", name: "TS-22", grains: 21.75 },

    { manufacturer: "H&N", name: "Baracuda", grains: 21.14 },
    { manufacturer: "H&N", name: "Baracuda Hunter Extreme", grains: 18.52 },
    { manufacturer: "H&N", name: "Baracuda Match", grains: 21.14 },
    { manufacturer: "H&N", name: "Excite Econ II", grains: 12.96 },
    { manufacturer: "H&N", name: "Field Target Trophy", grains: 14.66 },
    { manufacturer: "H&N", name: "Hornet", grains: 16.20 },
    { manufacturer: "H&N", name: "Sport", grains: 13.73 },
    { manufacturer: "H&N", name: "Terminator", grains: 16.36 },

    { manufacturer: "JSB", name: "Exact Jumbo", grains: 15.89 },
    { manufacturer: "JSB", name: "Exact Jumbo Express", grains: 14.35 },
    { manufacturer: "JSB", name: "Exact Jumbo Heavy", grains: 18.13 },
    { manufacturer: "JSB", name: "Exact Jumbo Monster Redesigned", grains: 25.39 },
    { manufacturer: "JSB", name: "Exact Jumbo RS", grains: 13.43 },
    { manufacturer: "JSB", name: "Hades", grains: 15.89 },
    { manufacturer: "JSB", name: "Hades Monster", grains: 25.39 },

    { manufacturer: "QYS", name: "Domed", grains: 15.89 },
    { manufacturer: "QYS", name: "Domed Heavy", grains: 18.21 },

    { manufacturer: "RWS", name: "Hobby", grains: 11.90 },
    { manufacturer: "RWS", name: "Meisterkugeln", grains: 14.00 },
    { manufacturer: "RWS", name: "Super Field", grains: 15.90 },
    { manufacturer: "RWS", name: "Super H Point", grains: 14.20 },
    { manufacturer: "RWS", name: "Superdome", grains: 14.50 },

    { manufacturer: "Weihrauch", name: "FT Exact", grains: 15.89 }

];


//============================================================
// .25
//============================================================

const ammo25 = [

    { manufacturer: "Air Arms", name: "Diabolo Field", grains: 25.40 },

    { manufacturer: "Bisley", name: "Magnum", grains: 30.86 },

    { manufacturer: "FX", name: "Pellet", grains: 25.40 },

    { manufacturer: "H&N", name: "Baracuda", grains: 30.86 },
    { manufacturer: "H&N", name: "Baracuda Hunter Extreme", grains: 28.24 },
    { manufacturer: "H&N", name: "Field Target Trophy", grains: 20.06 },
    { manufacturer: "H&N", name: "Hornet", grains: 22.07 },

    { manufacturer: "JSB", name: "Exact King", grains: 25.39 },
    { manufacturer: "JSB", name: "Exact King Heavy MkII", grains: 33.95 },
    { manufacturer: "JSB", name: "Hades", grains: 26.54 },

    { manufacturer: "RWS", name: "Super H Point", grains: 25.00 },
    { manufacturer: "RWS", name: "Superdome", grains: 30.86 }

];
