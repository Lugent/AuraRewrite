import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import relativeTime from "dayjs/plugin/relativeTime";
import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, GuildMember, User } from "discord.js";
import { CommandStructure } from "../../typings/Command";


dayjs.extend(calendar);
dayjs.extend(relativeTime);
const command: CommandStructure = {
    id: "information",
    applications: [
        {
            format: {
                name: "info",
                description: "Information command",
                type: ApplicationCommandType.ChatInput,
                options: [
                    {
                        name: "user",
                        description: "View user's info",
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: "id",
                                description: "The ID of the specified user (if blank, returns yourself)",
                                type: ApplicationCommandOptionType.String,
                                required: false,
                                minLength: 1
                            }
                        ]
                    },
                    {
                        name: "member",
                        description: "View member's info",
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: "member",
                                description: "The specified member (if blank, returns yourself)",
                                type: ApplicationCommandOptionType.User,
                                required: false
                            }
                        ]
                    }
                ]
            },

            async execute({client, interaction}) {
                switch (interaction.options.getSubcommand()) {
                    case "user": {
                        await interaction.deferReply();
                        
                        let getUser: User|void = await client.users.fetch(interaction.options.getString("id") || interaction.user, {force: true}).catch((error) => {});
                        if (!getUser) {
                            return interaction.editReply({content: "Something failed or the user doesn't exists."})
                        }

                        let userEmbed: EmbedBuilder = new EmbedBuilder();
                        userEmbed.setColor(getUser.accentColor);
                        userEmbed.setAuthor({name: getUser.tag, iconURL: getUser.avatarURL({extension: "png", size: 4096})});
                        if (getUser.banner) { userEmbed.setImage(getUser.bannerURL({extension: "png", size: 4096})); }
                        userEmbed.setFooter({text: "Account creation: " + dayjs().calendar(getUser.createdTimestamp) + " (" + dayjs(getUser.createdTimestamp).fromNow() + ")"});
                        await interaction.editReply({embeds: [userEmbed]});
                        break;
                    }

                    case "member": {
                        await interaction.deferReply();

                        let getMember: GuildMember|void = await interaction.guild.members.fetch({user: interaction.options.getUser("member") || interaction.user, force: true}).catch((error) => {});
                        if (!getMember) {
                            return interaction.editReply({content: "Something failed or the member doesn't exists."})
                        }

                        let memberEmbed: EmbedBuilder = new EmbedBuilder();
                        memberEmbed.setAuthor({name: getMember.nickname || getMember.user.username, iconURL: getMember.avatarURL({extension: "png", size: 4096}) || getMember.user.avatarURL({extension: "png", size: 4096})});
                        memberEmbed.setFooter({text: "Member since: " + dayjs().calendar(getMember.joinedTimestamp) + " (" + dayjs(getMember.joinedTimestamp).fromNow() + ")"});
                        await interaction.editReply({embeds: [memberEmbed]});
                        break;
                    }
                }
            }
        }
    ]
};
export default command;