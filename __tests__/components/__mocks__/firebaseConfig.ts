// Мок для Firebase config
jest.mock('@/lib/firebase/config', () => {
  const mockAuth = {
    currentUser: { uid: 'mock-user-id' },
    onAuthStateChanged: jest.fn((auth, callback) => {
      callback({ uid: 'mock-user-id' });
      return jest.fn();
    }),
    signInWithEmailAndPassword: jest.fn().mockResolvedValue({}),
    createUserWithEmailAndPassword: jest.fn().mockResolvedValue({}),
    signOut: jest.fn().mockResolvedValue({})
  };

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

  const mockApp = {};

  return {
    app: mockApp,
    db: mockFirestore,
    auth: mockAuth
  };
});

export default {};
