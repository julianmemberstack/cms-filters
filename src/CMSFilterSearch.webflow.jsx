import { CMSFilterSearch } from './CMSFilterSearch';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(CMSFilterSearch, {
  name: 'CMS Filter Search',
  description: 'Search and filter CMS list items by specified fields. Works with Finsweet fs-list-element and fs-list-field attributes.',
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
    targetList: props.Text({
      name: "Target List Selector",
      description: "CSS selector for the list to filter",
      defaultValue: '[fs-list-element="list"]',
    }),
    caseSensitive: props.Boolean({
      name: "Case Sensitive",
      description: "Enable case-sensitive search matching",
      defaultValue: false,
    }),
  },
});
