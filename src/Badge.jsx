import * as React from "react";
import { Badge as ShadcnBadge } from "./components/ui/badge";

export const Badge = ({ text, variant }) => {
  // Map Light/Dark variants to shadcn variants
  const shadcnVariant = variant === 'Light' ? 'secondary' : 'default';

  return (
    <ShadcnBadge variant={shadcnVariant}>
      {text}
    </ShadcnBadge>
  );
};
