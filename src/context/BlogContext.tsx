import React, { createContext, useContext, useState, useEffect } from 'react';
import { Story, Photo, Travel, FriendPost, LibraryItem, Notice, Guestbook, ActiveTab } from '../types';
import {
  INITIAL_STORIES,
  INITIAL_PHOTOS,
  INITIAL_TRAVELS,
  INITIAL_FRIEND_POSTS,
  INITIAL_LIBRARY_ITEMS,
  INITIAL_NOTICES,
  INITIAL_GUESTBOOKS,
} from '../data/mockData';

interface BlogContextType {
  stories: Story[];
  photos: Photo[];
  travels: Travel[];
  friendPosts: FriendPost[];
  libraryItems: LibraryItem[];
  notices: Notice[];
  guestbooks: Guestbook[];
  
  // Tabs & Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Dark Mode
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  
  // Admin Mode
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  adminPassword: string;
  changeAdminPassword: (password: string) => void;
  
  // Visitor Counts
  todayVisitors: number;
  totalVisitors: number;
  showVisitorCount: boolean;
  setShowVisitorCount: (show: boolean) => void;

  // Image Fit Mode
  imageFitMode: 'cover' | 'contain';
  setImageFitMode: (mode: 'cover' | 'contain') => void;

  // Actions - Stories
  addStory: (story: Omit<Story, 'id' | 'views' | 'likes' | 'createdAt'>) => void;
  updateStory: (id: string, updated: Partial<Story>) => void;
  deleteStory: (id: string) => void;
  incrementStoryViews: (id: string) => void;
  likeStory: (id: string) => void;
  approveStory: (id: string) => void;

  // Actions - Photos
  addPhoto: (photo: Omit<Photo, 'id' | 'createdAt'>) => void;
  updatePhoto: (id: string, updated: Partial<Photo>) => void;
  deletePhoto: (id: string) => void;
  approvePhoto: (id: string) => void;

  // Actions - Travels
  addTravel: (travel: Omit<Travel, 'id'>) => void;
  updateTravel: (id: string, updated: Partial<Travel>) => void;
  deleteTravel: (id: string) => void;
  approveTravel: (id: string) => void;

  // Actions - Friend Posts
  addFriendPost: (post: { nickname: string; title: string; content: string; imageUrl?: string }) => void;
  deleteFriendPost: (id: string) => void;
  likeFriendPost: (id: string) => void;
  addFriendComment: (postId: string, nickname: string, content: string) => void;
  approveFriendPost: (id: string) => void;

  // Actions - Library
  addLibraryItem: (item: Omit<LibraryItem, 'id' | 'createdAt' | 'downloads'>) => void;
  updateLibraryItem: (id: string, updated: Partial<LibraryItem>) => void;
  deleteLibraryItem: (id: string) => void;
  downloadLibraryItem: (id: string) => void;
  approveLibraryItem: (id: string) => void;

  // Actions - Notices
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void;
  updateNotice: (id: string, updated: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  approveNotice: (id: string) => void;

  // Actions - Guestbooks
  addGuestbook: (nickname: string, content: string) => void;
  deleteGuestbook: (id: string) => void;
  replyGuestbook: (id: string, reply: string) => void;
  approveGuestbook: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Theme
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminPassword, setAdminPasswordState] = useState<string>('1234');

  const changeAdminPassword = (newPassword: string) => {
    setAdminPasswordState(newPassword);
    localStorage.setItem('adminPassword', newPassword);
  };
  
