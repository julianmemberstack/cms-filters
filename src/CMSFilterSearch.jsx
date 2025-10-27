import * as React from "react";
import { useEffect, useState } from "react";

export const CMSFilterSearch = ({
  placeholder = "Search...",
  searchFields = "",
  targetList = '[fs-list-element="list"]',
  caseSensitive = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Find the target list element
    const listElement = document.querySelector(targetList);
    if (!listElement) return;

    // Get all direct children of the list (the items)
    const items = Array.from(listElement.children);

    // Parse the searchFields prop into an array
    const fieldsToSearch = searchFields
      .split(",")
      .map((field) => field.trim())
      .filter((field) => field.length > 0);

    // If no search term, show all items
    if (!searchTerm.trim()) {
      items.forEach((item) => {
        item.style.display = "";
      });
      return;
    }

    // Prepare search term based on case sensitivity
    const searchValue = caseSensitive
      ? searchTerm
      : searchTerm.toLowerCase();

    // Filter items
    items.forEach((item) => {
      let matchFound = false;

      // Search through specified fields only
      if (fieldsToSearch.length > 0) {
        fieldsToSearch.forEach((fieldIdentifier) => {
          const fieldElements = item.querySelectorAll(
            `[fs-list-field="${fieldIdentifier}"]`
          );

          fieldElements.forEach((fieldElement) => {
            const fieldText = fieldElement.textContent || "";
            const textToSearch = caseSensitive
              ? fieldText
              : fieldText.toLowerCase();

            if (textToSearch.includes(searchValue)) {
              matchFound = true;
            }
          });
        });
      } else {
        // If no specific fields specified, search all fs-list-field elements
        const allFieldElements = item.querySelectorAll("[fs-list-field]");
        allFieldElements.forEach((fieldElement) => {
          const fieldText = fieldElement.textContent || "";
          const textToSearch = caseSensitive
            ? fieldText
            : fieldText.toLowerCase();

          if (textToSearch.includes(searchValue)) {
            matchFound = true;
          }
        });
      }

      // Show or hide the item based on match
      item.style.display = matchFound ? "" : "none";
    });
  }, [searchTerm, targetList, searchFields, caseSensitive]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "0.5em 1em",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxSizing: "border-box",
      }}
    />
  );
};
