declare global {
    namespace NodeJS {
        interface ProcessEnv {
            discordToken: string;
        }
    }
}
export {};