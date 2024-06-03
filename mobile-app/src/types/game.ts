export interface GameBase {
    name: string;
}

export type GamesBaseList = GameBase[];

export interface Game extends GameBase {
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
