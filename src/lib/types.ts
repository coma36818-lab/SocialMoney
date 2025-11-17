export type User = {
  id: string;
  nickname: string;
  email: string;
  password?: string;
  age: number;
  gender: 'uomo' | 'donna' | 'altro' | 'non specificato';
  city: string;
  country: string;
  region: string;
  full_name: string;
  bio?: string;
  avatar?: string;
  likes_available: number;
  likes_received: number;
  likes_sent: number;
  balance: number;
  total_earnings: number;
  role?: string;
  relationship_status?: string;
  created_date?: string;
  referral_code?: string;
  referred_by?: string;
};

export type Post = {
  id: string;
  created_by: string; // user email
  owner_id: string;
  created_date: string;
  description?: string;
  media_url: string;
  media_type: 'image' | 'video' | 'text';
  likes_count: number;
  earnings: number;
};

export type Like = {
  id: string;
  post_id: string;
  post_owner_email: string;
  like_value: number;
  created_by: string; // user email
};

export type Transaction = {
  id: string;
  user_id: string;
  created_date: string;
  type: 'like_received' | 'like_purchase' | 'conversion' | 'payout' | 'referral_bonus';
  description: string;
  amount: number;
  related_id?: string;
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
