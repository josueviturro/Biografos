// --- Logo SVG basado en la imagen del negocio (triángulo en dorado) ---

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 500 500"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M250 50 L450 450 H50 L250 50Z" fill="var(--color-gold)" />
      <path
        d="M380 450 C380 350 300 300 250 300 C200 300 120 350 120 450"
        stroke="var(--color-black)"
        strokeWidth="30"
      />
      <path
        d="M300 300 C300 250 250 220 200 220 C150 220 100 250 100 300"
        stroke="var(--color-black)"
        strokeWidth="30"
      />
    </svg>
  );
}
