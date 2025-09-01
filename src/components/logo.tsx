import { cn } from '@/lib/utils';

// A stylized 'V' logo
export default function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-16 w-16 text-primary", className)}
      {...props}
    >
        <path d="M5.1,3.9h3.2l3.7,10.6L15.7,3.9h3.2l-5.3,16.2h-3.1L5.1,3.9z" />
        <path d="M3.8,3.9h3.2l3.7,10.6L14.4,3.9h3.2l-5.3,16.2h-3.1L3.8,3.9z" opacity="0.5" />
        <path d="M2.5,3.9h3.2l3.7,10.6L13.1,3.9h3.2l-5.3,16.2H7.9L2.5,3.9z" opacity="0.2" />
    </svg>
  );
}
