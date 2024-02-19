export interface Movie {
    id: number;
    poster_path: string;
    title: string;
    vote_average: number;
}

export interface MovieDetails {
    poster_path: string;
    title: string;
    backdrop_path: string;
    release_date: string;
    genres: string[];
    overview: string;
    production: string[][];
    runtime: number;
}

export interface Actor {
    name: string;
    profile_path: string | null;
    character: string;
}
