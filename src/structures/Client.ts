import { ApplicationCommandDataResolvable, Client, Collection, GatewayIntentBits } from "discord.js";
import { readdirSync } from "fs";
import { CommandStructure } from "../typings/Command";
import initializeDatabase from "../functions/databaseSetup";
import { AuraDatabases } from "../typings/Database";

const intents: GatewayIntentBits[] = [
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent
];
export class AuraClient extends Client {
    public constructor() {
        super({intents: intents});
    }
    public commands: Collection<string, CommandStructure> = new Collection();
    public database: AuraDatabases = initializeDatabase();

    public start(): void {
        this.registerModules();
        this.login(process.env.discordToken);
    }

    public async registerModules() {
        let rootDir: string[] = await readdirSync(process.cwd() + "/src/commands").filter(dir => !dir.includes("."));
        if (!rootDir.length) { return; }

        for (let dir of rootDir) {
            let dirPath: string = process.cwd() + "/src/commands/" + dir;
            let filesDir: string[] = await readdirSync(dirPath);
            for (let file of filesDir) {
                let filePath = dirPath + "/" + file;
                let command: CommandStructure = (await import(filePath))?.default;
                this.commands.set(command.id, command);
            }
        }
        console.log(this.commands);
    }

    public async registerApplications() {
        let applicationCommands: ApplicationCommandDataResolvable[] = [];
        this.commands.forEach(async function (command) {
            for (let i = 0; i < command.applications.length; i++) {
                applicationCommands.push(command.applications[i].format);
            }
        });

        this.guilds.cache.forEach(async function (cachedGuild) {
            let guild = await cachedGuild.fetch();
            guild.commands.set(applicationCommands);
        });
    }
}