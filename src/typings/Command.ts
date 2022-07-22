import { ApplicationCommandData, ButtonInteraction, ChatInputCommandInteraction, SelectMenuInteraction } from "discord.js";
import { AuraClient } from "../structures/Client";

interface CommandRunOptions {client: AuraClient, interaction: ChatInputCommandInteraction}
interface ButtonRunOptions {client: AuraClient, interaction: ButtonInteraction}
interface SelectMenuRunOptions {client: AuraClient, interaction: SelectMenuInteraction}

type CommandExecuteFunction = (options: CommandRunOptions) => any;
type ButtonExecuteFunction = (options: ButtonRunOptions) => any;
type SelectMenuExecuteFunction = (options: SelectMenuRunOptions) => any;

export type CommandStructureApplications = { format: ApplicationCommandData; execute: CommandExecuteFunction; }
export type CommandStructureButtons = { name: string; execute: ButtonExecuteFunction; }
export type CommandStructureSelectMenus = { name: string, execute: SelectMenuExecuteFunction; }

export type CommandStructure = {
    id: string;
    applications?: CommandStructureApplications[];
    buttons?: CommandStructureButtons[];
    select_menus?: CommandStructureSelectMenus[];
}