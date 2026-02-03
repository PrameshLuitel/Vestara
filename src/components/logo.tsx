import { cn } from '@/lib/utils';

// A stylized 'V' logo
export default function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-16 w-16 text-primary", className)}
      {...props}
    >
        <path d="M5 3L12 21L19 3"/>
    </svg>
  );
}
