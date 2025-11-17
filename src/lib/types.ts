
export type User = {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    verified?: boolean;
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
    password?: string;
    full_name?: string;
    created_date?: string;
    role?: string;
};

export type Post = {
  id: string;
  userId: string;
  text?: string;
  mediaType?: "image" | "video" | "text";
  mediaURL?: string;
  thumbnailURL?: string;
  likeCount?: number;
  createdAt: string; // ISO timestamp
  status?: "visible" | "removed";
  earnings?: number;
  imageUrl?: string;
  description?: string;
  likes?: number;
  media_url?: string;
  media_type?: 'image' | 'video' | 'text';
  created_by?: any;
  owner_id?: any;
  created_date?: any;
  likes_count?: any;
};

export type LikeEvent = {
  id: string; // eventId
  postId: string;
  fromUser: string; 
  toUser: string; 
  value: number; // e.g. 0.01
  timestamp: string; // ISO timestamp
};

export type Transaction = {
  id: string; // transactionId
  userId: string;
  type: "like" | "like_purchase" | "payout" | "reward" | "purchase";
  amount: number;
  description: string;
  createdAt: string; // timestamp
  status?: "pending" | "completed" | "failed";
  created_date?: any;
};

export type Notification = {
    id: string;
    created_by: string; // user email of the person who triggered the notification
    message: string;
    type: "like" | "follow" | "earning" | "system" | "referral";
    read: boolean;
    related_id?: string;
    created_date: string;
};

export type Message = {
  id: string;
  from_user_email: string;
  to_user_email: string;
  message: string;
  created_date: string;
  read: boolean;
};

export type Comment = {
  id: string;
  post_id: string;
  user_email: string;
  user_name?: string;
  comment_text: string;
  created_date: string;
};

export type CommentReply = {
  id: string;
  comment_id: string;
  reply_text: string;
  user_email: string;
  user_name?: string;
  created_date: string;
};

export type CommentLike = {
  id: string;
  comment_id: string;
  user_email: string;
  user_name?: string;
  created_date: string;
};

export type Like = {
  id: string;
  post_id: string;
  post_owner_email: string;
  like_value: number;
  created_by: string;
};

export type Payout = {
    id: string;
    userId: string;
    amount: number;
    paypal_email: string;
    status: "pending" | "approved" | "rejected";
    requestedAt: string; // ISO timestamp
};

export type DailyStats = {
  date: string; // YYYY-MM-DD
  total_users: number;
  total_posts: number;
  total_likes: number;
  total_payouts: number;
  revenue: number;
};
