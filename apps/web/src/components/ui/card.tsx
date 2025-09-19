import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    animate?: boolean;
    glass?: boolean;
    hoverEffect?: "scale" | "glow" | "scale-glow" | "none";
    initial?: any;
    whileInView?: any;
    transition?: any;
    viewport?: any;
  }
>(({ className, animate = true, glass = false, hoverEffect = "none", initial, whileInView, transition, viewport, ...props }, ref) => {
  const baseClasses = cn(
    "rounded-lg border bg-card text-card-foreground shadow-sm",
    glass && "glass-card",
    className
  );

  const getHoverClasses = () => {
    switch (hoverEffect) {
      case "scale":
        return "hover-scale";
      case "glow":
        return "hover-glow";
      case "scale-glow":
        return "hover-scale hover-glow";
      default:
        return "";
    }
  };

  // Separate motion props from HTML props
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, onAnimationEnd, onAnimationIteration, ...htmlProps } = props;

  if (animate) {
    return (
      <motion.div
        ref={ref}
        className={cn(baseClasses, getHoverClasses())}
        initial={initial || { opacity: 0, y: 20 }}
        animate={whileInView ? undefined : { opacity: 1, y: 0 }}
        whileInView={whileInView}
        transition={transition || { duration: 0.3 }}
        viewport={viewport}
        {...htmlProps}
      />
    );
  }

  return <div ref={ref} className={cn(baseClasses, getHoverClasses())} {...props} />;
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };