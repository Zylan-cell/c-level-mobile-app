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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config';
import { Task } from '@/types';

const COLLECTION_NAME = 'tasks';

// Получение всех задач
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const tasksCollection = collection(db, COLLECTION_NAME);
    const tasksQuery = query(tasksCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(tasksQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        completedAt: data.completedAt?.toDate()?.toISOString() || null
      } as Task;
    });
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

// Получение задач для конкретного C-Level
export const getTasksByCLevel = async (clevelType: string): Promise<Task[]> => {
  try {
    const tasksCollection = collection(db, COLLECTION_NAME);
    const tasksQuery = query(
      tasksCollection, 
      where('clevelType', '==', clevelType),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(tasksQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        completedAt: data.completedAt?.toDate()?.toISOString() || null
      } as Task;
    });
  } catch (error) {
    console.error('Error getting tasks by C-Level:', error);
    throw error;
  }
};

// Получение задачи по ID
export const getTaskById = async (id: string): Promise<Task | null> => {
  try {
    const taskDoc = doc(db, COLLECTION_NAME, id);
    const docSnapshot = await getDoc(taskDoc);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    const data = docSnapshot.data();
    return {
      id: docSnapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
      completedAt: data.completedAt?.toDate()?.toISOString() || null
    } as Task;
  } catch (error) {
    console.error('Error getting task by ID:', error);
    throw error;
  }
};

// Создание новой задачи
export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  try {
    const tasksCollection = collection(db, COLLECTION_NAME);
    const taskData = {
      ...task,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(tasksCollection, taskData);
    
    return {
      id: docRef.id,
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Обновление задачи
export const updateTask = async (id: string, taskData: Partial<Task>): Promise<void> => {
  try {
    const taskDoc = doc(db, COLLECTION_NAME, id);
    
    // Удаляем поля, которые не должны быть обновлены напрямую
    const { id: _, createdAt, ...updateData } = taskData as any;
    
    // Добавляем метку времени обновления
    const dataToUpdate = {
      ...updateData,
      updatedAt: serverTimestamp()
    };
    
    // Если задача помечена как выполненная и нет времени завершения, устанавливаем его
    if (taskData.status === 'completed' && !taskData.completedAt) {
      dataToUpdate.completedAt = serverTimestamp();
    }
    
    await updateDoc(taskDoc, dataToUpdate);
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Удаление задачи
export const deleteTask = async (id: string): Promise<void> => {
  try {
    const taskDoc = doc(db, COLLECTION_NAME, id);
    await deleteDoc(taskDoc);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Получение проблемных задач (со статусом failed или overdue)
export const getProblematicTasks = async (): Promise<Task[]> => {
  try {
    const tasksCollection = collection(db, COLLECTION_NAME);
    const failedTasksQuery = query(
      tasksCollection, 
      where('status', 'in', ['failed', 'overdue']),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(failedTasksQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        completedAt: data.completedAt?.toDate()?.toISOString() || null
      } as Task;
    });
  } catch (error) {
    console.error('Error getting problematic tasks:', error);
    throw error;
  }
};
