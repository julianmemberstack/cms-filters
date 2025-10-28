import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { fetchAllPages } from "./utils/fetchPages";
import { Input } from "./components/ui/input";
import { Slider } from "./components/ui/slider";

const STORAGE_KEY = "cms-pagination-state";

export const CMSFilterSearch = ({
  placeholder = "Search...",
  searchFields = "",
  caseSensitive = false,
  accentColor = "#007bff",
  borderRadius = "4px",
  enableSlider1 = false,
  slider1Field = "kcal",
  slider1Label = "Calorie Range",
  slider1Min = 0,
  slider1Max = 1000,
  slider1Step = 10,
  slider1FormatText = " kcal",
  slider1FormatAsPrefix = false,
  enableSlider2 = false,
  slider2Field = "price",
  slider2Label = "Price Range",
  slider2Min = 0,
  slider2Max = 50,
  slider2Step = 0.5,
  slider2FormatText = "$",
  slider2FormatAsPrefix = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [slider1Range, setSlider1Range] = useState([slider1Min, slider1Max]);
  const [slider2Range, setSlider2Range] = useState([slider2Min, slider2Max]);
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

  // Filter items whenever search term or calorie range changes
  useEffect(() => {
    const fieldsToSearch = searchFields
      .split(",")
      .map((field) => field.trim())
      .filter((field) => field.length > 0);

    const searchValue = caseSensitive
      ? searchTerm
      : searchTerm.toLowerCase();

    const filtered = allItems.filter((item) => {
      // Text search filter
      let textMatchFound = !searchTerm.trim(); // If no search term, all items match text filter

      if (searchTerm.trim()) {
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
                textMatchFound = true;
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
              textMatchFound = true;
            }
          });
        }
      }

      // Range Slider 1 filter
      let slider1MatchFound = true; // If filter disabled, all items match
      if (enableSlider1) {
        const slider1Element = item.querySelector(`[fs-list-field="${slider1Field}"]`);
        if (slider1Element) {
          const slider1Text = slider1Element.textContent || "";
          const slider1Value = parseFloat(slider1Text.replace(/[^0-9.]/g, ""));

          if (!isNaN(slider1Value)) {
            slider1MatchFound = slider1Value >= slider1Range[0] && slider1Value <= slider1Range[1];
          }
        }
      }

      // Range Slider 2 filter
      let slider2MatchFound = true; // If filter disabled, all items match
      if (enableSlider2) {
        const slider2Element = item.querySelector(`[fs-list-field="${slider2Field}"]`);
        if (slider2Element) {
          const slider2Text = slider2Element.textContent || "";
          const slider2Value = parseFloat(slider2Text.replace(/[^0-9.]/g, ""));

          if (!isNaN(slider2Value)) {
            slider2MatchFound = slider2Value >= slider2Range[0] && slider2Value <= slider2Range[1];
          }
        }
      }

      return textMatchFound && slider1MatchFound && slider2MatchFound;
    });

    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, slider1Range, slider2Range, allItems, searchFields, caseSensitive, enableSlider1, enableSlider2, slider1Field, slider2Field]);

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

  // Sync pagination state to localStorage
  useEffect(() => {
    if (isLoading) return;

    const paginationState = {
      totalItems: filteredItems.length,
      itemsPerPage,
      currentPage,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(paginationState));
      // Dispatch custom event to notify pagination component in same window
      window.dispatchEvent(new CustomEvent("cms-pagination-update"));
    } catch (error) {
      console.error("Error writing pagination state to localStorage:", error);
    }
  }, [filteredItems.length, itemsPerPage, currentPage, isLoading]);

  // Listen for page changes from pagination component
  useEffect(() => {
    const handlePaginationChange = (event) => {
      const { currentPage: newPage } = event.detail;
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    };

    window.addEventListener("cms-pagination-change", handlePaginationChange);

    return () => {
      window.removeEventListener("cms-pagination-change", handlePaginationChange);
    };
  }, [currentPage]);

  // Convert hex color to HSL for CSS variable, or pass through CSS variables
  const processColor = (color) => {
    // If it's already a CSS variable, return it as-is
    if (color.trim().startsWith('var(')) {
      return color;
    }

    // If it's a hex color, convert to HSL
    if (color.startsWith('#')) {
      let hex = color.replace(/^#/, '');

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
    }

    // If it's neither, assume it's already in HSL format or another valid CSS value
    return color;
  };

  // Create style object with CSS variables
  const customStyles = {
    '--primary': processColor(accentColor),
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

      {/* Range Slider 1 */}
      {enableSlider1 && (
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">{slider1Label}</label>
            <span className="text-sm text-muted-foreground">
              {slider1FormatAsPrefix ? `${slider1FormatText}${slider1Range[0]}` : `${slider1Range[0]}${slider1FormatText}`} - {slider1FormatAsPrefix ? `${slider1FormatText}${slider1Range[1]}` : `${slider1Range[1]}${slider1FormatText}`}
            </span>
          </div>
          <Slider
            min={slider1Min}
            max={slider1Max}
            step={slider1Step}
            value={slider1Range}
            onValueChange={setSlider1Range}
            className="w-full"
          />
        </div>
      )}

      {/* Range Slider 2 */}
      {enableSlider2 && (
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">{slider2Label}</label>
            <span className="text-sm text-muted-foreground">
              {slider2FormatAsPrefix ? `${slider2FormatText}${slider2Range[0].toFixed(2)}` : `${slider2Range[0].toFixed(2)}${slider2FormatText}`} - {slider2FormatAsPrefix ? `${slider2FormatText}${slider2Range[1].toFixed(2)}` : `${slider2Range[1].toFixed(2)}${slider2FormatText}`}
            </span>
          </div>
          <Slider
            min={slider2Min}
            max={slider2Max}
            step={slider2Step}
            value={slider2Range}
            onValueChange={setSlider2Range}
            className="w-full"
          />
        </div>
      )}

      {/* Results Info */}
      <div className="text-muted-foreground mb-4">
        Showing {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};
