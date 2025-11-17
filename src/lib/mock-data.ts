import type { Post, User } from './types';
import {faker} from '@faker-js/faker';

const createMockUser = (email: string, nickname: string): User => ({
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
    likes_available: faker.number.int({ min: 5, max: 100 }),
    likes_received: faker.number.int({ min: 100, max: 5000 }),
    balance: faker.number.float({ min: 10, max: 1000, precision: 0.01 }),
    total_earnings: faker.number.float({ min: 100, max: 10000, precision: 0.01 }),
});

export const mockUsers: User[] = [
    createMockUser('mario.rossi@email.com', 'Mario Rossi'),
    createMockUser('anna.verdi@email.com', 'Anna Verdi'),
    createMockUser('luca.bianchi@email.com', 'Luca Bianchi'),
    createMockUser('user@test.com', 'Test User'),
];

export const mockPosts: Post[] = [
    {
        id: faker.string.uuid(),
        created_by: 'mario.rossi@email.com',
        owner_id: mockUsers.find(u => u.email === 'mario.rossi@email.com')!.id,
        created_date: faker.date.recent({ days: 1 }).toISOString(),
        media_type: 'image',
        media_url: 'https://picsum.photos/seed/galaxy/800/600',
        description: 'Guardando le stelle stasera! ✨🌌 #spazio #stelle',
        likes_count: faker.number.int({ min: 50, max: 500 }),
        earnings: faker.number.float({ min: 0.5, max: 5, precision: 0.01 }),
    },
    {
        id: faker.string.uuid(),
        created_by: 'anna.verdi@email.com',
        owner_id: mockUsers.find(u => u.email === 'anna.verdi@email.com')!.id,
        created_date: faker.date.recent({ days: 2 }).toISOString(),
        media_type: 'text',
        description: 'Oggi ho letto un libro fantastico. "Il nome della rosa" di Umberto Eco. Qual è il vostro libro preferito?',
        likes_count: faker.number.int({ min: 20, max: 150 }),
        earnings: faker.number.float({ min: 0.2, max: 1.5, precision: 0.01 }),
    },
    {
        id: faker.string.uuid(),
        created_by: 'luca.bianchi@email.com',
        owner_id: mockUsers.find(u => u.email === 'luca.bianchi@email.com')!.id,
        created_date: faker.date.recent({ days: 3 }).toISOString(),
        media_type: 'image',
        media_url: 'https://picsum.photos/seed/pasta/800/1000',
        description: 'Carbonara perfetta! 🍝 Chi ne vuole un po\'? #ciboitaliano #pasta',
        likes_count: faker.number.int({ min: 100, max: 800 }),
        earnings: faker.number.float({ min: 1, max: 8, precision: 0.01 }),
    },
    {
        id: faker.string.uuid(),
        created_by: 'mario.rossi@email.com',
        owner_id: mockUsers.find(u => u.email === 'mario.rossi@email.com')!.id,
        created_date: faker.date.recent({ days: 5 }).toISOString(),
        media_type: 'video',
        media_url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
        description: 'Un piccolo clip dalla mia ultima vacanza al mare. 🌊☀️',
        likes_count: faker.number.int({ min: 80, max: 400 }),
        earnings: faker.number.float({ min: 0.8, max: 4, precision: 0.01 }),
    }
];

// Add some posts for the test user
for (let i = 0; i < 6; i++) {
    mockPosts.push({
        id: faker.string.uuid(),
        created_by: 'user@test.com',
        owner_id: mockUsers.find(u => u.email === 'user@test.com')!.id,
        created_date: faker.date.recent({ days: i + 1 }).toISOString(),
        media_type: faker.helpers.arrayElement(['image', 'text']),
        media_url: i % 2 === 0 ? `https://picsum.photos/seed/test${i}/800/800` : undefined,
        description: faker.lorem.paragraph(),
        likes_count: faker.number.int({ min: 10, max: 100 }),
        earnings: faker.number.float({ min: 0.1, max: 1, precision: 0.01 }),
    });
}
