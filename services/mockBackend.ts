import { Contract, UserProfile, PlanType } from '../types';

// Keys for LocalStorage
const USERS_KEY = 'contratofacil_users';
const CONTRACTS_KEY = 'contratofacil_contracts';
const CURRENT_USER_KEY = 'contratofacil_current_user_id';

// Simulation Helpers
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const generateId = () => Math.random().toString(36).substr(2, 9);

export const MockAuth = {
  login: async (email: string, password: string): Promise<UserProfile> => {
    await delay(600);
    const usersStr = localStorage.getItem(USERS_KEY) || '[]';
    const users: UserProfile[] = JSON.parse(usersStr);
    // Password check skipped for mock simplicity, just matching email
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    
    localStorage.setItem(CURRENT_USER_KEY, user.uid);
    return user;
  },

  register: async (email: string, password: string, name: string): Promise<UserProfile> => {
    await delay(800);
    const usersStr = localStorage.getItem(USERS_KEY) || '[]';
    const users: UserProfile[] = JSON.parse(usersStr);

    if (users.find(u => u.email === email)) {
      throw new Error('Email já cadastrado.');
    }

    const newUser: UserProfile = {
      uid: generateId(),
      email,
      displayName: name,
      planType: 'free',
      contractsCreatedThisMonth: 0,
      subscriptionStatus: 'active'
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, newUser.uid);
    return newUser;
  },

  logout: async () => {
    await delay(300);
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: async (): Promise<UserProfile | null> => {
    // Simulate checking session
    const uid = localStorage.getItem(CURRENT_USER_KEY);
    if (!uid) return null;
    const users: UserProfile[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.find(u => u.uid === uid) || null;
  }
};

export const MockFirestore = {
  getUser: async (uid: string): Promise<UserProfile | null> => {
    const users: UserProfile[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.find(u => u.uid === uid) || null;
  },

  updateUserPlan: async (uid: string, newPlan: PlanType): Promise<void> => {
    await delay(500);
    const users: UserProfile[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const idx = users.findIndex(u => u.uid === uid);
    if (idx !== -1) {
      users[idx].planType = newPlan;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  uploadPaymentProof: async (file: File): Promise<string> => {
      // Mock upload function
      await delay(1000);
      return "https://mock-storage.com/proof.pdf";
  },

  incrementContractCount: async (uid: string): Promise<void> => {
    const users: UserProfile[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const idx = users.findIndex(u => u.uid === uid);
    if (idx !== -1) {
      users[idx].contractsCreatedThisMonth += 1;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  getContracts: async (userId: string): Promise<Contract[]> => {
    await delay(400);
    const allContracts: Contract[] = JSON.parse(localStorage.getItem(CONTRACTS_KEY) || '[]');
    return allContracts.filter(c => c.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  },

  saveContract: async (contract: Omit<Contract, 'id' | 'createdAt'>): Promise<Contract> => {
    await delay(600);
    const allContracts: Contract[] = JSON.parse(localStorage.getItem(CONTRACTS_KEY) || '[]');
    
    const newContract: Contract = {
      ...contract,
      id: generateId(),
      createdAt: Date.now(),
    };

    allContracts.push(newContract);
    localStorage.setItem(CONTRACTS_KEY, JSON.stringify(allContracts));
    
    // Increment usage
    await MockFirestore.incrementContractCount(contract.userId);
    
    return newContract;
  },

  deleteContract: async (id: string): Promise<void> => {
    await delay(300);
    let allContracts: Contract[] = JSON.parse(localStorage.getItem(CONTRACTS_KEY) || '[]');
    allContracts = allContracts.filter(c => c.id !== id);
    localStorage.setItem(CONTRACTS_KEY, JSON.stringify(allContracts));
  }
};