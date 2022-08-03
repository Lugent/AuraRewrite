let versionTable = {1: "1.0", 2: "1.1", 3: "1.2", 4: "1.3", 5: "1.4", 6: "1.5", 7: "1.6", 10: "1.7", 11: "1.8"}
let lenghtTable = ["Tiny", "Short", "Medium", "Large", "Extra-Long"];
let difficultyTable = {0: "NA", 10: "Easy", 20: "Normal", 30: "Hard", 40: "Harder", 50: "Insane"};
let demonDifficultyTable = {3: "Easy", 4: "Medium", 5: "Insane", 6: "Extreme"};
let orbsTable = [0, 0, 50, 75, 125, 175, 225, 275, 350, 425, 500];
let officalSongsTable = [
    ["Stay Inside Me", "OcularNebula"],
    ["Stereo Madness", "ForeverBound"],
    ["Back on Track", "DJVI"],
    ["Polargeist", "Step"],
    ["Dry Out", "DJVI"],
    ["Base After Base", "DJVI"],
    ["Can't Let Go", "DJVI"],
    ["Jumper", "Waterflame"],
    ["Time Machine", "Waterflame"],
    ["Cycles", "DJVI"],
    ["xStep", "DJVI"],
    ["Clutterfunk", "Waterflame"],
    ["Theory of Everything", "DJ-Nate"],
    ["Electroman Adventures", "Waterflame"],
    ["Clubstep", "DJ-Nate"],
    ["Electrodynamix", "DJ-Nate"],
    ["Hexagon Force", "Waterflame"],
    ["Blast Processing", "Waterflame"],
    ["Theory of Everything 2", "DJ-Nate"],
    ["Geometrical Dominator", "Waterflame"],
    ["Deadlocked", "F-777"],
    ["Fingerdash", "MDK"],
    ["The Seven Seas", "F-777"],
    ["Viking Arena", "F-777"],
    ["Airborne Robots", "F-777"],
    ["The Challenge", "RobTop"],
    ["Payload", "Dex Arson"],
    ["Beast Mode", "Dex Arson"],
    ["Machina", "Dex Arson"],
    ["Years", "Dex Arson"],
    ["Frontlines", "Dex Arson"],
    ["Space Pirates", "Waterflame"],
    ["Striker", "Waterflame"],
    ["Embers", "Dex Arson"],
    ["Round 1", "Dex Arson"],
    ["Monster Dance Off", "F-777"],
    ["Press Start", "MDK"],
    ["Nock Em", "Bossfight"],
    ["Power Trip", "Boom Kitty"]
];

export enum GJLevelValues {
    LevelID = 1,
    LevelName = 2,
    Description = 3,
    LevelString = 4,
    Version = 5,
    PlayerID = 6,
    DifficultyDominator = 8,
    DifficultyNumerator = 9,
    Downloads = 10,
    SetCompletes = 11,
    OfficialSong = 12,
    GameVersion = 13,
    Likes = 14,
    Length = 15,
    Dislikes = 16,
    Demon = 17,
    Stars = 18,
    FeatureScore = 19,
    Auto = 25,
    RecordString = 26,
    Password = 27,
    UploadDate = 28,
    UpdateDate = 29,
    CopiedID = 30,
    TwoPlayer = 31,
    CustomSongID = 35,
    ExtraString = 36,
    Coins = 37,
    VerifiedCouns = 38,
    StarsRequested = 39,
    LowDetailMode = 40,
    DailyNumber = 41,
    Epic = 42,
    DemonDifficulty = 43,
    IsGaunlet = 44,
    Object = 45,
    EditorTime = 46,
    EditorTimeInCopies = 47,
    SettingString = 48
}

export enum GJLevelAuthorValues {
    PlayerID = 0,
    Username = 1,
    AccountID = 2
}

export enum GJLevelSongValues {
    ID = 1,
    Name = 2,
    ArtistID = 3,
    ArtistName = 4,
    Size = 5,
    VideoID = 6,
    YoutubeURL = 7,
    IsVerified = 8,
    SongPriority = 9,
    Link = 10
}

export enum GJLevelSearchValues {
    MaxPage = 0,
    CurrentPage = 1,
    ListCount = 2
}

export class GJLevelAuthor {
    constructor(level: string[], data: string[]) {
        this.playerID = Number(data[GJLevelAuthorValues.PlayerID] || level[GJLevelValues.PlayerID]);
        this.username = data[GJLevelAuthorValues.Username] || "-";
        this.accountID = Number(data[GJLevelAuthorValues.AccountID]) || 0;
    }
    public playerID: number;
    public username: string;
    public accountID: number;
}

export class GJLevelSong {
    constructor(level: string[], data: string[]) {
		if (Number(level[GJLevelValues.CustomSongID]) > 0) {
			this.id = Number(data[GJLevelSongValues.ID] || level[GJLevelValues.CustomSongID]);
			this.name = data[GJLevelSongValues.Name] || "Unknown";
			this.artist = data[GJLevelSongValues.ArtistName] || "Unknown";
			this.size = (data[GJLevelSongValues.Size] || "0") + "MB";
			this.link = data[GJLevelSongValues.Link] ? decodeURIComponent(data[GJLevelSongValues.Link]) : null;
		}
		else {
			this.id = -1;
			this.name = officalSongsTable[level[GJLevelValues.OfficialSong]][0] || "Unknown";
			this.artist = officalSongsTable[level[GJLevelValues.OfficialSong]][1] || "Unknown";
			this.size = "0MB";
			this.link = null;
		}
	}
    public id: number;
    public name: string;
    public artist: string;
    public size: string;
    public link: string;
}

