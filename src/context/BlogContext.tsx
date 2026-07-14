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
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  increment,
  arrayUnion,
} from 'firebase/firestore';

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

  const changeAdminPassword = async (newPassword: string) => {
    try {
      setAdminPasswordState(newPassword);
      localStorage.setItem('adminPassword', newPassword);
      await updateDoc(doc(db, 'settings', 'global'), { adminPassword: newPassword });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/global');
    }
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

  // Seed Database if empty helper
  const seedIfEmpty = async () => {
    try {
      const settingsRef = doc(db, 'settings', 'global');
      const settingsDoc = await getDoc(settingsRef);
      if (!settingsDoc.exists()) {
        const todayStr = new Date().toISOString().split('T')[0];
        // Seed global settings
        await setDoc(settingsRef, {
          adminPassword: '1234',
          todayVisitors: 42,
          totalVisitors: 1284,
          showVisitorCount: true,
          lastVisitDate: todayStr,
        });

        // Seed other collections
        for (const item of INITIAL_STORIES) {
          await setDoc(doc(db, 'stories', item.id), item);
        }
        for (const item of INITIAL_PHOTOS) {
          await setDoc(doc(db, 'photos', item.id), item);
        }
        for (const item of INITIAL_TRAVELS) {
          await setDoc(doc(db, 'travels', item.id), item);
        }
        for (const item of INITIAL_FRIEND_POSTS) {
          await setDoc(doc(db, 'friendPosts', item.id), item);
        }
        for (const item of INITIAL_LIBRARY_ITEMS) {
          await setDoc(doc(db, 'libraryItems', item.id), item);
        }
        for (const item of INITIAL_NOTICES) {
          await setDoc(doc(db, 'notices', item.id), item);
        }
        for (const item of INITIAL_GUESTBOOKS) {
          await setDoc(doc(db, 'guestbooks', item.id), item);
        }
        console.log('Firebase Firestore successfully seeded with initial mock data');
      }
    } catch (error) {
      console.error('Error during database seeding:', error);
    }
  };

  // Setup Firestore Subscribers and sync
  useEffect(() => {
    // Theme setup
    const storedTheme = localStorage.getItem('theme');
    const isDark = storedTheme === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Admin Session setup
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

    let unsubStories = () => {};
    let unsubPhotos = () => {};
    let unsubTravels = () => {};
    let unsubFriendPosts = () => {};
    let unsubLibraryItems = () => {};
    let unsubNotices = () => {};
    let unsubGuestbooks = () => {};
    let unsubSettings = () => {};

    // Run the seed check and start listening
    seedIfEmpty().then(() => {
      unsubStories = onSnapshot(collection(db, 'stories'), (snapshot) => {
        const list: Story[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Story);
        });
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setStories(list);
      }, (error) => handleFirestoreError(error, OperationType.GET, 'stories'));

      unsubPhotos = onSnapshot(collection(db, 'photos'), (snapshot) => {
        const list: Photo[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Photo);
        });
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setPhotos(list);
      }, (error) => handleFirestoreError(error, OperationType.GET, 'photos'));

      unsubTravels = onSnapshot(collection(db, 'travels'), (snapshot) => {
        const list: Travel[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Travel);
        });
        list.sort((a, b) => b.date.localeCompare(a.date));
        setTravels(list);
      }, (error) => handleFirestoreError(error, OperationType.GET, 'travels'));

      unsubFriendPosts = onSnapshot(collection(db, 'friendPosts'), (snapshot) => {
        const list: FriendPost[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as FriendPost);
        });
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setFriendPosts(list);
      }, (error) => handleFirestoreError(error, OperationType.GET, 'friendPosts'));

      unsubLibraryItems = onSnapshot(collection(db, 'libraryItems'), (snapshot) => {
        const list: LibraryItem[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as LibraryItem);
        });
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setLibraryItems(list);
      }, (error) => handleFirestoreError(error, OperationType.GET, 'libraryItems'));

      unsubNotices = onSnapshot(collection(db, 'notices'), (snapshot) => {
        const list: Notice[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Notice);
        });
        list.sort((a, b) => {
          if (a.isImportant && !b.isImportant) return -1;
          if (!a.isImportant && b.isImportant) return 1;
          return b.createdAt.localeCompare(a.createdAt);
        });
        setNotices(list);
      }, (error) => handleFirestoreError(error, OperationType.GET, 'notices'));

      unsubGuestbooks = onSnapshot(collection(db, 'guestbooks'), (snapshot) => {
        const list: Guestbook[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Guestbook);
        });
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setGuestbooks(list);
      }, (error) => handleFirestoreError(error, OperationType.GET, 'guestbooks'));

      unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAdminPasswordState(data.adminPassword || '1234');
          setTodayVisitors(data.todayVisitors || 42);
          setTotalVisitors(data.totalVisitors || 1284);
          setShowVisitorCount(data.showVisitorCount !== false);
        }
      }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/global'));
    });

    return () => {
      unsubStories();
      unsubPhotos();
      unsubTravels();
      unsubFriendPosts();
      unsubLibraryItems();
      unsubNotices();
      unsubGuestbooks();
      unsubSettings();
    };
  }, []);

  // Update visitors inside a separate effect
  useEffect(() => {
    const registerVisit = async () => {
      try {
        const settingsRef = doc(db, 'settings', 'global');
        const todayStr = new Date().toISOString().split('T')[0];
        
        const sessVisit = sessionStorage.getItem('sessionVisited');
        if (!sessVisit) {
          sessionStorage.setItem('sessionVisited', 'true');
          
          const settingsSnap = await getDoc(settingsRef);
          if (settingsSnap.exists()) {
            const data = settingsSnap.data();
            const lastVisitDate = data.lastVisitDate;
            
            if (lastVisitDate !== todayStr) {
              await updateDoc(settingsRef, {
                todayVisitors: 1,
                totalVisitors: increment(1),
                lastVisitDate: todayStr,
              });
            } else {
              await updateDoc(settingsRef, {
                todayVisitors: increment(1),
                totalVisitors: increment(1),
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to register visitor count:', error);
      }
    };
    
    registerVisit();
  }, []);

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

  const handleSetShowVisitorCount = async (show: boolean) => {
    try {
      setShowVisitorCount(show);
      localStorage.setItem('showVisitorCount', show ? 'true' : 'false');
      await updateDoc(doc(db, 'settings', 'global'), { showVisitorCount: show });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/global');
    }
  };

  // Actions - Stories
  const addStory = async (story: Omit<Story, 'id' | 'views' | 'likes' | 'createdAt'>) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const docRef = doc(collection(db, 'stories'));
      const newStory: Story = {
        ...story,
        id: docRef.id,
        createdAt: today,
        views: 0,
        likes: 0,
        approved: isAdmin ? true : false,
      };
      await setDoc(docRef, newStory);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'stories');
    }
  };

  const updateStory = async (id: string, updated: Partial<Story>) => {
    try {
      await updateDoc(doc(db, 'stories', id), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `stories/${id}`);
    }
  };

  const deleteStory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'stories', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `stories/${id}`);
    }
  };

  const incrementStoryViews = async (id: string) => {
    try {
      await updateDoc(doc(db, 'stories', id), { views: increment(1) });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `stories/${id}`);
    }
  };

  const likeStory = async (id: string) => {
    try {
      await updateDoc(doc(db, 'stories', id), { likes: increment(1) });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `stories/${id}`);
    }
  };

  const approveStory = async (id: string) => {
    try {
      await updateDoc(doc(db, 'stories', id), { approved: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `stories/${id}`);
    }
  };

  // Actions - Photos
  const addPhoto = async (photo: Omit<Photo, 'id' | 'createdAt'>) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const docRef = doc(collection(db, 'photos'));
      const newPhoto: Photo = {
        ...photo,
        id: docRef.id,
        createdAt: today,
        approved: isAdmin ? true : false,
      };
      await setDoc(docRef, newPhoto);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'photos');
    }
  };

  const updatePhoto = async (id: string, updated: Partial<Photo>) => {
    try {
      await updateDoc(doc(db, 'photos', id), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `photos/${id}`);
    }
  };

  const deletePhoto = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'photos', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `photos/${id}`);
    }
  };

  const approvePhoto = async (id: string) => {
    try {
      await updateDoc(doc(db, 'photos', id), { approved: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `photos/${id}`);
    }
  };

  // Actions - Travels
  const addTravel = async (travel: Omit<Travel, 'id'>) => {
    try {
      const docRef = doc(collection(db, 'travels'));
      const newTravel: Travel = {
        ...travel,
        id: docRef.id,
        approved: isAdmin ? true : false,
      };
      await setDoc(docRef, newTravel);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'travels');
    }
  };

  const updateTravel = async (id: string, updated: Partial<Travel>) => {
    try {
      await updateDoc(doc(db, 'travels', id), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `travels/${id}`);
    }
  };

  const deleteTravel = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'travels', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `travels/${id}`);
    }
  };

  const approveTravel = async (id: string) => {
    try {
      await updateDoc(doc(db, 'travels', id), { approved: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `travels/${id}`);
    }
  };

  // Actions - Friend Posts
  const addFriendPost = async (post: { nickname: string; title: string; content: string; imageUrl?: string }) => {
    try {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const docRef = doc(collection(db, 'friendPosts'));
      const newPost: FriendPost = {
        id: docRef.id,
        nickname: post.nickname,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl || undefined,
        createdAt: formattedDate,
        likes: 0,
        comments: [],
        approved: isAdmin ? true : false,
      };
      await setDoc(docRef, newPost);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'friendPosts');
    }
  };

  const deleteFriendPost = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'friendPosts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `friendPosts/${id}`);
    }
  };

  const likeFriendPost = async (id: string) => {
    try {
      await updateDoc(doc(db, 'friendPosts', id), { likes: increment(1) });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `friendPosts/${id}`);
    }
  };

  const addFriendComment = async (postId: string, nickname: string, content: string) => {
    try {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newComment = {
        id: `comment-${Date.now()}`,
        nickname,
        content,
        createdAt: formattedDate,
      };
      await updateDoc(doc(db, 'friendPosts', postId), {
        comments: arrayUnion(newComment)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `friendPosts/${postId}`);
    }
  };

  const approveFriendPost = async (id: string) => {
    try {
      await updateDoc(doc(db, 'friendPosts', id), { approved: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `friendPosts/${id}`);
    }
  };

  // Actions - Library
  const addLibraryItem = async (item: Omit<LibraryItem, 'id' | 'createdAt' | 'downloads'>) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const docRef = doc(collection(db, 'libraryItems'));
      const newItem: LibraryItem = {
        ...item,
        id: docRef.id,
        createdAt: today,
        downloads: 0,
        approved: isAdmin ? true : false,
      };
      await setDoc(docRef, newItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'libraryItems');
    }
  };

  const updateLibraryItem = async (id: string, updated: Partial<LibraryItem>) => {
    try {
      await updateDoc(doc(db, 'libraryItems', id), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `libraryItems/${id}`);
    }
  };

  const deleteLibraryItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'libraryItems', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `libraryItems/${id}`);
    }
  };

  const downloadLibraryItem = async (id: string) => {
    try {
      await updateDoc(doc(db, 'libraryItems', id), { downloads: increment(1) });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `libraryItems/${id}`);
    }
  };

  const approveLibraryItem = async (id: string) => {
    try {
      await updateDoc(doc(db, 'libraryItems', id), { approved: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `libraryItems/${id}`);
    }
  };

  // Actions - Notices
  const addNotice = async (notice: Omit<Notice, 'id' | 'createdAt'>) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const docRef = doc(collection(db, 'notices'));
      const newNotice: Notice = {
        ...notice,
        id: docRef.id,
        createdAt: today,
        approved: isAdmin ? true : false,
      };
      await setDoc(docRef, newNotice);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'notices');
    }
  };

  const updateNotice = async (id: string, updated: Partial<Notice>) => {
    try {
      await updateDoc(doc(db, 'notices', id), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `notices/${id}`);
    }
  };

  const deleteNotice = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notices', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `notices/${id}`);
    }
  };

  const approveNotice = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notices', id), { approved: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `notices/${id}`);
    }
  };

  // Actions - Guestbooks
  const addGuestbook = async (nickname: string, content: string) => {
    try {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const docRef = doc(collection(db, 'guestbooks'));
      const newGuest: Guestbook = {
        id: docRef.id,
        nickname,
        content,
        createdAt: formattedDate,
        approved: isAdmin ? true : false,
      };
      await setDoc(docRef, newGuest);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'guestbooks');
    }
  };

  const deleteGuestbook = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'guestbooks', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `guestbooks/${id}`);
    }
  };

  const replyGuestbook = async (id: string, reply: string) => {
    try {
      await updateDoc(doc(db, 'guestbooks', id), { adminReply: reply || null });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `guestbooks/${id}`);
    }
  };

  const approveGuestbook = async (id: string) => {
    try {
      await updateDoc(doc(db, 'guestbooks', id), { approved: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `guestbooks/${id}`);
    }
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
