"use client";

import { IDBPDatabase, openDB } from "idb";

const DB_NAME = "VRMCacheDB";
const STORE_NAME = "vrmFiles";

let dbPromise: Promise<IDBPDatabase> | undefined;

if (typeof window !== "undefined") {
  dbPromise = openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export const getCachedVRM = async (
  key: string
): Promise<ArrayBuffer | undefined> => {
  if (!dbPromise) {
    throw new Error("IndexedDB is not available");
  }
  const db = await dbPromise;
  return db.get(STORE_NAME, key);
};

export const cacheVRM = async (
  key: string,
  data: ArrayBuffer
): Promise<void> => {
  if (!dbPromise) {
    throw new Error("IndexedDB is not available");
  }
  const db = await dbPromise;
  await db.put(STORE_NAME, data, key);
};