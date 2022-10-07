import SQLite, { Database } from "better-sqlite3";
import { AuraDatabases } from "../typings/Database";

function setupBotDatabase(database: Database): void {
    database.pragma(`synchronous = 1`);
	database.pragma(`journal_mode = wal`);
}

function setupGuildDatabase(database: Database): void {
    let steam_table = database.prepare(`SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'steam';`).get();
    if (!steam_table[`count(*)`]) {
        database.prepare(`CREATE TABLE "steam" (
            "id" INTEGER NOT NULL,
            "gid" TEXT NOT NULL DEFAULT -1,
            "cid" TEXT NOT NULL DEFAULT -1,
            "mid" TEXT NOT NULL DEFAULT -1,
            "ipaddress" TEXT NOT NULL DEFAULT -1,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`).run();
        database.prepare(`CREATE INDEX "steam_id" ON "steam" ("id");`).run();
    }

    let profilesTable = database.prepare(`SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'profiles';`).get();
    if (!profilesTable[`count(*)`]) {
        database.prepare(`CREATE TABLE "profiles" (
            "id" INTEGER NOT NULL,
            "gid" TEXT NOT NULL DEFAULT -1,
            "uid" TEXT NOT NULL DEFAULT -1,
            "credits" NUMERIC NOT NULL DEFAULT 0,
            "karma"	NUMERIC NOT NULL DEFAULT 0,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`).run();
        database.prepare(`CREATE INDEX "profiles_id" ON "profiles" ("id");`).run();
    }

    let levelsTable = database.prepare(`SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'levels';`).get();
    if (!levelsTable[`count(*)`]) {
        database.prepare(`CREATE TABLE "levels" (
            "id" INTEGER NOT NULL,
            "gid" TEXT NOT NULL DEFAULT -1,
            "uid" TEXT NOT NULL DEFAULT -1,
            "xp" NUMERIC NOT NULL DEFAULT 0,
            "level" NUMERIC NOT NULL DEFAULT 0,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`).run();
        database.prepare(`CREATE INDEX "levels_id" ON "levels" ("id");`).run();
    }

    database.pragma(`synchronous = 1`);
	database.pragma(`journal_mode = wal`);
}

function initializeDatabase(): AuraDatabases {
    let botDatabase: Database = new SQLite(`${process.cwd()}/database/bot.sqlite`);
    let guildDatabase: Database = new SQLite(`${process.cwd()}/database/guild.sqlite`);
    let userDatabase: Database = new SQLite(`${process.cwd()}/database/user.sqlite`);
    setupGuildDatabase(guildDatabase);

    let databases: AuraDatabases = {bot: botDatabase, guild: guildDatabase, user: userDatabase};
    return databases;
}
export default initializeDatabase;