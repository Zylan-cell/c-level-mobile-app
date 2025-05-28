import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config';
import { CLevelStrategy, CLevelType } from '@/types';

const COLLECTION_NAME = 'strategies';

// Получение всех стратегий
export const getAllStrategies = async (): Promise<Record<CLevelType, CLevelStrategy>> => {
  try {
    const strategiesCollection = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(strategiesCollection);
    
    const strategies: Record<string, CLevelStrategy> = {} as Record<CLevelType, CLevelStrategy>;
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      strategies[data.clevelType] = {
        clevelType: data.clevelType,
        title: data.title || `${data.clevelType} Strategy`,
        description: data.description || '',
        objectives: data.objectives || [],
        kpis: data.kpis || [],
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
      } as CLevelStrategy;
    });
    
    return strategies;
  } catch (error) {
    console.error('Error getting strategies:', error);
    throw error;
  }
};

// Получение стратегии по типу C-Level
export const getStrategyByCLevelType = async (clevelType: CLevelType): Promise<CLevelStrategy | null> => {
  try {
    const strategiesCollection = collection(db, COLLECTION_NAME);
    const strategyQuery = query(
      strategiesCollection, 
      where('clevelType', '==', clevelType)
    );
    const querySnapshot = await getDocs(strategyQuery);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      clevelType: data.clevelType,
      title: data.title || `${data.clevelType} Strategy`,
      description: data.description || '',
      objectives: data.objectives || [],
      kpis: data.kpis || [],
      updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
    } as CLevelStrategy;
  } catch (error) {
    console.error('Error getting strategy by C-Level type:', error);
    throw error;
  }
};

// Создание или обновление стратегии
export const setStrategy = async (strategy: Omit<CLevelStrategy, 'id' | 'updatedAt'>): Promise<CLevelStrategy> => {
  try {
    const strategiesCollection = collection(db, COLLECTION_NAME);
    const strategyQuery = query(
      strategiesCollection, 
      where('clevelType', '==', strategy.clevelType)
    );
    const querySnapshot = await getDocs(strategyQuery);
    
    let docRef;
    
    if (querySnapshot.empty) {
      // Создаем новую стратегию
      const strategyData = {
        ...strategy,
        updatedAt: serverTimestamp()
      };
      
      docRef = doc(strategiesCollection);
      await setDoc(docRef, strategyData);
    } else {
      // Обновляем существующую стратегию
      docRef = querySnapshot.docs[0].ref;
      
      const updateData = {
        ...strategy,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
    }
    
    return {
      id: docRef.id,
      ...strategy,
      updatedAt: new Date().toISOString()
    } as CLevelStrategy;
  } catch (error) {
    console.error('Error setting strategy:', error);
    throw error;
  }
};

// Обновление стратегии
export const updateStrategy = async (clevelType: CLevelType, strategyData: Partial<CLevelStrategy>): Promise<void> => {
  try {
    const strategiesCollection = collection(db, COLLECTION_NAME);
    const strategyQuery = query(
      strategiesCollection, 
      where('clevelType', '==', clevelType)
    );
    const querySnapshot = await getDocs(strategyQuery);
    
    if (querySnapshot.empty) {
      throw new Error(`Strategy for ${clevelType} not found`);
    }
    
    const docRef = querySnapshot.docs[0].ref;
    
    // Удаляем поля, которые не должны быть обновлены напрямую
    const { id: _, clevelType: __, updatedAt, ...updateData } = strategyData as any;
    
    // Добавляем метку времени обновления
    const dataToUpdate = {
      ...updateData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, dataToUpdate);
  } catch (error) {
    console.error('Error updating strategy:', error);
    throw error;
  }
};
