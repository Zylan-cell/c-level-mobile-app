// Мок для Firebase
const mockFirestore = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  get: jest.fn().mockResolvedValue({
    exists: true,
    data: () => ({}),
    docs: []
  }),
  add: jest.fn().mockResolvedValue({ id: 'mock-id' }),
  set: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis()
};

const mockAuth = {
  currentUser: { uid: 'mock-user-id' },
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({}),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({}),
  signOut: jest.fn().mockResolvedValue({})
};

const mockApp = {
  firestore: () => mockFirestore
};

// Мокируем модули Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn().mockReturnValue(mockApp),
  getApps: jest.fn().mockReturnValue([])
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn().mockReturnValue(mockFirestore),
  collection: jest.fn().mockReturnValue(mockFirestore),
  doc: jest.fn().mockReturnValue(mockFirestore),
  getDoc: jest.fn().mockResolvedValue({
    exists: () => true,
    data: () => ({})
  }),
  getDocs: jest.fn().mockResolvedValue({
    docs: []
  }),
  addDoc: jest.fn().mockResolvedValue({ id: 'mock-id' }),
  setDoc: jest.fn().mockResolvedValue({}),
  updateDoc: jest.fn().mockResolvedValue({}),
  deleteDoc: jest.fn().mockResolvedValue({}),
  query: jest.fn().mockReturnValue(mockFirestore),
  where: jest.fn().mockReturnValue(mockFirestore),
  orderBy: jest.fn().mockReturnValue(mockFirestore),
  limit: jest.fn().mockReturnValue(mockFirestore),
  Timestamp: {
    now: jest.fn().mockReturnValue({ toDate: () => new Date() }),
    fromDate: jest.fn().mockReturnValue({})
  }
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue(mockAuth),
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({}),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({}),
  signOut: jest.fn().mockResolvedValue({})
}));

export { mockFirestore, mockAuth, mockApp };