export class GJLevel {
	constructor(data: string[], author: string[], song: string[]) {
		this.id = Number(data[1]);
		this.name = data[2];
		this.description = Buffer.from(data[3] || "", "base64").toString() || null;
		this.author = new GJLevelAuthor(data, author);
		this.song = new GJLevelSong(data, song);
		this.version = Number(data[5]);
		this.downloads = Number(data[10]);
		this.gameVersion = (Number(data[13]) > 17) ? String((Number(data[13]) / 10).toFixed(1)) : versionTable[data[13]];
		this.likes = Number(data[14]);
		this.length = lenghtTable[data[15]];
		this.stars = Number(data[18]);
		this.orbs = orbsTable[this.stars];
		this.featured = (Number(data[19]) > 0);
		this.featuredScore = (Number(this.featured) > 0) ? Number(data[19]) : -1;
		this.copiedID = (Number(data[30]) > 0) ? Number(data[30]) : -1;
		this.twoPlayer = (Number(data[31]) > 0);
		this.coins = Number(data[37]);
		this.verifiedCoins = (Number(data[38]) > 0);
		this.starsRequested = Number(data[39]);
		this.epic = (Number(data[42]) > 0);
		this.objects = Number(data[45]);
		this.large = (this.objects > 40000);
		this.difficulty = (Number(data[25]) > 0) ? "Auto" : ((Number(data[17]) > 0) ? (demonDifficultyTable[data[43]] || "Hard") + " Demon" : difficultyTable[data[9]]);
	}
    public id: number;
    public name: string;
    public description: string;
    public author: GJLevelAuthor;
    public song: GJLevelSong;
    public version: number;
    public downloads: number;
    public gameVersion: number;
    public likes: number;
    public length: string;
    public stars: number;
    public orbs: number;
    public featured: boolean;
    public featuredScore: number;
    public copiedID: number;
    public twoPlayer: boolean;
    public coins: number;
    public verifiedCoins: boolean;
    public starsRequested: number;
    public epic: boolean;
    public objects: number;
    public large: boolean;
    public difficulty: string;
}

export class GJLevelSearch {
	constructor(levels_data: string[][], authors_data: string[][], songs_data: string[][], pages_data: string[]) {
		this.currentPage = Number(pages_data[GJLevelSearchValues.CurrentPage]);
		this.maxPage = Number(pages_data[GJLevelSearchValues.MaxPage]);
		this.listCount = Number(pages_data[GJLevelSearchValues.ListCount]);
		this.levels = [];
		for (let k = 0; k < levels_data.length; k++) {
			let level_author: string[] = [];
            for (let i = 0; i < authors_data.length; i++) {
                if (!authors_data[i]) { continue; }
                if (authors_data[i][GJLevelAuthorValues.PlayerID] == levels_data[k][GJLevelValues.PlayerID]) {
                    level_author = authors_data[i];
                }
            }

			let level_song: string[] = [];
            for (let j = 0; j < songs_data.length; j++) {
                if (!songs_data[j]) { continue; }
                if (songs_data[j][GJLevelSongValues.ID] == levels_data[k][GJLevelValues.CustomSongID]) {
                    level_song = songs_data[j];
                }
            }
			this.levels[k] = new GJLevel(levels_data[k], level_author, level_song);
		}
	}
    public currentPage: number;
    public maxPage: number;
    public listCount: number;
    public levels: GJLevel[];
}

export function ConvertToGJSearch(data: string): GJLevelSearch {
    let raw_data = data.split("#");
	let raw_levels_array = raw_data[0].split("|");
	let raw_authors_array = raw_data[1].split("|");
	let raw_songs_array = raw_data[2].split("~:~");
	let raw_page_array = raw_data[3].split(":");

	let songs_array: string[][] = [];
	for (let j = 0; j < raw_songs_array.length; j += 1)
	{
		let song_array: string[] = [];
		let raw_song_array = raw_songs_array[j].split("~|~");
		for (let i = 0; i < raw_song_array.length; i += 2) { song_array[raw_song_array[i]] = raw_song_array[i + 1]; }
		songs_array[j] = song_array;
	}
	
	let authors_array: string[][] = [];
	for (let j = 1; j < raw_authors_array.length; j += 1)
	{
		let raw_author_array = raw_authors_array[j].split("|")[0].split(":");
		authors_array[j] = raw_author_array;
	}

	let levels_array: string[][] = [];
	for (let j = 0; j < raw_levels_array.length; j += 1)
	{
		let level_array: string[] = [];
		let raw_level_array = raw_levels_array[j].split(":");
		for (let i = 0; i < raw_level_array.length; i += 2) { level_array[raw_level_array[i]] = raw_level_array[i + 1]; }
		levels_array[j] = level_array;
	}
    return new GJLevelSearch(levels_array, authors_array, songs_array, raw_page_array);
}