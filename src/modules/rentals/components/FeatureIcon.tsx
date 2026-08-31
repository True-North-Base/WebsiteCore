import type { FeatureIconName } from '../lib/phase2-content'

export function FeatureIcon({ name }: { name: FeatureIconName }) {
  const commonProps = {
    'aria-hidden': true,
    fill: 'none',
    height: 20,
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.6,
    viewBox: '0 0 24 24',
    width: 20,
  }

  if (name === 'home') {
    return (
      <svg {...commonProps}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9.5 21v-6h5v6" />
      </svg>
    )
  }

  if (name === 'wifi') {
    return (
      <svg {...commonProps}>
        <path d="M5 12.55a11 11 0 0 1 14 0" />
        <path d="M2 8.82a16 16 0 0 1 20 0" />
        <path d="M8.5 16.43a6 6 0 0 1 7 0" />
        <path d="M12 20h.01" />
      </svg>
    )
  }

  if (name === 'message') {
    return (
      <svg {...commonProps}>
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-4.2-.9L3 20.5l1.5-4.5A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z" />
      </svg>
    )
  }

  if (name === 'shield') {
    return (
      <svg {...commonProps}>
        <path d="m9 12 2 2 4-4" />
        <path d="M12 3 4 6v6c0 5 3.4 8.3 8 9.5 4.6-1.2 8-4.5 8-9.5V6l-8-3Z" />
      </svg>
    )
  }

  if (name === 'location') {
    return (
      <svg {...commonProps}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    )
  }

  return (
    <svg {...commonProps}>
      <rect height="16" rx="1" width="18" x="3" y="5" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  )
}
