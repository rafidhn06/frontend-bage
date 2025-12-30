export interface User {
    id: number;
    name: string;
    username: string;
    profile_picture: string | null;
    is_followed: boolean;
}

export interface Location {
    id: number;
    name: string;
}

export interface Comment {
    username: string;
    content: string;
}

export interface Media {
    type: string;
    url: string;
}

export interface Post {
    id: number;
    content: string;
    rating: number;
    total_likes: number;
    total_comments: number;
    is_liked: boolean;
    latest_comments: Comment[];
    media: Media[];
    created_at: string;
    is_mine: boolean;
    user: User;
    location: Location | null;
}
