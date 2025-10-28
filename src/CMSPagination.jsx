import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

const STORAGE_KEY = "cms-pagination-state";

export const CMSPagination = ({
  accentColor = "#007bff",
  borderRadius = "4px",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Read pagination state from localStorage
  useEffect(() => {
    const loadPaginationState = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { totalItems, itemsPerPage, currentPage: storedPage } = JSON.parse(stored);
          const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
          setTotalPages(calculatedTotalPages);
          setCurrentPage(storedPage || 1);
        }
      } catch (error) {
        console.error("Error reading pagination state from localStorage:", error);
      }
    };

    // Initial load
    loadPaginationState();

    // Listen for changes from the filter component
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        loadPaginationState();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom event for same-window updates
    const handleCustomEvent = () => {
      loadPaginationState();
    };
    window.addEventListener("cms-pagination-update", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cms-pagination-update", handleCustomEvent);
    };
  }, []);

  // Update localStorage when current page changes
  const handlePageChange = (newPage) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state = JSON.parse(stored);
        state.currentPage = newPage;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

        // Dispatch custom event to notify filter component
        window.dispatchEvent(new CustomEvent("cms-pagination-change", { detail: { currentPage: newPage } }));
      }
      setCurrentPage(newPage);
    } catch (error) {
      console.error("Error updating pagination state in localStorage:", error);
    }
  };

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

  // Convert any color format to HSL for CSS variable
  const processColor = (color) => {
    // Helper function to convert RGB to HSL
    const rgbToHSL = (r, g, b) => {
      r /= 255;
      g /= 255;
      b /= 255;

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

    // If it's a CSS variable, we need to resolve it
    if (color.trim().startsWith('var(')) {
      try {
        // Create a temporary element to compute the variable value
        const tempDiv = document.createElement('div');
        tempDiv.style.color = color;
        document.body.appendChild(tempDiv);
        const computedColor = window.getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);

        // Parse the computed RGB color
        const rgbMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1]);
          const g = parseInt(rgbMatch[2]);
          const b = parseInt(rgbMatch[3]);
          return rgbToHSL(r, g, b);
        }
      } catch (e) {
        console.warn('Failed to resolve CSS variable:', color);
      }
    }

    // If it's a hex color, convert to HSL
    if (color.startsWith('#')) {
      let hex = color.replace(/^#/, '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return rgbToHSL(r, g, b);
    }

    // If it's already in HSL format or another valid CSS value, return as-is
    return color;
  };

  // Create style object with CSS variables
  const customStyles = {
    '--primary': processColor(accentColor),
    '--primary-foreground': '0 0% 100%',
    '--radius': borderRadius,
  };

  // Don't render if only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="w-full" style={customStyles}>
      <div className="flex gap-2 items-center justify-center mt-4 flex-wrap">
        {/* Previous Button */}
        <Button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
              onClick={() => handlePageChange(page)}
              variant={currentPage === page ? "default" : "outline"}
              className="min-w-10"
            >
              {page}
            </Button>
          );
        })}

        {/* Next Button */}
        <Button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
