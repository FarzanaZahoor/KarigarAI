/**
 * seedDatabase.ts
 * Run this once to upload all mock providers to Firestore.
 * Usage: Call seedDatabase() from a dev screen or button press.
 */
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MOCK_PROVIDERS } from '../data/mockProviders';

export async function seedDatabase(): Promise<{ success: boolean; count: number; message: string }> {
  try {
    const col = collection(db, 'providers');

    // Optional: clear existing docs first
    const existing = await getDocs(col);
    const deletePromises = existing.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Upload all mock providers
    const addPromises = MOCK_PROVIDERS.map(provider => {
      const { id, ...data } = provider; // strip local id, Firestore will assign its own
      return addDoc(col, data);
    });

    await Promise.all(addPromises);

    return {
      success: true,
      count: MOCK_PROVIDERS.length,
      message: `✅ Successfully seeded ${MOCK_PROVIDERS.length} providers to Firestore!`,
    };
  } catch (error: any) {
    return {
      success: false,
      count: 0,
      message: `❌ Seeding failed: ${error.message}`,
    };
  }
}
