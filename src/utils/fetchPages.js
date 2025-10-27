/**
 * Page fetching utilities for loading all CMS pages
 * Based on Finsweet Attributes implementation
 */

import { createCacheDB, getCachedPage, storePage } from './cache';

// Memory cache for in-flight requests
const memoryCache = new Map();

/**
 * Fetches a single page with caching support
 * @param {string | URL} url - Page URL to fetch
 * @param {IDBDatabase | null} db - IndexedDB instance for caching
 * @returns {Promise<Document | null>}
 */
export const fetchPage = async (url, db = null) => {
  const urlObj = typeof url === 'string' ? new URL(url, window.location.origin) : url;
  const urlKey = urlObj.href;

  // Check memory cache first
  if (memoryCache.has(urlKey)) {
    return memoryCache.get(urlKey);
  }

  // Create promise for this fetch
  const fetchPromise = (async () => {
    try {
      // Check IndexedDB cache if available
      if (db) {
        const cachedHTML = await getCachedPage(db, urlObj);
        if (cachedHTML) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(cachedHTML, 'text/html');
          return doc;
        }
      }

      // Fetch from network
      const response = await fetch(urlObj.href);
      if (!response.ok) return null;

      const html = await response.text();

      // Store in IndexedDB if available
      if (db) {
        await storePage(db, urlObj, html);
      }

      // Parse and return document
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      return doc;
    } catch (error) {
      console.error('Error fetching page:', error);
      return null;
    } finally {
      // Remove from memory cache after fetch completes
      memoryCache.delete(urlKey);
    }
  })();

  // Store promise in memory cache
  memoryCache.set(urlKey, fetchPromise);

  return fetchPromise;
};

/**
 * Finds pagination next button URL
 * Checks both Webflow native classes and fs-attributes
 * @param {Document} doc - Document to search
 * @returns {string | null}
 */
const findNextPageUrl = (doc) => {
  // Try Webflow native pagination
  const webflowNext = doc.querySelector('.w-pagination-next');
  if (webflowNext && webflowNext.href) {
    return webflowNext.href;
  }

  // Try fs-attributes pagination
  const fsNext = doc.querySelector('[fs-list-element="pagination-next"]');
  if (fsNext && fsNext.href) {
    return fsNext.href;
  }

  return null;
};

/**
 * Extracts collection list items from a document
 * @param {Document} doc - Document to parse
 * @param {string} listSelector - Selector for the list element
 * @returns {Array<Element>}
 */
export const extractItems = (doc, listSelector) => {
  const listElement = doc.querySelector(listSelector);
  if (!listElement) return [];

  // Get all direct children as items
  return Array.from(listElement.children);
};

/**
 * Fetches all paginated pages and returns all items
 * @param {string} listSelector - CSS selector for the list element
 * @param {boolean} enableCache - Whether to use IndexedDB caching
 * @returns {Promise<{items: Array<Element>, itemsPerPage: number}>}
 */
export const fetchAllPages = async (listSelector, enableCache = true) => {
  const allItems = [];
  let itemsPerPage = 0;
  let db = null;

  // Initialize IndexedDB if caching is enabled
  if (enableCache) {
    try {
      db = await createCacheDB('cms-filters-cache', 1);
    } catch (error) {
      console.warn('IndexedDB not available, using memory cache only');
    }
  }

  // Get initial page items to detect items per page
  const initialListElement = document.querySelector(listSelector);
  if (initialListElement) {
    const initialItems = Array.from(initialListElement.children);
    itemsPerPage = initialItems.length;
    allItems.push(...initialItems);
  }

  // Find the next page URL
  let nextPageUrl = findNextPageUrl(document);

  // Fetch all remaining pages
  const visitedUrls = new Set([window.location.href]);

  while (nextPageUrl && !visitedUrls.has(nextPageUrl)) {
    visitedUrls.add(nextPageUrl);

    const doc = await fetchPage(nextPageUrl, db);
    if (!doc) break;

    // Extract items from this page
    const pageItems = extractItems(doc, listSelector);
    allItems.push(...pageItems);

    // Find next page
    nextPageUrl = findNextPageUrl(doc);
  }

  return {
    items: allItems,
    itemsPerPage: itemsPerPage || 10, // Default to 10 if no items found
  };
};
