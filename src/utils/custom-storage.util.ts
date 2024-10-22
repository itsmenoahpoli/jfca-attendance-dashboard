import { secureStoreStorage } from "@/utils";

const customStorage = {
  getItem: (name: string) => {
    const data = localStorage.getItem(name);
    return data ? secureStoreStorage.deserialize(data) : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, secureStoreStorage.serialize(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export { customStorage };
