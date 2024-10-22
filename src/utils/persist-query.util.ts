import { QueryClient } from "@tanstack/react-query";
import { encryptData, decryptData } from "./crypto.util";

export const persistQueryClientToLocalStorage = (queryClient: QueryClient, storageKey = "REACT_QUERY_CACHE") => {
  const saveCacheToLocalStorage = () => {
    const cacheData = queryClient.getQueryCache().getAll();
    const serializedCache = JSON.stringify(
      cacheData.map(({ queryKey, state }) => ({
        queryKey,
        state,
      }))
    );

    const encryptedCache = encryptData(serializedCache);
    localStorage.setItem(storageKey, encryptedCache);
  };

  queryClient.getQueryCache().subscribe(saveCacheToLocalStorage);
};

export const rehydrateQueryClientFromLocalStorage = (queryClient: QueryClient, storageKey = "REACT_QUERY_CACHE") => {
  const encryptedCache = localStorage.getItem(storageKey);

  try {
    const decryptedCache = decryptData(encryptedCache!);
    const deserializedCache = JSON.parse(decryptedCache);

    deserializedCache.forEach(({ queryKey, state }: any) => {
      queryClient.setQueryData(queryKey, state.data);
      queryClient.getQueryCache().find(queryKey)?.setState(state);
    });
  } catch (error) {
    console.error("Failed to decrypt or deserialize the cache data:", error);
  }
};
