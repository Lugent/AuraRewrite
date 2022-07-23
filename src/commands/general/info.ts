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
                        
                        let get_user: User|void = await client.users.fetch(interaction.options.getString("id") || interaction.user, {force: true}).catch((error) => {});
                        if (!get_user) {
                            return interaction.editReply({content: "Something failed or the user doesn't exists."})
                        }

                        let user_embed: EmbedBuilder = new EmbedBuilder();
                        user_embed.setColor(get_user.accentColor);
                        user_embed.setAuthor({name: get_user.tag, iconURL: get_user.avatarURL({extension: "png", size: 4096})});
                        if (get_user.banner) { user_embed.setImage(get_user.bannerURL({extension: "png", size: 4096})); }
                        user_embed.setFooter({text: "Account creation: " + dayjs().calendar(get_user.createdTimestamp) + " (" + dayjs(get_user.createdTimestamp).fromNow() + ")"});
                        await interaction.editReply({embeds: [user_embed]});
                        break;
                    }

                    case "member": {
                        await interaction.deferReply();

                        let get_member: GuildMember|void = await interaction.guild.members.fetch({user: interaction.options.getUser("member") || interaction.user, force: true}).catch((error) => {});
                        if (!get_member) {
                            return interaction.editReply({content: "Something failed or the member doesn't exists."})
                        }

                        let member_embed: EmbedBuilder = new EmbedBuilder();
                        member_embed.setAuthor({name: get_member.nickname || get_member.user.username, iconURL: get_member.avatarURL({extension: "png", size: 4096}) || get_member.user.avatarURL({extension: "png", size: 4096})});
                        member_embed.setFooter({text: "Member since: " + dayjs().calendar(get_member.joinedTimestamp) + " (" + dayjs(get_member.joinedTimestamp).fromNow() + ")"});
                        await interaction.editReply({embeds: [member_embed]});
                        break;
                    }
                }
            }
        }
    ]
};
export default command;