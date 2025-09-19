import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-teal-500 to-amber-500 text-white border-none shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-amber-600 dark:from-teal-400 dark:to-amber-400 dark:hover:from-teal-500 dark:hover:to-amber-500",
        "gradient-blue": "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 dark:from-blue-400 dark:to-purple-500 dark:hover:from-blue-500 dark:hover:to-purple-600",
        "gradient-emerald": "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-700 dark:from-emerald-400 dark:to-teal-500",
        primary: "bg-brand-teal text-white hover:bg-brand-teal-dark shadow-md hover:shadow-lg dark:bg-brand-teal-light dark:hover:bg-brand-teal",
        "cart": "bg-gradient-to-r from-teal-500 to-amber-500 text-white shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-amber-600 dark:from-teal-400 dark:to-amber-400 before:absolute before:inset-0 before:bg-white before:opacity-0 before:transition-opacity hover:before:opacity-10",
        "modern": "bg-gradient-to-r from-gray-900 to-gray-700 text-white border border-gray-600 shadow-lg hover:shadow-xl hover:from-gray-800 hover:to-gray-600 dark:from-gray-100 dark:to-gray-300 dark:text-gray-900 dark:border-gray-300 dark:hover:from-gray-200 dark:hover:to-gray-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  animate?: boolean;
  glow?: boolean;
  ripple?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, animate = true, glow = false, ripple = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const buttonClasses = cn(
      buttonVariants({ variant, size }),
      glow && "hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] dark:hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]",
      ripple && "relative overflow-hidden",
      className
    );
    
    if (animate) {
      return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Comp
            className={buttonClasses}
            ref={ref}
            {...props}
          />
        </motion.div>
      );
    }
    
    return (
      <Comp
        className={buttonClasses}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };