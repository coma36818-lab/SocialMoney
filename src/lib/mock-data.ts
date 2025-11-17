import type { Post, User, Message, Comment, CommentReply, CommentLike, Like, Notification } from './types';
import {faker} from '@faker-js/faker';

const createMockUser = (email: string, nickname: string, avatar?: string): User => ({
    id: faker.string.uuid(),
    nickname,
    full_name: nickname,
    email,
    password: 'password123',
    age: faker.number.int({ min: 18, max: 60 }),
    gender: faker.helpers.arrayElement(['uomo', 'donna', 'altro']),
    city: faker.location.city(),
    country: 'Italia',
    region: faker.location.state(),
    bio: faker.lorem.sentence(),
    avatar: avatar,
    likes_available: faker.number.int({ min: 5, max: 100 }),
    likes_received: faker.number.int({ min: 100, max: 5000 }),
    likes_sent: faker.number.int({min: 50, max: 2000}),
    balance: faker.number.float({ min: 10, max: 1000, multipleOf: 0.01 }),
    total_earnings: faker.number.float({ min: 100, max: 10000, multipleOf: 0.01 }),
    referral_code: faker.string.alphanumeric(8),
    created_date: faker.date.past().toISOString(),
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
        created_by: 'mario.rossi@email.com',
        owner_id: mockUsers.find(u => u.email === 'mario.rossi@email.com')!.id,
        created_date: faker.date.recent({ days: 1 }).toISOString(),
        media_type: 'image',
        media_url: 'https://picsum.photos/seed/galaxy/800/600',
        description: 'Guardando le stelle stasera! ✨🌌 #spazio #stelle',
        likes_count: faker.number.int({ min: 50, max: 500 }),
        earnings: faker.number.float({ min: 0.5, max: 5, multipleOf: 0.01 }),
    },
    {
        id: 'post-2',
        created_by: 'anna.verdi@email.com',
        owner_id: mockUsers.find(u => u.email === 'anna.verdi@email.com')!.id,
        created_date: faker.date.recent({ days: 2 }).toISOString(),
        media_type: 'image',
        media_url: 'https://picsum.photos/seed/book/800/600',
        description: 'Oggi ho letto un libro fantastico. "Il nome della rosa" di Umberto Eco. Qual è il vostro libro preferito?',
        likes_count: faker.number.int({ min: 20, max: 150 }),
        earnings: faker.number.float({ min: 0.2, max: 1.5, multipleOf: 0.01 }),
    },
    {
        id: 'post-3',
        created_by: 'luca.bianchi@email.com',
        owner_id: mockUsers.find(u => u.email === 'luca.bianchi@email.com')!.id,
        created_date: faker.date.recent({ days: 3 }).toISOString(),
        media_type: 'image',
        media_url: 'https://picsum.photos/seed/pasta/800/1000',
        description: 'Carbonara perfetta! 🍝 Chi ne vuole un po\'? #ciboitaliano #pasta',
        likes_count: faker.number.int({ min: 100, max: 800 }),
        earnings: faker.number.float({ min: 1, max: 8, multipleOf: 0.01 }),
    },
    {
        id: 'post-4',
        created_by: 'mario.rossi@email.com',
        owner_id: mockUsers.find(u => u.email === 'mario.rossi@email.com')!.id,
        created_date: faker.date.recent({ days: 5 }).toISOString(),
        media_type: 'video',
        media_url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
        description: 'Un piccolo clip dalla mia ultima vacanza al mare. 🌊☀️',
        likes_count: faker.number.int({ min: 80, max: 400 }),
        earnings: faker.number.float({ min: 0.8, max: 4, multipleOf: 0.01 }),
    }
];

// Add some posts for the test user
for (let i = 0; i < 6; i++) {
    mockPosts.push({
        id: faker.string.uuid(),
        created_by: 'user@test.com',
        owner_id: mockUsers.find(u => u.email === 'user@test.com')!.id,
        created_date: faker.date.recent({ days: i + 1 }).toISOString(),
        media_type: 'image',
        media_url: `https://picsum.photos/seed/test${i}/800/800`,
        description: faker.lorem.paragraph(),
        likes_count: faker.number.int({ min: 10, max: 100 }),
        earnings: faker.number.float({ min: 0.1, max: 1, multipleOf: 0.01 }),
    });
}

export const mockMessages: Message[] = [
    {
        id: faker.string.uuid(),
        from_user_email: 'mario.rossi@email.com',
        to_user_email: 'user@test.com',
        message: 'Ciao! Come stai?',
        created_date: faker.date.recent({ days: 1 }).toISOString(),
        read: false,
    },
    {
        id: faker.string.uuid(),
        from_user_email: 'user@test.com',
        to_user_email: 'mario.rossi@email.com',
        message: 'Tutto bene, grazie! E tu?',
        created_date: faker.date.recent({ days: 1, refDate: new Date(Date.now() + 1000 * 60) }).toISOString(),
        read: false,
    },
    {
        id: faker.string.uuid(),
        from_user_email: 'anna.verdi@email.com',
        to_user_email: 'user@test.com',
        message: 'Ho visto il tuo ultimo post, bellissimo!',
        created_date: faker.date.recent({ days: 2 }).toISOString(),
        read: true,
    }
];

export const mockComments: Comment[] = [
    {
        id: 'comment-1',
        post_id: 'post-1',
        user_email: 'anna.verdi@email.com',
        user_name: 'Anna Verdi',
        comment_text: 'Che vista spettacolare!',
        created_date: faker.date.recent({ days: 1 }).toISOString(),
    }
];
export const mockCommentReplies: CommentReply[] = [];
export const mockCommentLikes: CommentLike[] = [];

export const mockLikes: Like[] = [
    {
        id: faker.string.uuid(),
        post_id: 'post-1',
        post_owner_email: 'mario.rossi@email.com',
        like_value: 0.01,
        created_by: 'anna.verdi@email.com',
    },
    {
        id: faker.string.uuid(),
        post_id: 'post-1',
        post_owner_email: 'mario.rossi@email.com',
        like_value: 0.01,
        created_by: 'luca.bianchi@email.com',
    }
];

export const mockNotifications: Notification[] = [
    {
        id: faker.string.uuid(),
        created_by: 'user@test.com',
        message: 'Anna Verdi ha messo like al tuo post.',
        type: 'like',
        read: false,
        created_date: faker.date.recent({days: 1}).toISOString()
    },
     {
        id: faker.string.uuid(),
        created_by: 'user@test.com',
        message: 'Hai guadagnato 0.50€ dal tuo ultimo post.',
        type: 'earning',
        read: false,
        created_date: faker.date.recent({days: 2}).toISOString()
    },
    {
        id: faker.string.uuid(),
        created_by: 'user@test.com',
        message: 'Luca Bianchi ha iniziato a seguirti.',
        type: 'follow',
        read: true,
        created_date: faker.date.recent({days: 3}).toISOString()
    }
];
