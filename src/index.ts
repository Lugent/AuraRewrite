require("dotenv").config();
import { ButtonInteraction, CommandInteraction, ComponentType, InteractionType } from "discord.js";
import { AuraClient } from "./structures/Client";
import { CommandStructureApplications, CommandStructureButtons } from "./typings/Command";

export const client = new AuraClient();
client.start();

client.on("ready", async () => {
    client.registerApplications();
});

client.on("interactionCreate", async (interaction) => {
    console.log(interaction);
    switch (interaction.type) {
        case InteractionType.ApplicationCommand: {
            let name: string = interaction.commandName;
            let handler: CommandStructureApplications;
            client.commands.forEach(async (cmd) => { handler = cmd.applications ? cmd.applications.find(app => (app.format.name === name)) : undefined; });
            if (handler) { handler.execute({client, interaction: interaction as CommandInteraction}); }
            break;
        }

        case InteractionType.ApplicationCommandAutocomplete: {
            break;
        }

        case InteractionType.MessageComponent: {
            switch (interaction.componentType) {
                case ComponentType.Button: {
                    let name: string = interaction.customId;
                    let handler: CommandStructureButtons;
                    client.commands.forEach(async (cmd) => { handler = cmd.buttons ? cmd.buttons.find(app => (app.name == name)) : undefined; })
                    if (handler) { handler.execute({client, interaction: interaction as ButtonInteraction}); }
                    break;
                }

                case ComponentType.SelectMenu: {
                    break;
                }
            }
            break;
        }

        case InteractionType.ModalSubmit: {
            break;
        }
    }
});