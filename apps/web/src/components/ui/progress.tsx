import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion } from "framer-motion";

import { cn } from "../../lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    animate?: boolean;
    showValue?: boolean;
    valueLabel?: string;
  }
>(({ className, value, animate = true, showValue = false, valueLabel, ...props }, ref) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (animate && value !== undefined && value !== null) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else if (value !== undefined && value !== null) {
      setDisplayValue(value);
    }
  }, [value, animate]);

  return (
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-secondary/20",
          className
        )}
        {...props}
      >
        {animate ? (
          <motion.div
            className="h-full w-full flex items-center justify-center bg-gradient-to-r from-brand-blue to-brand-purple"
            initial={{ width: 0 }}
            animate={{ width: `${displayValue}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ) : (
          <ProgressPrimitive.Indicator
            className="h-full w-full flex items-center justify-center bg-gradient-to-r from-brand-blue to-brand-purple"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
          />
        )}
      </ProgressPrimitive.Root>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
          {valueLabel ? valueLabel : `${Math.round(displayValue)}%`}
        </div>
      )}
    </div>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };