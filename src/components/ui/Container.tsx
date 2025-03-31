
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  size?: "default" | "sm" | "lg" | "xl" | "full";
}

export function Container({
  children,
  className,
  as: Component = "div",
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-4",
        {
          "max-w-screen-2xl": size === "xl",
          "max-w-screen-xl": size === "lg",
          "max-w-screen-md": size === "sm",
          "max-w-7xl": size === "default",
          "max-w-none": size === "full",
        },
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
