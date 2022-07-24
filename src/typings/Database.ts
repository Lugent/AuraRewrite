import { Database } from "better-sqlite3";

export type AuraDatabases = {bot: Database, guild: Database, user: Database};