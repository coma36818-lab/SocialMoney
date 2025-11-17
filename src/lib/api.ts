
'use client';
import { mockPosts, mockUsers, mockMessages, mockComments, mockCommentReplies, mockCommentLikes, mockLikes, mockNotifications } from './mock-data';
import type { LikeEvent, Notification, Post, Transaction, User, Message, Comment, CommentReply, CommentLike } from './types';
import {faker} from '@faker-js/faker';

const CURRENT_USER_KEY = 'connect_now_user';
const USERS_KEY = 'connect_now_users';
const POSTS_KEY = 'connect_now_posts';
const LIKES_KEY = 'connect_now_likes';
const LIKE_EVENTS_KEY = 'connect_now_like_events';
const COMMENTS_KEY = 'connect_now_comments';
const COMMENT_REPLIES_KEY = 'connect_now_comment_replies';
const COMMENT_LIKES_KEY = 'connect_now_comment_likes';
const TRANSACTIONS_KEY = 'connect_now_transactions';
const MESSAGES_KEY = 'connect_now_messages';
const NOTIFICATIONS_KEY = 'connect_now_notifications';

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
let likeEvents: LikeEvent[] = initializeData(LIKE_EVENTS_KEY, []);
let comments: Comment[] = initializeData(COMMENTS_KEY, mockComments);
let commentReplies: CommentReply[] = initializeData(COMMENT_REPLIES_KEY, mockCommentReplies);
let commentLikes: CommentLike[] = initializeData(COMMENT_LIKES_KEY, mockCommentLikes);
let transactions: Transaction[] = initializeData(TRANSACTIONS_KEY, []);
let messages: Message[] = initializeData(MESSAGES_KEY, mockMessages);
let notifications: Notification[] = initializeData(NOTIFICATIONS_KEY, mockNotifications);
let likes: Like[] = initializeData(LIKES_KEY, mockLikes);


const saveData = <T>(key: string, data: T) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
};

