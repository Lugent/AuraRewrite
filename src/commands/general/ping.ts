import { ApplicationCommandType, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import { CommandStructure } from "../../typings/Command";

const command: CommandStructure = {
    id: "ping",
    applications: [
        {
            format: {
                name: "ping",
                type: ApplicationCommandType.ChatInput,
                description: "Checks bot's latency",
                descriptionLocalizations: {"es-ES": "Muestra la latencia del bot"}
            },

            async execute({client, interaction}) {
                let button = new ButtonBuilder();
                button.setCustomId("update_ping");
                button.setStyle(ButtonStyle.Primary);
                button.setLabel("Update Ping");
                interaction.reply({content: client.ws.ping + "ms", ephemeral: true, components: [{type: ComponentType.ActionRow, components: [button]}]});
            }
        }
    ],

    buttons: [
        {
            name: "update_ping",
            async execute({client, interaction}) {
                let button = new ButtonBuilder();
                button.setCustomId("update_ping");
                button.setStyle(ButtonStyle.Primary);
                button.setLabel("Update Ping");
                interaction.update({content: client.ws.ping + "ms", components: [{type: ComponentType.ActionRow, components: [button]}]})
            }
        }
    ]
};
export default command;