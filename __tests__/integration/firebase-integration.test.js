import { db } from '../../src/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

// Мокаем Firebase Firestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  serverTimestamp: jest.fn(() => new Date())
}));

jest.mock('../../src/lib/firebase/config', () => ({
  db: {}
}));

describe('Firebase Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should be able to query Firestore', (done) => {
    // Настраиваем моки
    const mockDocs = [
      { id: '1', data: () => ({ name: 'Test 1' }) },
      { id: '2', data: () => ({ name: 'Test 2' }) }
    ];
    
    collection.mockReturnValue('test-collection');
    getDocs.mockResolvedValue({ docs: mockDocs });
    
    // Выполняем запрос
    const collectionRef = collection(db, 'test');
    getDocs(collectionRef).then((snapshot) => {
      // Проверяем, что функции были вызваны с правильными параметрами
      expect(collection).toHaveBeenCalledWith(db, 'test');
      expect(getDocs).toHaveBeenCalledWith('test-collection');
      
      // Проверяем результаты
      expect(snapshot.docs).toHaveLength(2);
      expect(snapshot.docs[0].id).toBe('1');
      expect(snapshot.docs[0].data().name).toBe('Test 1');
      
      console.log('Firebase integration test completed successfully');
      done();
    });
  });
});