const updateUser = (userId: string, updates: Partial<User>) => {
    users = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    saveData(USERS_KEY, users);
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
            if (user.accountStatus !== 'active') {
                throw new Error(`Account is currently ${user.accountStatus}. Please contact support.`);
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem(CURRENT_USER_KEY, user.email);
            }
            return user;
        }
        throw new Error('Invalid credentials');
    },
    signup: async (data: any): Promise<User> => {
        if(users.some(u => u.email === data.email)) {
            throw new Error('User already exists');
        }

        let startingLikes = 20; // Default starting likes
        
        // Referral logic
        if (data.referredBy) {
            const referrer = users.find(u => u.referralCode === data.referredBy);
            if (referrer) {
                startingLikes += 10;
                
                const updatedReferrer: User = {
                    ...referrer,
                    likeBalance: (referrer.likeBalance || 0) + 50,
                };
                users = users.map(u => u.id === referrer.id ? updatedReferrer : u);
            }
        }
        
        const newUser: User = {
            id: faker.string.uuid(),
            username: data.username,
            full_name: data.username,
            email: data.email,
            age: data.age,
            gender: data.gender,
            city: data.city,
            country: data.country,
            region: data.region,
            referredBy: data.referredBy || null,
            likeBalance: startingLikes,
            totalLikesReceived: 0,
            totalLikesSent: 0,
            walletBalance: 0,
            createdAt: new Date().toISOString(),
            created_date: new Date().toISOString(),
            referralCode: faker.string.alphanumeric(8),
            accountStatus: 'active',
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
        console.log(`Redirecting to login, return to: ${url}`);
    }
  },
  entities: {
    Post: {
      list: async (sort: string, limit?: number): Promise<Post[]> => {
        let sortedPosts = [...posts];
        if (sort === '-createdAt' || sort === '-created_date') {
          sortedPosts.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
        }
        return limit ? sortedPosts.slice(0, limit) : sortedPosts;
      },
      filter: async (filter: Partial<Post>, sort?: string): Promise<Post[]> => {
        let filteredPosts = posts.filter(p => Object.entries(filter).every(([key, value]) => p[key as keyof Post] === value));
        if (sort === '-createdAt' || sort === '-created_date') {
          filteredPosts.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
        }
        return filteredPosts;
      },
      create: async (data: any): Promise<Post> => {
        const newPost: Post = {
          ...data,
          id: faker.string.uuid(),
          likes: 0,
          likes_count: 0,
          earnings: 0,
          userId: users.find(u => u.email === data.created_by)?.id,
        };
        posts.unshift(newPost);
        saveData(POSTS_KEY, posts);
        return newPost;
      },
      update: async (postId: string, updates: Partial<Post>): Promise<Post> => {
        let post = posts.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');

        post = { ...post, ...updates, likes_count: (post.likes_count || 0) + 1 };
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
      list: async (): Promise<User[]> => {
        return users;
      },
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
    LikeEvent: {
      filter: async (filter: Partial<LikeEvent>): Promise<LikeEvent[]> => {
        return likeEvents.filter(l => Object.entries(filter).every(([key, value]) => l[key as keyof LikeEvent] === value));
      },
      create: async (data: Omit<LikeEvent, 'id' | 'timestamp'>): Promise<LikeEvent> => {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        const tenSecondsAgo = new Date(now.getTime() - 10 * 1000).toISOString();

        const fromUser = users.find(u => u.id === data.fromUser);
        if (!fromUser) throw new Error("Liker not found.");
        if (fromUser.accountStatus !== 'active') throw new Error(`Your account is ${fromUser.accountStatus}.`);

        const recentLikes = likeEvents.filter(e => e.fromUser === data.fromUser && e.timestamp > tenSecondsAgo);
        if (recentLikes.length >= 10) {
            updateUser(fromUser.id, { accountStatus: 'suspended' });
            throw new Error("Suspicious activity detected. Your account has been suspended.");
        }
        
        const dailyLikes = likeEvents.filter(e => e.fromUser === data.fromUser && e.timestamp > twentyFourHoursAgo);
        if (dailyLikes.length >= 100) {
            throw new Error("You have reached your daily limit of 100 likes.");
        }

        const likesToSameUser = likeEvents.filter(e => e.fromUser === data.fromUser && e.toUser === data.toUser);
        if (likesToSameUser.length >= 30) {
            throw new Error("You cannot like this creator anymore.");
        }
        
        const likesToLiker = likeEvents.filter(e => e.fromUser === data.toUser && e.toUser === data.fromUser);
        if(likesToSameUser.length > 20 && likesToLiker.length > 20) {
             updateUser(fromUser.id, { accountStatus: 'banned' });
             const toUser = users.find(u => u.id === data.toUser);
             if(toUser) updateUser(toUser.id, { accountStatus: 'banned' });
             throw new Error("Like farming detected. Accounts have been banned.");
        }


        const newLikeEvent: LikeEvent = {
            ...data,
            id: faker.string.uuid(),
            timestamp: now.toISOString()
        };
        likeEvents.push(newLikeEvent);
        saveData(LIKE_EVENTS_KEY, likeEvents);
        
        updateUser(fromUser.id, { 
            totalLikesSent: (fromUser.totalLikesSent || 0) + 1,
            likeBalance: (fromUser.likeBalance || 0) - 1,
        });
        
        let toUser = users.find(u => u.id === data.toUser);
        if(toUser){
            updateUser(toUser.id, {
                 totalLikesReceived: (toUser.totalLikesReceived || 0) + 1,
                 walletBalance: (toUser.walletBalance || 0) + data.value,
            });
        }
        
        return newLikeEvent;
      },
    },
     Like: {
      filter: async (filter: Partial<Like>): Promise<Like[]> => {
        return likes.filter(l => Object.entries(filter).every(([key, value]) => l[key as keyof Like] === value));
      },
    },
    Comment: {
       filter: async (filter: Partial<Comment>, sort?: string): Promise<Comment[]> => {
        let filteredComments = comments.filter(c => Object.entries(filter).every(([key, value]) => c[key as keyof Comment] === value));
        if (sort === '-created_date') {
          filteredComments.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
        }
        return filteredComments;
      },
      create: async (data: Omit<Comment, 'id' | 'created_date'>): Promise<Comment> => {
        const newComment: Comment = {
          ...data,
          id: faker.string.uuid(),
          created_date: new Date().toISOString(),
        };
        comments.unshift(newComment);
        saveData(COMMENTS_KEY, comments);
        return newComment;
      },
    },
     CommentReply: {
      create: async (data: Omit<CommentReply, 'id' | 'created_date'>): Promise<CommentReply> => {
        const newReply: CommentReply = {
          ...data,
          id: faker.string.uuid(),
          created_date: new Date().toISOString(),
        };
        commentReplies.unshift(newReply);
        saveData(COMMENT_REPLIES_KEY, commentReplies);
        return newReply;
      },
    },
    CommentLike: {
       create: async (data: Omit<CommentLike, 'id' | 'created_date'>): Promise<CommentLike> => {
        const newLike: CommentLike = {
          ...data,
          id: faker.string.uuid(),
          created_date: new Date().toISOString(),
        };
        commentLikes.unshift(newLike);
        saveData(COMMENT_LIKES_KEY, commentLikes);
        return newLike;
      },
    },
    Transaction: {
      list: async (sort: string): Promise<Transaction[]> => {
        const userEmail = localStorage.getItem(CURRENT_USER_KEY);
        if(!userEmail) throw new Error('Not authenticated');
        const user = users.find(u => u.email === userEmail);
        if(!user) throw new Error('User not found');
        
        let userTransactions = transactions.filter(t => t.userId === user.id);
        if (sort === '-createdAt' || sort === '-created_date') {
          userTransactions.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
        }
        return userTransactions;
      },
      create: async (data: any): Promise<Transaction> => {
        const newTransaction: Transaction = {
          ...data,
          id: faker.string.uuid(),
          createdAt: new Date().toISOString(),
          created_date: new Date().toISOString(),
        };
        transactions.unshift(newTransaction);
        saveData(TRANSACTIONS_KEY, transactions);
        return newTransaction;
      },
    },
    Notification: {
      list: async (sort: string): Promise<Notification[]> => {
        const userEmail = localStorage.getItem(CURRENT_USER_KEY);
        if(!userEmail) throw new Error('Not authenticated');

        let userNotifications = notifications.filter(n => n.created_by === userEmail);
        if (sort === '-created_date') {
          userNotifications.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
        }
        return userNotifications;
      },
      create: async (data: Omit<Notification, 'id' | 'read' | 'created_date'>): Promise<Notification> => {
        const newNotification: Notification = {
          ...data,
          id: faker.string.uuid(),
          read: false,
          created_date: new Date().toISOString(),
        };
        notifications.unshift(newNotification);
        saveData(NOTIFICATIONS_KEY, notifications);
        return newNotification;
      },
      update: async (notificationId: string, updates: Partial<Notification>): Promise<Notification> => {
        let notification = notifications.find(n => n.id === notificationId);
        if (!notification) throw new Error('Notification not found');

        notification = { ...notification, ...updates };
        notifications = notifications.map(n => n.id === notificationId ? notification! : n);
        saveData(NOTIFICATIONS_KEY, notifications);
        return notification;
      },
      delete: async (notificationId: string): Promise<void> => {
        notifications = notifications.filter(p => p.id !== notificationId);
        saveData(NOTIFICATIONS_KEY, notifications);
      },
    },
    Message: {
      list: async (sort: string): Promise<Message[]> => {
        let sortedMessages = [...messages];
        if (sort === '-created_date') {
          sortedMessages.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
        }
        return sortedMessages;
      },
       filter: async (filter: Partial<Message>): Promise<Message[]> => {
        return messages.filter(m => Object.entries(filter).every(([key, value]) => m[key as keyof Message] === value));
      },
      create: async (data: Omit<Message, 'id' | 'created_date'>): Promise<Message> => {
        const newMessage: Message = {
          ...data,
          id: faker.string.uuid(),
          created_date: new Date().toISOString(),
        };
        messages.push(newMessage);
        saveData(MESSAGES_KEY, messages);
        return newMessage;
      },
      update: async (messageId: string, updates: Partial<Message>): Promise<Message> => {
        let message = messages.find(m => m.id === messageId);
        if (!message) throw new Error('Message not found');

        message = { ...message, ...updates };
        messages = messages.map(m => m.id === messageId ? message! : m);
        saveData(MESSAGES_KEY, messages);
        return message;
      },
    }
  },
}
