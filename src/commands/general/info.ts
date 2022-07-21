import { CommandStructure } from "../../typings/Command";

const command: CommandStructure = {
    id: "information",
    applications: [
        {
            format: {
                name: "info",
                description: "Information command"
            },

            async execute({client, interaction}) {
                
            }
        }
    ]
};
export default command;