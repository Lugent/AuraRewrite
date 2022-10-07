import { existsSync } from "fs";

let steamGames = {
    "garrysmod": "Garry's Mod"
}

let gmodGamemodes = {
    "base": "Base",
    "sandbox": "Sandbox",
    "terrortown": "Trouble In Terrorist Town",
    "darkrp": "DarkRP"
}

let gmodGamemodeCategories = {
    "other": "Other",
    "pvp": "PVP",
    "pve": "PVE",
    "rp": "Roleplay"
}

async function getGameFolderName(folder: string) {
    return steamGames[folder] ?? folder;
}

async function getGModGamemodeName(gamemode: string) {
    return gmodGamemodes[gamemode] ?? gamemode;
}

async function getGModGamemodeCategory(gamemodeCategory: string) {
    return gmodGamemodeCategories[gamemodeCategory] ?? gamemodeCategory;
}

async function getGModGamemodeIcon(gm: string) {
    let gmFound = `${process.cwd()}/assets/images/gmodGamemodes/${gm}.png`;
    let gmFallback = `${process.cwd()}/assets/images/gmodGamemodes/base.png`;
    return existsSync(gmFound) ? gmFound : gmFallback;
}

async function getSourceMap(map: string) {
    let mapFound = `${process.cwd()}/assets/images/sourceMaps/${map}.png`;
    let mapFallback = `${process.cwd()}/assets/images/sourceMaps/noicon.png`;
    return existsSync(mapFound) ? mapFound : mapFallback;
}

async function getSteamGame(game: string) {
    let gameFound = `${process.cwd()}/assets/images/steamGames/${game}.png`;
    let gameFallback = `${process.cwd()}/assets/images/steamGames/all.png`;
    return existsSync(gameFound) ? gameFound : gameFallback;
}

async function getLocationFlag(location: string) {
    let locFlag = `${process.cwd()}/assets/images/flags16/${location}.png`;
    let locFallback = `${process.cwd()}/assets/images/flags16/unknown.png`;
    return existsSync(locFlag) ? locFlag : locFallback;
}

export {
    getLocationFlag,
    getGameFolderName,
    getGModGamemodeName,
    getGModGamemodeCategory,
    getGModGamemodeIcon,
    getSourceMap,
    getSteamGame
};