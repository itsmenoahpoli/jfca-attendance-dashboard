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

  if (!encryptedCache) {
    console.warn("No cache data found in local storage.");
    return;
  }

  try {
    const decryptedCache = decryptData(encryptedCache);

    if (!decryptedCache) {
      console.warn("Decryption returned null or an invalid format.");
      return;
    }

    const deserializedCache = JSON.parse(decryptedCache);

    if (!Array.isArray(deserializedCache)) {
      console.warn("Deserialized cache is not an array.");
      return;
    }

    deserializedCache.forEach(({ queryKey, state }: any) => {
      if (queryKey && state) {
        queryClient.setQueryData(queryKey, state.data);
        queryClient.getQueryCache().find(queryKey)?.setState(state);
      } else {
        console.warn("Invalid cache item structure:", { queryKey, state });
      }
    });
  } catch (error) {
    console.error("Failed to decrypt or deserialize the cache data:", error);
  }
};
