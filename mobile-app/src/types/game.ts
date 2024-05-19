export interface Game {
    name: string;
    genres: string[];
    thumb: string;
    artwork: string;
    howLongToBeat: number;
    rating: number;
    releaseDate: Date;
    summary: string;
    platforms: string[];
}

export type GamesList = Game[];

export interface GameSearchCriteria {
    genre?: string;
    name?: string;
    releaseDate?: Date;
    platform?: string;
}
