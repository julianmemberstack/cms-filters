import { CMSPagination } from './CMSPagination';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';
import './globals.css';

export default declareComponent(CMSPagination, {
  name: 'CMS Pagination',
  description: 'Pagination controls for CMS Filter Search. Uses localStorage to sync with the filter component. Place this anywhere on the page to show pagination controls.',
  group: 'CMS Filters',
  props: {
    accentColor: props.Text({
      name: "Accent Color",
      description: "Color for active page button (e.g., '#007bff', 'blue', 'rgb(0, 123, 255)')",
      defaultValue: "#007bff",
      group: "Styling",
    }),
    borderRadius: props.Text({
      name: "Border Radius",
      description: "Border radius for buttons (e.g., '4px', '8px', '0.5rem')",
      defaultValue: "4px",
      group: "Styling",
    }),
  },
});
