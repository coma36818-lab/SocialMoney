


export type User = {
  id: string; // Firestore document ID
  username: string;
  email: string;
  walletBalance: number;
  likeBalance: number;
  totalLikesReceived: number;
  totalLikesSent: number;
  createdAt: string; // ISO timestamp
  referralCode: string;
  referredBy: string | null;
  accountStatus: 'active' | 'banned' | 'suspended';
  paypalEmail?: string;

  // Campi del profilo aggiuntivi (mantenuti dal design precedente)
  bio?: string;
  avatar?: string;
  city?: string;
  country?: string;
  region?: string;
  gender?: 'uomo' | 'donna' | 'altro' | 'non specificato';
  age?: number;
  relationship_status?: string;

  // Mantenuto per retrocompatibilità con la logica esistente, da mappare
  password?: string; // Solo per la creazione, non memorizzato
  full_name?: string; // Derivato da username
};

export type Post = {
  id: string; // Firestore document ID
  userId: string; // ID dell'utente che ha creato il post
  imageUrl: string;
  description: string;
  createdAt: string; // ISO timestamp
  likes: number;
};

export type LikeEvent = {
  id: string; // eventId
  fromUser: string; // userId of user who gave the like
  toUser: string; // userId of user who received the like
  postId: string;
  value: number; // e.g. 0.01
  timestamp: string; // ISO timestamp
};

export type Transaction = {
  id: string; // transactionId
  userId: string;
  type: "purchase" | "withdraw" | "reward" | "like";
  amount: number;
  status: "pending" | "completed" | "failed";
  createdAt: string; // timestamp
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

