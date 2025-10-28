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
    }),
    searchFields: props.Text({
      name: "Search Fields",
      description: "Comma-separated list of field identifiers to search (e.g., 'name,description,price'). Leave empty to search all fields.",
      defaultValue: "",
    }),
    caseSensitive: props.Boolean({
      name: "Case Sensitive",
      description: "Enable case-sensitive search matching",
      defaultValue: false,
    }),
    accentColor: props.Text({
      name: "Accent Color",
      description: "Color for active page button (e.g., '#007bff', 'blue', 'rgb(0, 123, 255)')",
      defaultValue: "#007bff",
    }),
    borderRadius: props.Text({
      name: "Border Radius",
      description: "Border radius for inputs and buttons (e.g., '4px', '8px', '0.5rem')",
      defaultValue: "4px",
    }),
    enableCalorieFilter: props.Boolean({
      name: "Enable Calorie Filter",
      description: "Show calorie range slider filter (requires fs-list-field='kcal' on CMS items)",
      defaultValue: false,
    }),
    minCalories: props.Number({
      name: "Min Calories",
      description: "Minimum calorie value for the range slider",
      defaultValue: 0,
    }),
    maxCalories: props.Number({
      name: "Max Calories",
      description: "Maximum calorie value for the range slider",
      defaultValue: 1000,
    }),
    calorieStep: props.Number({
      name: "Calorie Step",
      description: "Step size for calorie slider adjustments",
      defaultValue: 10,
    }),
  },
});
