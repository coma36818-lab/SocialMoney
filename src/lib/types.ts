
export type User = {
    id: string; // Firestore document ID
    uid: string; // Firebase Auth UID
    username: string;
    email: string;
    createdAt: string; // ISO timestamp
    verified?: boolean; // Email verification status
    likeBalance: number;
    walletBalance: number;
    totalLikesReceived: number;
    totalLikesSent: number;
    referralCode: string;
    referredBy?: string | null;
    accountStatus: 'active' | 'banned' | 'suspended';
    paypalEmail?: string;
    bio?: string;
    avatar?: string;
    city?: string;
    country?: string;
    region?: string;
    gender?: 'uomo' | 'donna' | 'altro' | 'non specificato';
    age?: number;
    relationship_status?: string;
    full_name?: string;
    role?: string;
};

export type Post = {
  id: string;
  userId: string; // Corresponds to Firebase Auth UID
  description?: string;
  media_type: 'image' | 'video' | 'text';
  media_url?: string;
  likes_count: number;
  earnings: number;
  created_date: string; // ISO timestamp
};

export type Like = {
  id: string;
  postId: string;
  userId: string; // UID of the user who liked the post
  created_date: string; // ISO timestamp
};

export type Transaction = {
  id: string;
  userId: string;
  type: "like_purchase" | "payout" | "earning_from_like";
  amount: number;
  description: string;
  created_date: string; // ISO timestamp
  status: 'pending' | 'completed' | 'failed';
};

export type Notification = {
    id: string;
    userId: string; // UID of the user to notify
    message: string;
    type: "like" | "follow" | "earning" | "system" | "referral";
    read: boolean;
    created_date: string; // ISO timestamp
};

export type Message = {
  id: string;
  participants: string[]; // Array of participant UIDs
  fromUserId: string;
  toUserId: string;
  message: string;
  created_date: string;
  read: boolean;
};

export type Comment = {
  id: string;
  postId: string;
  userId: string;
  username: string;
  avatar?: string;
  comment_text: string;
  created_date: string;
};

export type CommentReply = {
  id: string;
  commentId: string;
  userId: string;
  username: string;
  avatar?: string;
  reply_text: string;
  created_date: string;
};

    