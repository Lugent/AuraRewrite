import { CommandStructure } from "../../typings/Command";

let command: CommandStructure = {
    id: "gd",
    applications: [
        {
            format: {
                name: "gd",
                description: "Geometry Dash"
            },

            async execute({client, interaction}) {
                
            }
        }
    ]
}
export default command;