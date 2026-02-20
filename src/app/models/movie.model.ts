import { Genre } from "./genre.model"

export interface Movie {
    adult: boolean,
    backdrop_path: string,
    genre_ids: number[],
    genres?: Genre[],
    id: number,
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: string,
    release_date: string,
    title: string,
    video: boolean,
    vote_average: number,
    vote_count: number,
    images?: ImageResponse,
    credits?: CreditResponse,
    similar?: MovieResponse,
    reviews?: ReviewResponse,
    isFavorite?: boolean
}

export interface MovieResponse {
    page: number,
    results: Movie[],
    total_pages: number,
    total_results: number
}

export interface ImageResponse {
    backdrops: Image[],
    posters: Image[]
}

export interface Image {
    aspect_ratio: number,
    file_path: string,
    height: number,
    iso_639_1: string | null,
    vote_average: number,
    vote_count: number,
    width: number
}

export interface CreditResponse {
    id: number,
    cast: CastMember[]
}

export interface CastMember {
    adult: boolean,
    gender: number,
    id: number,
    known_for_department: string,
    name: string,
    original_name: string,
    popularity: number,
    profile_path: string | null,
    cast_id: number,
    character: string,
    credit_id: string,
    order: number
}

export interface ReviewResponse {
    id: number,
    page: number,
    results: Review[],
    total_pages: number,
    total_results: number
}

export interface Review {
    author: string,
    author_details: {
        name: string,
        username: string,
        avatar_path: string | null,
        rating: number
    },
    content: string,
    created_at: string,
    id: string,
    updated_at: string,
    url: string
}