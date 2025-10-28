import { CMSFilterSearch } from './CMSFilterSearch';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';
import './globals.css';

export default declareComponent(CMSFilterSearch, {
  name: 'CMS Filter Search',
  description: 'Search and filter CMS list items with pagination. Fetches all items across pages and caches them using IndexedDB. Works with Finsweet fs-list-element and fs-list-field attributes.',
  group: 'CMS Filters',
  props: {
    placeholder: props.Text({
      name: "Placeholder",
      description: "Placeholder text for the search input",
      defaultValue: "Search...",
      group: "Search Input",
    }),
    searchFields: props.Text({
      name: "Search Fields",
      description: "Comma-separated list of fs-list-field values to search (e.g., 'name,description'). Leave empty to search all fields.",
      defaultValue: "",
      group: "Search Input",
    }),
    caseSensitive: props.Boolean({
      name: "Case Sensitive",
      description: "Enable case-sensitive search matching",
      defaultValue: false,
      group: "Search Input",
    }),
    accentColor: props.Text({
      name: "Accent Color",
      description: "Color for active page button (e.g., '#007bff', 'blue', 'rgb(0, 123, 255)')",
      defaultValue: "#007bff",
      group: "Styling",
    }),
    borderRadius: props.Text({
      name: "Border Radius",
      description: "Border radius for inputs and buttons (e.g., '4px', '8px', '0.5rem')",
      defaultValue: "4px",
      group: "Styling",
    }),
    enableSlider1: props.Boolean({
      name: "Enable Range Slider 1",
      description: "Show the first range slider filter",
      defaultValue: false,
      group: "Range Slider 1",
    }),
    slider1Field: props.Text({
      name: "Field",
      description: "The fs-list-field attribute value to filter (e.g., 'kcal', 'rating', 'weight')",
      defaultValue: "kcal",
      group: "Range Slider 1",
    }),
    slider1Label: props.Text({
      name: "Label",
      description: "Display label for the slider (e.g., 'Calorie Range', 'Rating')",
      defaultValue: "Calorie Range",
      group: "Range Slider 1",
    }),
    slider1Min: props.Number({
      name: "Min",
      description: "Minimum value for the range slider",
      defaultValue: 0,
      group: "Range Slider 1",
    }),
    slider1Max: props.Number({
      name: "Max",
      description: "Maximum value for the range slider",
      defaultValue: 1000,
      group: "Range Slider 1",
    }),
    slider1Step: props.Number({
      name: "Step",
      description: "Step size for slider adjustments",
      defaultValue: 10,
      group: "Range Slider 1",
    }),
    slider1FormatText: props.Text({
      name: "Format Text",
      description: "Text to display with values (e.g., ' kcal', '$', '%', ' kg')",
      defaultValue: " kcal",
      group: "Range Slider 1",
    }),
    slider1FormatAsPrefix: props.Boolean({
      name: "Format as Prefix",
      description: "Show format text before values (e.g., '$10'). If disabled, shows as suffix (e.g., '10 kcal')",
      defaultValue: false,
      group: "Range Slider 1",
    }),
    enableSlider2: props.Boolean({
      name: "Enable Range Slider 2",
      description: "Show the second range slider filter",
      defaultValue: false,
      group: "Range Slider 2",
    }),
    slider2Field: props.Text({
      name: "Field",
      description: "The fs-list-field attribute value to filter (e.g., 'price', 'distance', 'age')",
      defaultValue: "price",
      group: "Range Slider 2",
    }),
    slider2Label: props.Text({
      name: "Label",
      description: "Display label for the slider (e.g., 'Price Range', 'Distance')",
      defaultValue: "Price Range",
      group: "Range Slider 2",
    }),
    slider2Min: props.Number({
      name: "Min",
      description: "Minimum value for the range slider",
      defaultValue: 0,
      group: "Range Slider 2",
    }),
    slider2Max: props.Number({
      name: "Max",
      description: "Maximum value for the range slider",
      defaultValue: 50,
      group: "Range Slider 2",
    }),
    slider2Step: props.Number({
      name: "Step",
      description: "Step size for slider adjustments",
      defaultValue: 0.5,
      group: "Range Slider 2",
    }),
    slider2FormatText: props.Text({
      name: "Format Text",
      description: "Text to display with values (e.g., '$', '€', '%', ' mi')",
      defaultValue: "$",
      group: "Range Slider 2",
    }),
    slider2FormatAsPrefix: props.Boolean({
      name: "Format as Prefix",
      description: "Show format text before values (e.g., '$10.50'). If disabled, shows as suffix (e.g., '10.50 mi')",
      defaultValue: true,
      group: "Range Slider 2",
    }),
  },
});
