import { cn } from "@/lib/utils";

export function CityVoiceLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-primary", className)}
    >
      <path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10A10 10 0 0 0 12 2z" />
      <path d="M12 6v1m0 10v1" />
      <path d="M16 8v8" />
      <path d="M8 8v8" />
      <path d="M10 7h4" />
      <path d="M10 17h4" />
    </svg>
  );
}
