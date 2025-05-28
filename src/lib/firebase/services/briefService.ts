import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { db } from '../config';
import { Brief } from '@/types';

const COLLECTION_NAME = 'briefs';

// Получение всех брифов
export const getAllBriefs = async (): Promise<Brief[]> => {
  try {
    const briefsCollection = collection(db, COLLECTION_NAME);
    const briefsQuery = query(briefsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(briefsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        recommendations: data.recommendations || []
      } as Brief;
    });
  } catch (error) {
    console.error('Error getting briefs:', error);
    throw error;
  }
};

// Получение брифа по ID
export const getBriefById = async (id: string): Promise<Brief | null> => {
  try {
    const briefDoc = doc(db, COLLECTION_NAME, id);
    const docSnapshot = await getDoc(briefDoc);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const data = docSnapshot.data();
    return {
      id: docSnapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      recommendations: data.recommendations || []
    } as Brief;
  } catch (error) {
    console.error('Error getting brief by ID:', error);
    throw error;
  }
};

// Получение брифа по ID задачи
export const getBriefByTaskId = async (taskId: string): Promise<Brief | null> => {
  try {
    const briefsCollection = collection(db, COLLECTION_NAME);
    const briefQuery = query(
      briefsCollection, 
      where('taskId', '==', taskId)
    );
    const querySnapshot = await getDocs(briefQuery);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      recommendations: data.recommendations || []
    } as Brief;
  } catch (error) {
    console.error('Error getting brief by task ID:', error);
    throw error;
  }
};

// Создание нового брифа
export const createBrief = async (brief: Omit<Brief, 'id' | 'createdAt'>): Promise<Brief> => {
  try {
    const briefsCollection = collection(db, COLLECTION_NAME);
    const briefData = {
      ...brief,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(briefsCollection, briefData);
    
    return {
      id: docRef.id,
      ...brief,
      createdAt: new Date().toISOString()
    } as Brief;
  } catch (error) {
    console.error('Error creating brief:', error);
    throw error;
  }
};

// Обновление брифа
export const updateBrief = async (id: string, briefData: Partial<Brief>): Promise<void> => {
  try {
    const briefDoc = doc(db, COLLECTION_NAME, id);
    
    // Удаляем поля, которые не должны быть обновлены напрямую
    const { id: _, createdAt, ...updateData } = briefData as any;
    
    await updateDoc(briefDoc, updateData);
  } catch (error) {
    console.error('Error updating brief:', error);
    throw error;
  }
};

// Удаление брифа
export const deleteBrief = async (id: string): Promise<void> => {
  try {
    const briefDoc = doc(db, COLLECTION_NAME, id);
    await deleteDoc(briefDoc);
  } catch (error) {
    console.error('Error deleting brief:', error);
    throw error;
  }
};

// Получение последних брифов
export const getLatestBriefs = async (limitCount: number = 5): Promise<Brief[]> => {
  try {
    const briefsCollection = collection(db, COLLECTION_NAME);
    const briefsQuery = query(
      briefsCollection, 
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(briefsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        recommendations: data.recommendations || []
      } as Brief;
    });
  } catch (error) {
    console.error('Error getting latest briefs:', error);
    throw error;
  }
};
