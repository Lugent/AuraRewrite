import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { EmbedBuilder } from "discord.js";
import { ApplicationCommandOptionType, AttachmentBuilder } from "discord.js";
import { InfoResponse, PlayerResponse, queryGameServerInfo, queryGameServerPlayer } from "steam-server-query";
import { getGameFolderName, getGModGamemodeCategory, getGModGamemodeIcon, getGModGamemodeName, getLocationFlag, getSourceMap, getSteamGame } from "../../functions/steamInfo";
import { CommandStructure } from "../../typings/Command";

dayjs.extend(duration);
let command: CommandStructure = {
    id: "steamquery",
    applications: [
        {
            format: {
                name: "steamquery",
                description: "Steam query command",
                options: [
                    {
                        name: "add",
                        description: "Add query",
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: "address",
                                description: "The IP address (and port) of the server",
                                type: ApplicationCommandOptionType.String,
                                required: true
                            }
                        ]
                    },
                    {
                        name: "remove",
                        description: "Remove query",
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: "address",
                                description: "The IP address (and port) of the server",
                                type: ApplicationCommandOptionType.String,
                                required: true
                            }
                        ]
                    },
                    {
                        name: "list",
                        description: "List queries",
                        type: ApplicationCommandOptionType.Subcommand
                    }
                ]
            },

            async execute({client, interaction}) {
                
            }
        },
        {
            format: {
                name: "serverinfo",
                description: "Retrieves information of a running steam's game server",
                options: [
                    {
                        name: "address",
                        description: "The IP address (and port) of the server to retrieve from",
                        type: ApplicationCommandOptionType.String,
                        required: true
                    }
                ]
            },

            async execute({client, interaction}) {
                let address = interaction.options.getString("address");
                if (address.split(":").length < 2) {
                    return interaction.reply({content: "Please, provide the port before checking the target server", ephemeral: true});
                }

                await interaction.deferReply();

                let response = {embeds: [], files: []};
                let embed: EmbedBuilder = new EmbedBuilder()
                let data: InfoResponse|void = await queryGameServerInfo(address, 4, 2000).catch(async (error: Error) => {
                    console.error(error);

                    embed.setColor([220, 0, 0]);
                    embed.setTitle("Something failed on gattering information.");
                    embed.setDescription(error.message);
                    await interaction.editReply({embeds: [embed]});
                });
                if (!data) { return; }

                console.log(data);

                let keywords = {};
                let ktags: string[] = data.keywords.trim().split(" ");
                for (let i: number = 0; i < ktags.length; i++) {
                    let keys: string[] = ktags[i].split(":");
                    let value = keys[1];
                    switch (keys[0]) {
                        case "loc": { keywords["location"] = value; break; } // Server's Location
                        case "gm": { keywords["gamemode"] = value; break; } // Garry's Mod - Gamemode
                        case "gmc": { keywords["gamemodeCategory"] = value; break; } // Garry's Mod - Gamemode Category
                    }
                }

                let location: string = keywords["location"] ?? "Unknown"
                let locFile: AttachmentBuilder = new AttachmentBuilder(await getLocationFlag(location), {name: "location.png"});
                embed.setFooter({text: address, iconURL: `attachment://location.png`})
                response.files.push(locFile);

                let mapFile: AttachmentBuilder = new AttachmentBuilder(await getSourceMap(data.map), {name: "map.png"});
                embed.setImage(`attachment://map.png`);
                response.files.push(mapFile);

                let gameFile: AttachmentBuilder = new AttachmentBuilder(await getSteamGame(data.folder), {name: "game.png"});
                embed.setAuthor({name: `${await getGameFolderName(data.folder)} v${data.version}`, iconURL: `attachment://game.png`});
                response.files.push(gameFile);

                embed.setColor([0, 220, 0]);
                embed.setTitle(((data.visibility == 1) ? "🔒 " : "") + data.name);
                embed.addFields({name: "Map", value: `${data.map}`, inline: true});
                embed.addFields({name: "Players", value: `${data.players} (${data.bots}) / ${data.maxPlayers}`, inline: true});

                if (keywords["gamemode"]) {
                    let gmFile: AttachmentBuilder = new AttachmentBuilder(await getGModGamemodeIcon(keywords["gamemode"]), {name: "gamemode.png"});
                    embed.setThumbnail(`attachment://gamemode.png`);
                    response.files.push(gmFile);

                    embed.addFields({name: "Gamemode", value: `${await getGModGamemodeName(keywords["gamemode"])}\n(${await getGModGamemodeCategory(keywords["gamemodeCategory"])})`, inline: true});
                }
                response.embeds.push(embed);

                let players: PlayerResponse|void = await queryGameServerPlayer(address).catch(async (error: Error) => {
                    console.error(error);
                });

                if (players) {
                    console.log(players);

                    let playersEmbed: EmbedBuilder = new EmbedBuilder();
                    playersEmbed.setColor([0, 220, 220]);
                    playersEmbed.setTitle("Player List");

                    let total = [];
                    for (let i = 0; i < players.players.length; i++) {
                        let player = players.players[i];
                        let name = (player.name.length > 0) ? player.name : "[<Unknown Player>]";
                        let score = player.score + "pts";

                        let format = dayjs.duration(player.duration * 1000);
                        let time = format.days() + "d " + format.hours() + "h " + format.minutes() + "m " + format.seconds() + "s"; //player.duration
                        total.push(name + " <=> " + score + " <=> " + time);
                    }
                    playersEmbed.setDescription((total.length > 0) ? total.join("\n") : "No one playing");
                    response.embeds.push(playersEmbed);
                }
                await interaction.editReply(response);
            }
        }
    ]
}
export default command;