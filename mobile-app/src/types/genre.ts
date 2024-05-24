export interface Genre {
    name: string;
    description?: string;
}

export type GenreList = Genre[];

export interface GenreSearchCriteria {
    names?: string[];
    limit?: number;
    offset?: number;
}
