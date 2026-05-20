import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MOCK_PROVIDERS, Provider } from '../data/mockProviders';

const COLLECTION = 'providers';

/**
 * Fetch providers filtered by service type from Firestore.
 * Falls back to mock data if Firestore fails.
 */
export async function getProvidersByService(service: string): Promise<Provider[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('service', '==', service),
      where('available', '==', true)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // Fallback to mock data if nothing in Firestore yet
      return MOCK_PROVIDERS.filter(
        p => p.service.toLowerCase() === service.toLowerCase() && p.available
      );
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Provider));
  } catch (error) {
    console.warn('Firestore fetch failed, using mock data:', error);
    return MOCK_PROVIDERS.filter(
      p => p.service.toLowerCase() === service.toLowerCase() && p.available
    );
  }
}

/**
 * Fetch all providers from Firestore.
 * Falls back to mock data if Firestore fails.
 */
export async function getAllProviders(): Promise<Provider[]> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    if (snapshot.empty) return MOCK_PROVIDERS;
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Provider));
  } catch (error) {
    console.warn('Firestore fetch failed, using mock data:', error);
    return MOCK_PROVIDERS;
  }
}

/**
 * Add a new provider to Firestore.
 */
export async function addProvider(data: Omit<Provider, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), data);
  return docRef.id;
}
