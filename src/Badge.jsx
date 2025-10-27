import * as React from "react";
import { Badge as ShadcnBadge } from "./components/ui/badge";

export const Badge = ({
  text,
  variant,
  accentColor = "#007bff",
  borderRadius = "4px"
}) => {
  // Map Light/Dark variants to shadcn variants
  const shadcnVariant = variant === 'Light' ? 'secondary' : 'default';

  // Convert hex color to HSL for CSS variable
  const hexToHSL = (hex) => {
    hex = hex.replace(/^#/, '');
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

  const customStyles = {
    '--primary': hexToHSL(accentColor),
    '--primary-foreground': '0 0% 100%',
    '--radius': borderRadius,
  };

  return (
    <span style={customStyles}>
      <ShadcnBadge variant={shadcnVariant}>
        {text}
      </ShadcnBadge>
    </span>
  );
};
