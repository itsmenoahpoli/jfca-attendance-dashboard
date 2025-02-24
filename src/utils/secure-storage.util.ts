import CryptoJS from "crypto-js";
import { SETTINGS } from "@/constants";

export const SECURE_STORAGE = {
  encryptData(data: any) {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      SETTINGS.SECRET_PASSKEY
    ).toString();

    return encrypted;
  },
  decryptData(encrypted: string) {
    const bytes = CryptoJS.AES.decrypt(encrypted, SETTINGS.SECRET_PASSKEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted);
  },
};
