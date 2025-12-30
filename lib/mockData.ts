import { Post } from '@/types';

export const mockPost: Post = {
    id: 1,
    content: 'Lorem ipsum dolor sit amet consectur',
    rating: 4,
    total_likes: 62,
    total_comments: 1283,
    is_liked: false,
    latest_comments: [],
    media: [
        { type: 'image', url: '/picsum_random_1.jpg' },
        { type: 'image', url: '/picsum_random_2.jpg' },
        { type: 'image', url: '/picsum_random_3.jpg' },
        { type: 'image', url: '/picsum_random_4.jpg' },
    ],
    created_at: new Date().toISOString(),
    is_mine: false,
    user: {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        profile_picture_url: 'https://github.com/shadcn.png',
        is_followed: false,
    },
    location: {
        id: 1,
        name: 'Kebun Raya Bogor',
    },
};
