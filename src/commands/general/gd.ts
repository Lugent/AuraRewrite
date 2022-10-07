import request from "request"; // Because is the only working to talk with robtop's servers
import { ConvertToGJSearch, GJLevelSearch } from "../../structures/GD";
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
                let endpoint_url = "http://www.boomlings.com/database/";
                let searchData = {gameVersion: "21", binaryVersion: "35", secret: "Wmfd2893gb7", type: 0, page: "0", count: 10};
                request.post(endpoint_url + "getGJLevels21.php", {form: searchData, headers: {}}, function(error, response, body) {
                    if (error)
                    {
                        console.log(error);
                    }
                    else {
                        let level: GJLevelSearch = ConvertToGJSearch(body);
                        for (let i = 0; i < level.levels.length; i++)
                        {
                            console.log(level.levels[i].name);
                            console.log(level.levels[i].author);
                            console.log(level.levels[i].song);
                            console.log("");
                        }
                    }
                });
            }
        }
    ]
}
export default command;