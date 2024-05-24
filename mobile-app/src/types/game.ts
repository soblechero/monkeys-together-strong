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
    genres?: string[];
    names?: string[];
    platforms?: string[];
    releaseYears?: number[];
    limit?: number;
    offset?: number;
}
