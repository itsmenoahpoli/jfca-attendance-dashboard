import { createJSONStorage } from "jotai/utils";
import { SECURE_STORAGE } from "@/utils";

export const storeStorage = <T>() =>
  createJSONStorage<T>(() => {
    return {
      getItem: (key: string) => {
        const encryptedData = localStorage.getItem(key);

        if (!encryptedData) return null;

        try {
          const decryptedData = SECURE_STORAGE.decryptData(encryptedData);
          return decryptedData;
        } catch (error) {
          console.error("Decryption failed:", error);
          return null;
        }
      },
      setItem: (key: string, value: any) => {
        try {
          const encryptedData = SECURE_STORAGE.encryptData(value as T);
          localStorage.setItem(key, encryptedData);
        } catch (error) {
          console.error("Encryption failed:", error);
        }
      },
      removeItem: (key: string) => {
        localStorage.removeItem(key);
      },
    };
  });
