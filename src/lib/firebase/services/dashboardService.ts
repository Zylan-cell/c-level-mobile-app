import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config';
import { CLevelPerformance, BusinessMetrics } from '@/types';

// Получение метрик бизнеса
export const getBusinessMetrics = async (): Promise<BusinessMetrics[]> => {
  try {
    const metricsCollection = collection(db, 'businessMetrics');
    const metricsQuery = query(
      metricsCollection, 
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(metricsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ltv: data.ltv || 0,
        mrr: data.mrr || 0,
        cashFlow: data.cashFlow || 0,
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
      } as BusinessMetrics;
    });
  } catch (error) {
    console.error('Error getting business metrics:', error);
    throw error;
  }
};

// Получение производительности C-Level
export const getCLevelPerformance = async (): Promise<CLevelPerformance[]> => {
  try {
    const performanceCollection = collection(db, 'clevelPerformance');
    const performanceQuery = query(
      performanceCollection, 
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(performanceQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        clevelType: data.clevelType,
        completedKpis: data.completedKpis || 0,
        totalKpis: data.totalKpis || 0,
        confidenceScore: data.confidenceScore || 0,
        positiveNotes: data.positiveNotes || [],
        negativeNotes: data.negativeNotes || [],
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
      } as CLevelPerformance;
    });
  } catch (error) {
    console.error('Error getting C-Level performance:', error);
    throw error;
  }
};

// Получение производительности конкретного C-Level
export const getCLevelPerformanceByType = async (clevelType: string): Promise<CLevelPerformance | null> => {
  try {
    const performanceCollection = collection(db, 'clevelPerformance');
    const performanceQuery = query(
      performanceCollection, 
      where('clevelType', '==', clevelType),
      orderBy('updatedAt', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(performanceQuery);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      clevelType: data.clevelType,
      completedKpis: data.completedKpis || 0,
      totalKpis: data.totalKpis || 0,
      confidenceScore: data.confidenceScore || 0,
      positiveNotes: data.positiveNotes || [],
      negativeNotes: data.negativeNotes || [],
      updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
    } as CLevelPerformance;
  } catch (error) {
    console.error('Error getting C-Level performance by type:', error);
    throw error;
  }
};

// Обновление метрики бизнеса
export const updateBusinessMetric = async (metricId: string, metricData: Partial<BusinessMetrics>): Promise<void> => {
  try {
    const metricDoc = doc(db, 'businessMetrics', metricId);
    
    // Удаляем поля, которые не должны быть обновлены напрямую
    const { id: _, updatedAt, ...updateData } = metricData as any;
    
    // Добавляем метку времени обновления
    const dataToUpdate = {
      ...updateData,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(metricDoc, dataToUpdate, { merge: true });
  } catch (error) {
    console.error('Error updating business metric:', error);
    throw error;
  }
};

// Обновление производительности C-Level
export const updateCLevelPerformance = async (performanceId: string, performanceData: Partial<CLevelPerformance>): Promise<void> => {
  try {
    const performanceDoc = doc(db, 'clevelPerformance', performanceId);
    
    // Удаляем поля, которые не должны быть обновлены напрямую
    const { id: _, updatedAt, ...updateData } = performanceData as any;
    
    // Добавляем метку времени обновления
    const dataToUpdate = {
      ...updateData,
      updatedAt: serverTimestamp()
    };
    
    await setDoc(performanceDoc, dataToUpdate, { merge: true });
  } catch (error) {
    console.error('Error updating C-Level performance:', error);
    throw error;
  }
};
