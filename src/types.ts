export interface Story {
  id: string;
  category: '일상' | '생각' | '취미' | '소식';
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  views: number;
  likes: number;
}

export interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  takenAt: string;
  createdAt: string;
}

export interface Travel {
  id: string;
  destination: string;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
  tags: string[];
}

export interface FriendComment {
  id: string;
  nickname: string;
  content: string;
  createdAt: string;
}

export interface FriendPost {
  id: string;
  nickname: string;
  avatarUrl?: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
  comments: FriendComment[];
}

export interface LibraryItem {
  id: string;
  title: string;
  fileType: 'pdf' | 'doc' | 'image' | 'zip' | 'video' | 'etc';
  fileSize: string;
  createdAt: string;
  downloads: number;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isImportant: boolean;
}

export interface Guestbook {
  id: string;
  nickname: string;
  content: string;
  createdAt: string;
  adminReply?: string;
}

export type ActiveTab = 'home' | 'story' | 'photo' | 'travel' | 'friend' | 'library' | 'guestbook' | 'intro' | 'admin';