  // Core State
  const [stories, setStories] = useState<Story[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [travels, setTravels] = useState<Travel[]>([]);
  const [friendPosts, setFriendPosts] = useState<FriendPost[]>([]);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [guestbooks, setGuestbooks] = useState<Guestbook[]>([]);
  
  // Visitors
  const [todayVisitors, setTodayVisitors] = useState(42);
  const [totalVisitors, setTotalVisitors] = useState(1284);
  const [showVisitorCount, setShowVisitorCount] = useState(true);

  // Image Fit Mode
  const [imageFitMode, setImageFitModeState] = useState<'cover' | 'contain'>('contain');
  const setImageFitMode = (mode: 'cover' | 'contain') => {
    setImageFitModeState(mode);
    localStorage.setItem('imageFitMode', mode);
  };

  // Load from LocalStorage
  useEffect(() => {
    // Theme
    const storedTheme = localStorage.getItem('theme');
    const isDark = storedTheme === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Admin Session
    const adminSession = sessionStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminSession);

    // Admin Password Setup
    const storedPassword = localStorage.getItem('adminPassword');
    if (storedPassword) {
      setAdminPasswordState(storedPassword);
    }

    // Image Fit Mode Setup
    const storedFitMode = localStorage.getItem('imageFitMode') as 'cover' | 'contain' | null;
    if (storedFitMode) {
      setImageFitModeState(storedFitMode);
    }

    // Core Data Loading
    const loadData = <T,>(key: string, initial: T[]): T[] => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return initial;
        }
      }
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    };

    setStories(loadData('stories', INITIAL_STORIES));
    setPhotos(loadData('photos', INITIAL_PHOTOS));
    setTravels(loadData('travels', INITIAL_TRAVELS));
    setFriendPosts(loadData('friendPosts', INITIAL_FRIEND_POSTS));
    setLibraryItems(loadData('libraryItems', INITIAL_LIBRARY_ITEMS));
    setNotices(loadData('notices', INITIAL_NOTICES));
    setGuestbooks(loadData('guestbooks', INITIAL_GUESTBOOKS));

    // Visitors Setup
    const lastVisit = localStorage.getItem('lastVisitDate');
    const todayStr = new Date().toISOString().split('T')[0];
    const storedToday = parseInt(localStorage.getItem('todayVisitors') || '42', 10);
    const storedTotal = parseInt(localStorage.getItem('totalVisitors') || '1284', 10);
    const storedShow = localStorage.getItem('showVisitorCount') !== 'false';

    setShowVisitorCount(storedShow);

    if (lastVisit !== todayStr) {
      // New day, reset today's count and increment total
      const newToday = 1;
      const newTotal = storedTotal + 1;
      setTodayVisitors(newToday);
      setTotalVisitors(newTotal);
      localStorage.setItem('todayVisitors', String(newToday));
      localStorage.setItem('totalVisitors', String(newTotal));
      localStorage.setItem('lastVisitDate', todayStr);
    } else {
      // Same day, increment today and total only if this is a fresh page mount of a new session
      const sessVisit = sessionStorage.getItem('sessionVisited');
      if (!sessVisit) {
        const newToday = storedToday + 1;
        const newTotal = storedTotal + 1;
        setTodayVisitors(newToday);
        setTotalVisitors(newTotal);
        localStorage.setItem('todayVisitors', String(newToday));
        localStorage.setItem('totalVisitors', String(newTotal));
        sessionStorage.setItem('sessionVisited', 'true');
      } else {
        setTodayVisitors(storedToday);
        setTotalVisitors(storedTotal);
      }
    }
  }, []);

  // Sync to LocalStorage helper
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Theme control
  const handleSetDarkMode = (dark: boolean) => {
    setDarkMode(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Admin control
  const handleSetIsAdmin = (admin: boolean) => {
    setIsAdmin(admin);
    sessionStorage.setItem('isAdmin', admin ? 'true' : 'false');
  };

  const handleSetShowVisitorCount = (show: boolean) => {
    setShowVisitorCount(show);
    localStorage.setItem('showVisitorCount', show ? 'true' : 'false');
  };

  // Actions - Stories
  const addStory = (story: Omit<Story, 'id' | 'views' | 'likes' | 'createdAt'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newStory: Story = {
      ...story,
      id: `story-${Date.now()}`,
      createdAt: today,
      views: 0,
      likes: 0,
      approved: isAdmin ? true : false,
    };
    const updated = [newStory, ...stories];
    setStories(updated);
    saveState('stories', updated);
  };

  const updateStory = (id: string, updated: Partial<Story>) => {
    const updatedList = stories.map((s) => (s.id === id ? { ...s, ...updated } : s));
    setStories(updatedList);
    saveState('stories', updatedList);
  };

  const deleteStory = (id: string) => {
    const filtered = stories.filter((s) => s.id !== id);
    setStories(filtered);
    saveState('stories', filtered);
  };

  const incrementStoryViews = (id: string) => {
    const updatedList = stories.map((s) => (s.id === id ? { ...s, views: s.views + 1 } : s));
    setStories(updatedList);
    saveState('stories', updatedList);
  };

  const likeStory = (id: string) => {
    const updatedList = stories.map((s) => (s.id === id ? { ...s, likes: s.likes + 1 } : s));
    setStories(updatedList);
    saveState('stories', updatedList);
  };

  const approveStory = (id: string) => {
    const updatedList = stories.map((s) => (s.id === id ? { ...s, approved: true } : s));
    setStories(updatedList);
    saveState('stories', updatedList);
  };

  // Actions - Photos
  const addPhoto = (photo: Omit<Photo, 'id' | 'createdAt'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newPhoto: Photo = {
      ...photo,
      id: `photo-${Date.now()}`,
      createdAt: today,
      approved: isAdmin ? true : false,
    };
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    saveState('photos', updated);
  };

  const updatePhoto = (id: string, updated: Partial<Photo>) => {
    const updatedList = photos.map((p) => (p.id === id ? { ...p, ...updated } : p));
    setPhotos(updatedList);
    saveState('photos', updatedList);
  };

  const deletePhoto = (id: string) => {
    const filtered = photos.filter((p) => p.id !== id);
    setPhotos(filtered);
    saveState('photos', filtered);
  };

  const approvePhoto = (id: string) => {
    const updatedList = photos.map((p) => (p.id === id ? { ...p, approved: true } : p));
    setPhotos(updatedList);
    saveState('photos', updatedList);
  };

  // Actions - Travels
  const addTravel = (travel: Omit<Travel, 'id'>) => {
    const newTravel: Travel = {
      ...travel,
      id: `travel-${Date.now()}`,
      approved: isAdmin ? true : false,
    };
    const updated = [newTravel, ...travels];
    setTravels(updated);
    saveState('travels', updated);
  };

  const updateTravel = (id: string, updated: Partial<Travel>) => {
    const updatedList = travels.map((t) => (t.id === id ? { ...t, ...updated } : t));
    setTravels(updatedList);
    saveState('travels', updatedList);
  };

  const deleteTravel = (id: string) => {
    const filtered = travels.filter((t) => t.id !== id);
    setTravels(filtered);
    saveState('travels', filtered);
  };

  const approveTravel = (id: string) => {
    const updatedList = travels.map((t) => (t.id === id ? { ...t, approved: true } : t));
    setTravels(updatedList);
    saveState('travels', updatedList);
  };

  // Actions - Friend Posts
  const addFriendPost = (post: { nickname: string; title: string; content: string; imageUrl?: string }) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newPost: FriendPost = {
      id: `friend-${Date.now()}`,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl || undefined,
      createdAt: formattedDate,
      likes: 0,
      comments: [],
      approved: isAdmin ? true : false,
    };
    const updated = [newPost, ...friendPosts];
    setFriendPosts(updated);
    saveState('friendPosts', updated);
  };

  const deleteFriendPost = (id: string) => {
    const filtered = friendPosts.filter((p) => p.id !== id);
    setFriendPosts(filtered);
    saveState('friendPosts', filtered);
  };

  const likeFriendPost = (id: string) => {
    const updatedList = friendPosts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p));
    setFriendPosts(updatedList);
    saveState('friendPosts', updatedList);
  };

  const addFriendComment = (postId: string, nickname: string, content: string) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newComment = {
      id: `comment-${Date.now()}`,
      nickname,
      content,
      createdAt: formattedDate,
    };
    const updatedList = friendPosts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment],
        };
      }
      return p;
    });
    setFriendPosts(updatedList);
    saveState('friendPosts', updatedList);
  };

  const approveFriendPost = (id: string) => {
    const updatedList = friendPosts.map((p) => (p.id === id ? { ...p, approved: true } : p));
    setFriendPosts(updatedList);
    saveState('friendPosts', updatedList);
  };

  // Actions - Library
  const addLibraryItem = (item: Omit<LibraryItem, 'id' | 'createdAt' | 'downloads'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newItem: LibraryItem = {
      ...item,
      id: `lib-${Date.now()}`,
      createdAt: today,
      downloads: 0,
      approved: isAdmin ? true : false,
    };
    const updated = [newItem, ...libraryItems];
    setLibraryItems(updated);
    saveState('libraryItems', updated);
  };

  const updateLibraryItem = (id: string, updated: Partial<LibraryItem>) => {
    const updatedList = libraryItems.map((l) => (l.id === id ? { ...l, ...updated } : l));
    setLibraryItems(updatedList);
    saveState('libraryItems', updatedList);
  };

  const deleteLibraryItem = (id: string) => {
    const filtered = libraryItems.filter((l) => l.id !== id);
    setLibraryItems(filtered);
    saveState('libraryItems', filtered);
  };

  const downloadLibraryItem = (id: string) => {
    const updatedList = libraryItems.map((l) => (l.id === id ? { ...l, downloads: l.downloads + 1 } : l));
    setLibraryItems(updatedList);
    saveState('libraryItems', updatedList);
  };

  const approveLibraryItem = (id: string) => {
    const updatedList = libraryItems.map((l) => (l.id === id ? { ...l, approved: true } : l));
    setLibraryItems(updatedList);
    saveState('libraryItems', updatedList);
  };

  // Actions - Notices
  const addNotice = (notice: Omit<Notice, 'id' | 'createdAt'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newNotice: Notice = {
      ...notice,
      id: `notice-${Date.now()}`,
      createdAt: today,
      approved: isAdmin ? true : false,
    };
    const updated = [newNotice, ...notices];
    setNotices(updated);
    saveState('notices', updated);
  };

  const updateNotice = (id: string, updated: Partial<Notice>) => {
    const updatedList = notices.map((n) => (n.id === id ? { ...n, ...updated } : n));
    setNotices(updatedList);
    saveState('notices', updatedList);
  };

  const deleteNotice = (id: string) => {
    const filtered = notices.filter((n) => n.id !== id);
    setNoticeList(filtered);
  };

  const setNoticeList = (list: Notice[]) => {
    setNotices(list);
    saveState('notices', list);
  };

  const approveNotice = (id: string) => {
    const updatedList = notices.map((n) => (n.id === id ? { ...n, approved: true } : n));
    setNotices(updatedList);
    saveState('notices', updatedList);
  };

  // Actions - Guestbooks
  const addGuestbook = (nickname: string, content: string) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newGuest: Guestbook = {
      id: `guest-${Date.now()}`,
      nickname,
      content,
      createdAt: formattedDate,
      approved: isAdmin ? true : false,
    };
    const updated = [newGuest, ...guestbooks];
    setGuestbooks(updated);
    saveState('guestbooks', updated);
  };

  const deleteGuestbook = (id: string) => {
    const filtered = guestbooks.filter((g) => g.id !== id);
    setGuestbooks(filtered);
    saveState('guestbooks', filtered);
  };

  const replyGuestbook = (id: string, reply: string) => {
    const updatedList = guestbooks.map((g) => (g.id === id ? { ...g, adminReply: reply || undefined } : g));
    setGuestbooks(updatedList);
    saveState('guestbooks', updatedList);
  };

  const approveGuestbook = (id: string) => {
    const updatedList = guestbooks.map((g) => (g.id === id ? { ...g, approved: true } : g));
    setGuestbooks(updatedList);
    saveState('guestbooks', updatedList);
  };

  return (
    <BlogContext.Provider
      value={{
        stories,
        photos,
        travels,
        friendPosts,
        libraryItems,
        notices,
        guestbooks,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        darkMode,
        setDarkMode: handleSetDarkMode,
        isAdmin,
        setIsAdmin: handleSetIsAdmin,
        adminPassword,
        changeAdminPassword,
        todayVisitors,
        totalVisitors,
        showVisitorCount,
        setShowVisitorCount: handleSetShowVisitorCount,
        imageFitMode,
        setImageFitMode,
        addStory,
        updateStory,
        deleteStory,
        incrementStoryViews,
        likeStory,
        approveStory,
        addPhoto,
        updatePhoto,
        deletePhoto,
        approvePhoto,
        addTravel,
        updateTravel,
        deleteTravel,
        approveTravel,
        addFriendPost,
        deleteFriendPost,
        likeFriendPost,
        addFriendComment,
        approveFriendPost,
        addLibraryItem,
        updateLibraryItem,
        deleteLibraryItem,
        downloadLibraryItem,
        approveLibraryItem,
        addNotice,
        updateNotice,
        deleteNotice,
        approveNotice,
        addGuestbook,
        deleteGuestbook,
        replyGuestbook,
        approveGuestbook,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
