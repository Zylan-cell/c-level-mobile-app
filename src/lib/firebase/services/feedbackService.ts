import { 
  collection, 
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config';
import { Feedback } from '@/types';

const COLLECTION_NAME = 'feedback';

// Отправка обратной связи
export const submitFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> => {
  try {
    const feedbackCollection = collection(db, COLLECTION_NAME);
    const feedbackData = {
      ...feedback,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(feedbackCollection, feedbackData);
    
    return {
      id: docRef.id,
      ...feedback,
      createdAt: new Date().toISOString()
    } as Feedback;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

// Получение всей обратной связи (для администраторов)
export const getAllFeedback = async (): Promise<Feedback[]> => {
  try {
    const feedbackCollection = collection(db, COLLECTION_NAME);
    const feedbackQuery = query(
      feedbackCollection, 
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(feedbackQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
      } as Feedback;
    });
  } catch (error) {
    console.error('Error getting feedback:', error);
    throw error;
  }
};
