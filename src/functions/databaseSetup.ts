import SQLite, { Database } from "better-sqlite3";
import { AuraDatabases } from "../typings/Database";



function setupBotDatabase(database: Database) {
    /*let profiles_table = database.prepare("SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'profiles';").get();
    if (!profiles_table["count(*)"]) {

    }*/

    database.pragma("synchronous = 1");
	database.pragma("journal_mode = wal");
}

function setupGuildDatabase(database: Database) {
    let profilesTable = database.prepare("SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = 'profiles';").get();
    if (!profilesTable["count(*)"]) {
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

    database.pragma("synchronous = 1");
	database.pragma("journal_mode = wal");
}

function initializeDatabase(): AuraDatabases {
    let botDatabase: Database = new SQLite(process.cwd() + "/database/bot.sqlite");
    let guildDatabase: Database = new SQLite(process.cwd() + "/database/guild.sqlite");
    let userDatabase: Database = new SQLite(process.cwd() + "/database/user.sqlite");
    setupGuildDatabase(guildDatabase);

    let databases: AuraDatabases = {bot: botDatabase, guild: guildDatabase, user: userDatabase};
    return databases;
}
export default initializeDatabase;