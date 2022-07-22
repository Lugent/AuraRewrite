require("dotenv").config();
import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, InteractionType } from "discord.js";
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
            if (interaction instanceof ChatInputCommandInteraction) {
                let name: string = interaction.commandName;
                let handler: CommandStructureApplications;
                client.commands.forEach(async (cmd) => {
                    let found_handler: CommandStructureApplications;
                    if (cmd.applications) { found_handler = cmd.applications.find(app => (app.format.name == name)); }
                    if (found_handler) { handler = found_handler; }
                });

                if (handler) { handler.execute({client, interaction: interaction as ChatInputCommandInteraction}); }
            }
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
                    client.commands.forEach(async (cmd) => {
                        let found_handler: CommandStructureButtons;
                        if (cmd.buttons) { handler = cmd.buttons.find(app => (app.name == name)); }
                        if (found_handler) { handler = found_handler; }
                    })

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