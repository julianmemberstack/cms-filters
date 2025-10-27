/**
 * IndexedDB caching utilities for storing fetched CMS pages
 * Based on Finsweet Attributes implementation
 */

const DB_OBJECT_STORE_NAME = 'pages';

/**
 * Creates or opens an IndexedDB database for caching pages
 * @param {string} dbName - Database name
 * @param {number} dbVersion - Database version
 * @returns {Promise<IDBDatabase | null>}
 */
export const createCacheDB = (dbName, dbVersion) => {
  return new Promise((resolve) => {
    try {
      const dbOpenRequest = window.indexedDB.open(dbName, dbVersion);

      dbOpenRequest.onblocked = () => {
        resolve(null);
      };

      dbOpenRequest.onupgradeneeded = () => {
        const db = dbOpenRequest.result;
        if (db.objectStoreNames.contains(DB_OBJECT_STORE_NAME)) {
          db.deleteObjectStore(DB_OBJECT_STORE_NAME);
        }
        db.createObjectStore(DB_OBJECT_STORE_NAME);
      };

      dbOpenRequest.onerror = () => resolve(null);

      dbOpenRequest.onsuccess = () => {
        const db = dbOpenRequest.result;
        db.onversionchange = () => db.close();
        resolve(db);
      };
    } catch {
      resolve(null);
    }
  });
};

/**
 * Retrieves a cached page from IndexedDB
 * @param {IDBDatabase} db - Database instance
 * @param {URL} url - Page URL
 * @returns {Promise<string | null>}
 */
export const getCachedPage = async (db, url) => {
  return new Promise((resolve) => {
    const transaction = db.transaction(DB_OBJECT_STORE_NAME);
    const objectStore = transaction.objectStore(DB_OBJECT_STORE_NAME);
    const request = objectStore.get(url.href);

    request.onerror = () => resolve(null);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Stores a page in IndexedDB cache
 * @param {IDBDatabase} db - Database instance
 * @param {URL} url - Page URL
 * @param {string} rawPage - HTML content
 * @returns {Promise<void>}
 */
export const storePage = async (db, url, rawPage) => {
  return new Promise((resolve) => {
    const transaction = db.transaction(DB_OBJECT_STORE_NAME, 'readwrite');
    const objectStore = transaction.objectStore(DB_OBJECT_STORE_NAME);
    const request = objectStore.put(rawPage, url.href);

    request.onerror = () => resolve();
    request.onsuccess = () => resolve();
  });
};
