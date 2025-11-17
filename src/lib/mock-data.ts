
import type { Post, User, Message, Comment, CommentReply, CommentLike, Like, Notification } from './types';
import {faker} from '@faker-js/faker';

const createMockUser = (email: string, username: string, avatar?: string): User => ({
    id: faker.string.uuid(),
    username,
    full_name: username,
    email,
    password: 'password123',
    age: faker.number.int({ min: 18, max: 60 }),
    gender: faker.helpers.arrayElement(['uomo', 'donna', 'altro']),
    city: faker.location.city(),
    country: 'Italia',
    region: faker.location.state(),
    bio: faker.lorem.sentence(),
    avatar: avatar,
    likeBalance: faker.number.int({ min: 5, max: 100 }),
    totalLikesReceived: faker.number.int({ min: 100, max: 5000 }),
    walletBalance: faker.number.float({ min: 10, max: 1000, multipleOf: 0.01 }),
    totalLikesSent: faker.number.int({min: 50, max: 2000}),
    referralCode: faker.string.alphanumeric(8),
    createdAt: faker.date.past().toISOString(),
    accountStatus: 'active'
});

export const mockUsers: User[] = [
    createMockUser('mario.rossi@email.com', 'Mario Rossi', 'https://picsum.photos/seed/mario/200/200'),
    createMockUser('anna.verdi@email.com', 'Anna Verdi', 'https://picsum.photos/seed/anna/200/200'),
    createMockUser('luca.bianchi@email.com', 'Luca Bianchi', 'https://picsum.photos/seed/luca/200/200'),
    createMockUser('user@test.com', 'Test User'),
];

export const mockPosts: Post[] = [
    {
        id: 'post-1',
        userId: mockUsers.find(u => u.email === 'mario.rossi@email.com')!.id,
        created_by: 'mario.rossi@email.com',
        owner_id: mockUsers.find(u => u.email === 'mario.rossi@email.com')!.id,
        created_date: faker.date.recent({ days: 1 }).toISOString(),
        media_type: 'image',
        media_url: 'https://picsum.photos/seed/galaxy/800/600',
        description: 'Guardando le stelle stasera! ✨🌌 #spazio #stelle',
        likes: faker.number.int({ min: 50, max: 500 }),
        likes_count: faker.number.int({ min: 50, max: 500 }),
        earnings: faker.number.float({ min: 0.5, max: 5, multipleOf: 0.01 }),
        imageUrl: 'https://picsum.photos/seed/galaxy/800/600',
        createdAt: faker.date.recent({ days: 1 }).toISOString(),
    },
    {
        id: 'post-2',
        userId: mockUsers.find(u => u.email === 'anna.verdi@email.com')!.id,
        created_by: 'anna.verdi@email.com',
        owner_id: mockUsers.find(u => u.email === 'anna.verdi@email.com')!.id,
        created_date: faker.date.recent({ days: 2 }).toISOString(),
        media_type: 'image',
        media_url: 'https://picsum.photos/seed/book/800/600',
        description: 'Oggi ho letto un libro fantastico. "Il nome della rosa" di Umberto Eco. Qual è il vostro libro preferito?',
        likes: faker.number.int({ min: 20, max: 150 }),
        likes_count: faker.number.int({ min: 20, max: 150 }),
        earnings: faker.number.float({ min: 0.2, max: 1.5, multipleOf: 0.01 }),
        imageUrl: 'https://picsum.photos/seed/book/800/600',
        createdAt: faker.date.recent({ days: 2 }).toISOString(),
    },
];

export const mockMessages: Message[] = [
    {
        id: faker.string.uuid(),
        from_user_email: 'mario.rossi@email.com',
        to_user_email: 'user@test.com',
        message: 'Ciao! Come stai?',
        created_date: faker.date.recent({ days: 1 }).toISOString(),
        read: false,
    },
];

export const mockComments: Comment[] = [];
export const mockCommentReplies: CommentReply[] = [];
export const mockCommentLikes: CommentLike[] = [];
export const mockLikes: Like[] = [];
export const mockNotifications: Notification[] = [];
