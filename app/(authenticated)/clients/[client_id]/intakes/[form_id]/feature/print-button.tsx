"use client";

import type { VariantProps } from "class-variance-authority";
import { Printer } from "lucide-react";
import { Button, type buttonVariants } from "@/components/ui/button";

type PrintButtonProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  fullWidth?: boolean;
};

export const PrintButton = ({
  variant = "outline",
  className,
  fullWidth,
}: PrintButtonProps) => (
  <Button
    type="button"
    variant={variant}
    className={fullWidth ? `w-full ${className ?? ""}` : className}
    onClick={() => window.print()}
  >
    <Printer aria-hidden="true" />
    Imprimir
  </Button>
);
