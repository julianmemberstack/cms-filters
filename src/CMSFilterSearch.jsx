import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { fetchAllPages } from "./utils/fetchPages";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

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

  // Convert hex color to HSL for CSS variable
  const hexToHSL = (hex) => {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
  };

  // Create style object with CSS variables
  const customStyles = {
    '--primary': hexToHSL(accentColor),
    '--primary-foreground': '0 0% 100%',
    '--radius': borderRadius,
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading all items...
      </div>
    );
  }

  return (
    <div className="w-full" style={customStyles}>
      {/* Search Input */}
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="mb-4"
      />

      {/* Results Info */}
      <div className="text-muted-foreground mb-4">
        Showing {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex gap-2 items-center justify-center mt-4 flex-wrap">
          {/* Previous Button */}
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2"
                >
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "outline"}
                className="min-w-10"
              >
                {page}
              </Button>
            );
          })}

          {/* Next Button */}
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
