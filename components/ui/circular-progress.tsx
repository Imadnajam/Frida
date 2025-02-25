import { cn } from "@/lib/utils"; // Ensure you have a utility for class names

interface CircularProgressProps {
    className?: string;
    size?: number;
    strokeWidth?: number;
    color?: string;
}

export const CircularProgress = ({
    className,
    size = 24,
    strokeWidth = 3,
    color = "text-blue-500",
}: CircularProgressProps) => {
    return (
        <div
            className={cn(
                "animate-spin rounded-full border-solid border-t-transparent",
                color,
                className
            )}
            style={{
                width: size,
                height: size,
                borderWidth: strokeWidth,
            }}
        />
    );
};