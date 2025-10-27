import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { fetchAllPages } from "./utils/fetchPages";

export const CMSFilterSearch = ({
  placeholder = "Search...",
  searchFields = "",
  caseSensitive = false,
  accentColor = "#007bff",
  borderRadius = "4px",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const listElementRef = useRef(null);
  const targetList = '[fs-list-element="list"]';

  // Fetch all pages on mount
  useEffect(() => {
    const loadAllPages = async () => {
      setIsLoading(true);
      try {
        const { items, itemsPerPage: detectedItemsPerPage } =
          await fetchAllPages(targetList, true);

        setAllItems(items);
        setFilteredItems(items);
        setItemsPerPage(detectedItemsPerPage);

        // Find and store the list element reference
        listElementRef.current = document.querySelector(targetList);
      } catch (error) {
        console.error("Error loading CMS pages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllPages();
  }, []);

  // Filter items whenever search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(allItems);
      setCurrentPage(1);
      return;
    }

    const fieldsToSearch = searchFields
      .split(",")
      .map((field) => field.trim())
      .filter((field) => field.length > 0);

    const searchValue = caseSensitive
      ? searchTerm
      : searchTerm.toLowerCase();

    const filtered = allItems.filter((item) => {
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

      return matchFound;
    });

    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, allItems, searchFields, caseSensitive]);

  // Update DOM to show only current page items
  useEffect(() => {
    if (!listElementRef.current || isLoading) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Clear the list
    listElementRef.current.innerHTML = "";

    // Add filtered items for current page
    const pageItems = filteredItems.slice(startIndex, endIndex);
    pageItems.forEach((item) => {
      listElementRef.current.appendChild(item.cloneNode(true));
    });
  }, [filteredItems, currentPage, itemsPerPage, isLoading]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7;

    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, and pages around current
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div
        style={{
          padding: "1em",
          textAlign: "center",
          color: "#666",
          fontSize: "inherit",
          fontFamily: "inherit",
        }}
      >
        Loading all items...
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.5em 1em",
          fontSize: "inherit",
          fontFamily: "inherit",
          border: "1px solid #ccc",
          borderRadius: borderRadius,
          boxSizing: "border-box",
          marginBottom: "1em",
        }}
      />

      {/* Results Info */}
      <div
        style={{
          fontSize: "inherit",
          fontFamily: "inherit",
          color: "#666",
          marginBottom: "1em",
        }}
      >
        Showing {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            gap: "0.5em",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1em",
            flexWrap: "wrap",
          }}
        >
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "0.5em 1em",
              border: "1px solid #ccc",
              borderRadius: borderRadius,
              background: currentPage === 1 ? "#f5f5f5" : "#fff",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: "inherit",
              fontFamily: "inherit",
            }}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  style={{
                    padding: "0.5em",
                    fontSize: "inherit",
                    fontFamily: "inherit",
                  }}
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: "0.5em 0.75em",
                  border: "1px solid #ccc",
                  borderRadius: borderRadius,
                  background: currentPage === page ? accentColor : "#fff",
                  color: currentPage === page ? "#fff" : "#000",
                  cursor: "pointer",
                  fontSize: "inherit",
                  fontFamily: "inherit",
                  minWidth: "2.5em",
                }}
              >
                {page}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            style={{
              padding: "0.5em 1em",
              border: "1px solid #ccc",
              borderRadius: borderRadius,
              background: currentPage === totalPages ? "#f5f5f5" : "#fff",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontSize: "inherit",
              fontFamily: "inherit",
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
