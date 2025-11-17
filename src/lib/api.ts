'use client';
import { mockPosts, mockUsers } from './mock-data';
import type { Like, Notification, Post, Transaction, User } from './types';
import { faker } from '@faker-js/faker';

const CURRENT_USER_KEY = 'connect_now_user';
const USERS_KEY = 'connect_now_users';
const POSTS_KEY = 'connect_now_posts';
const TRANSACTIONS_KEY = 'connect_now_transactions';

const initializeData = <T>(key: string, initialData: T): T => {
  try {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem(key);
      if (!storedData) {
        localStorage.setItem(key, JSON.stringify(initialData));
        return initialData;
      }
      return JSON.parse(storedData) as T;
    }
  } catch (error) {
    console.error(`Error initializing data for key ${key}:`, error);
  }
  return initialData;
};

let users: User[] = initializeData(USERS_KEY, mockUsers);
let posts: Post[] = initializeData(POSTS_KEY, mockPosts);
let transactions: Transaction[] = initializeData(TRANSACTIONS_KEY, []);

const saveData = <T>(key: string, data: T) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
};

export const base44 = {
  auth: {
    me: async (): Promise<User> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (typeof window === 'undefined') return reject(new Error('Server-side call'));
          const userEmail = localStorage.getItem(CURRENT_USER_KEY);
          if (userEmail) {
            const user = users.find(u => u.email === userEmail);
            if (user) {
              resolve(user);
            } else {
              localStorage.removeItem(CURRENT_USER_KEY);
              reject(new Error('User not found'));
            }
          } else {
            reject(new Error('Not authenticated'));
          }
        }, 500);
      });
    },
    login: async (email: string, password_unused: string): Promise<User> => {
        const user = users.find(u => u.email === email);
        if (user) {
            if (typeof window !== 'undefined') {
                localStorage.setItem(CURRENT_USER_KEY, user.email);
            }
            return user;
        }
        throw new Error('Invalid credentials');
    },
    signup: async (data: Omit<User, 'id' | 'full_name' | 'likes_available' | 'likes_received' | 'balance' | 'total_earnings'>): Promise<User> => {
        if(users.some(u => u.email === data.email)) {
            throw new Error('User already exists');
        }
        const newUser: User = {
            ...data,
            id: faker.string.uuid(),
            full_name: data.nickname,
            likes_available: 20,
            likes_received: 0,
            balance: 0,
            total_earnings: 0,
        };
        users.push(newUser);
        saveData(USERS_KEY, users);
        if (typeof window !== 'undefined') {
            localStorage.setItem(CURRENT_USER_KEY, newUser.email);
        }
        return newUser;
    },
    logout: async () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(CURRENT_USER_KEY);
        }
    },
    updateMe: async (updates: Partial<User>): Promise<User> => {
        const userEmail = localStorage.getItem(CURRENT_USER_KEY);
        if(!userEmail) throw new Error('Not authenticated');
        let user = users.find(u => u.email === userEmail);
        if (!user) throw new Error('User not found');
        
        user = { ...user, ...updates };
        users = users.map(u => u.email === userEmail ? user! : u);
        saveData(USERS_KEY, users);
        return user;
    },
    redirectToLogin: (url: string) => {
        // This is a mock. In a real app, you'd use the router.
        // The calling component will handle redirection.
        console.log(`Redirecting to login, return to: ${url}`);
        // In components, this will be replaced with `router.push('/login')`
    }
  },
  entities: {
    Post: {
      list: async (sort: string, limit?: number): Promise<Post[]> => {
        let sortedPosts = [...posts];
        if (sort === '-created_date') {
          sortedPosts.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
        }
        return limit ? sortedPosts.slice(0, limit) : sortedPosts;
      },
      filter: async (filter: Partial<Post>, sort: string): Promise<Post[]> => {
        let filteredPosts = posts.filter(p => Object.entries(filter).every(([key, value]) => p[key as keyof Post] === value));
        if (sort === '-created_date') {
          filteredPosts.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
        }
        return filteredPosts;
      },
      create: async (data: Omit<Post, 'id' | 'owner_id' | 'likes_count' | 'earnings'>): Promise<Post> => {
        const owner = users.find(u => u.email === data.created_by);
        if (!owner) throw new Error('Owner not found');
        
        const newPost: Post = {
          ...data,
          id: faker.string.uuid(),
          owner_id: owner.id,
          likes_count: 0,
          earnings: 0,
        };
        posts.unshift(newPost);
        saveData(POSTS_KEY, posts);
        return newPost;
      },
      update: async (postId: string, updates: Partial<Post>): Promise<Post> => {
        let post = posts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');

        post = { ...post, ...updates };
        posts = posts.map(p => p.id === postId ? post! : p);
        saveData(POSTS_KEY, posts);
        return post;
      },
      delete: async (postId: string): Promise<void> => {
        posts = posts.filter(p => p.id !== postId);
        saveData(POSTS_KEY, posts);
      },
    },
    User: {
      filter: async (filter: Partial<User>): Promise<User[]> => {
        return users.filter(u => Object.entries(filter).every(([key, value]) => u[key as keyof User] === value));
      },
      update: async (userId: string, updates: Partial<User>): Promise<User> => {
        let user = users.find(u => u.id === userId);
        if (!user) throw new Error('User not found');
        
        user = { ...user, ...updates };
        users = users.map(u => u.id === userId ? user! : u);
        saveData(USERS_KEY, users);
        return user;
      },
    },
    Like: {
      create: async (data: Omit<Like, 'id' | 'created_by'>): Promise<Like> => {
        const userEmail = localStorage.getItem(CURRENT_USER_KEY);
        if(!userEmail) throw new Error('Not authenticated');

        const newLike: Like = {
            ...data,
            id: faker.string.uuid(),
            created_by: userEmail
        };
        // In a real app, we would save this. Here we just return it.
        return newLike;
      },
    },
    Transaction: {
      list: async (sort: string, limit: number): Promise<Transaction[]> => {
        const userEmail = localStorage.getItem(CURRENT_USER_KEY);
        if(!userEmail) throw new Error('Not authenticated');
        const user = users.find(u => u.email === userEmail);
        if(!user) throw new Error('User not found');
        
        let userTransactions = transactions.filter(t => t.user_id === user.id);
        if (sort === '-created_date') {
          userTransactions.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
        }
        return userTransactions.slice(0, limit);
      },
      create: async (data: Omit<Transaction, 'id'| 'created_date'>): Promise<Transaction> => {
        const newTransaction: Transaction = {
          ...data,
          id: faker.string.uuid(),
          created_date: new Date().toISOString(),
        };
        transactions.unshift(newTransaction);
        saveData(TRANSACTIONS_KEY, transactions);
        return newTransaction;
      },
    },
    Notification: {
      create: async (data: any): Promise<Notification> => {
        console.log("Notification created:", data.message);
        // Mock notification creation
        const newNotification: Notification = {
          id: faker.string.uuid(),
          user_id: data.created_by,
          created_by_name: data.message.split(' ')[0],
          type: 'like',
          message: data.message,
          created_date: new Date().toISOString(),
          is_read: false
        }
        return newNotification;
      },
    },
  },
};
