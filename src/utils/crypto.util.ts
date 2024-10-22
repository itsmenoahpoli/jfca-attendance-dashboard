import CryptoJS from "crypto-js";
import { APP_SECRET_PASSPHRASE } from "@/constants";

export const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), APP_SECRET_PASSPHRASE).toString();
};

export const decryptData = (encrypted: string) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, APP_SECRET_PASSPHRASE);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  return JSON.parse(decrypted);
};

export const secureStoreStorage = {
  serialize: (state: any) => {
    try {
      const encryptedState = encryptData(state);
      return encryptedState;
    } catch (e) {
      console.error("Failed to encrypt state", e);
      return JSON.stringify(state);
    }
  },
  deserialize: (str: string) => {
    const decryptedState = decryptData(str);

    return decryptedState;
  },
};
