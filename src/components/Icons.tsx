import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function BaseIcon({ size = 20, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return <BaseIcon {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.3-3.3" /></BaseIcon>;
}

export function UserIcon(props: IconProps) {
  return <BaseIcon {...props}><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></BaseIcon>;
}

export function WhatsAppIcon(props: IconProps) {
  return <BaseIcon {...props}><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 20.5 11.7Z" /><path d="M8.2 7.9c.3-.6.6-.6 1-.6h.2c.3 0 .5.1.7.6l.8 1.8c.1.3.1.5-.1.8l-.6.8c-.2.2-.2.4 0 .7.7 1.2 1.7 2.2 3 2.9.3.2.5.1.7-.1l.9-1.1c.2-.3.5-.3.8-.2l1.9.9c.3.1.5.3.5.6-.1.8-.4 1.5-1 2-.5.5-1.3.8-2.2.7-1.1-.1-2.5-.5-4.2-1.5-2.3-1.4-4-3.3-4.8-5.2-.4-.9-.5-1.8-.2-2.5.1-.3.3-.5.6-.6Z" /></BaseIcon>;
}

export function BasketIcon(props: IconProps) {
  return <BaseIcon {...props}><path d="M5 10h14l-1.2 10H6.2L5 10Z" /><path d="m8 10 4-6 4 6" /><path d="M9 14v3M12 14v3M15 14v3" /></BaseIcon>;
}

export function StoreIcon(props: IconProps) {
  return <BaseIcon {...props}><path d="M4 10v10h16V10" /><path d="M3 10h18l-2-6H5l-2 6Z" /><path d="M8 20v-6h8v6" /></BaseIcon>;
}

export function BoxIcon(props: IconProps) {
  return <BaseIcon {...props}><path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" /><path d="M4 7.5V17l8 4 8-4V7.5" /><path d="M12 12v9" /></BaseIcon>;
}

export function ClipboardIcon(props: IconProps) {
  return <BaseIcon {...props}><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4.5V3h6v1.5M9 9h6M9 13h6M9 17h4" /></BaseIcon>;
}

export function PinIcon(props: IconProps) {
  return <BaseIcon {...props}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></BaseIcon>;
}

export function PhoneIcon(props: IconProps) {
  return <BaseIcon {...props}><path d="M6.6 3.5 9 7.8 7.4 9.4c1.2 2.5 3.1 4.4 5.6 5.6l1.6-1.6 4.3 2.4c.5.3.7.8.5 1.4-.7 2-2.2 3-4.2 2.8C9.3 19.4 4.6 14.7 4 8.8c-.2-2 1-3.5 2.8-4.2.6-.2 1.1 0 1.4.5Z" /></BaseIcon>;
}

export function ClockIcon(props: IconProps) {
  return <BaseIcon {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></BaseIcon>;
}

export function CardIcon(props: IconProps) {
  return <BaseIcon {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></BaseIcon>;
}

export function SparkIcon(props: IconProps) {
  return <BaseIcon {...props}><path d="M12 2c.7 5.4 3.6 8.3 9 9-5.4.7-8.3 3.6-9 9-.7-5.4-3.6-8.3-9-9 5.4-.7 8.3-3.6 9-9Z" /></BaseIcon>;
}
