import { createJSONStorage } from "jotai/utils";
import { SECURE_STORAGE } from "@/utils";

export const storeStorage = <T>(): any => {
  const storage = createJSONStorage<T>(() => ({
    getItem: (key: string): string | null => {
      const encryptedData = localStorage.getItem(key);

      if (!encryptedData) return null;

      try {
        const decryptedData = SECURE_STORAGE.decryptData(encryptedData);
        return JSON.stringify(decryptedData); // Return as string
      } catch (error) {
        console.error("Decryption failed:", error);
        localStorage.removeItem(key);
        return null;
      }
    },
    setItem: (key: string, newValue: string) => {
      try {
        const valueToStore = JSON.parse(newValue);
        const encryptedData = SECURE_STORAGE.encryptData(valueToStore);
        localStorage.setItem(key, encryptedData);
      } catch (error) {
        console.error("Encryption failed:", error);
      }
    },
    removeItem: (key: string) => {
      localStorage.removeItem(key);
    },
  }));

  return storage;
};
