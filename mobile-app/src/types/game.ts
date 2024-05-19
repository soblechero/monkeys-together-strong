export interface Game {
    name: string;
    genres: string[];
    thumb: string;
    artwork: string;
    howlongtobeat: number; // Cambiado a number
    rating: number;
    release_date: Date; // Cambiado a Date
    summary: string;
    platforms: string[];
}

export type GamesList = Game[];
