import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '../config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Регистрация нового пользователя
export const registerUser = async (email: string, password: string, displayName: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Обновляем профиль пользователя
    await updateProfile(user, { displayName });
    
    // Создаем запись в Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      displayName,
      role: 'user', // Роль по умолчанию
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
    
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Вход пользователя
export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Обновляем время последнего входа
    await setDoc(doc(db, 'users', user.uid), {
      lastLogin: serverTimestamp()
    }, { merge: true });
    
    return user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Выход пользователя
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Получение текущего пользователя
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Подписка на изменения состояния аутентификации
export const onAuthStateChange = (callback: (user: User | null) => void): () => void => {
  return onAuthStateChanged(auth, callback);
};

// Получение данных пользователя из Firestore
export const getUserData = async (userId: string): Promise<any> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const docSnapshot = await getDoc(userDoc);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    return docSnapshot.data();
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Сброс пароля
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};
