import { type ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  reveal?: boolean;
  delay?: number;
  onClick?: () => void;
};

export function GlassCard({ children, className = '', reveal = false, delay = 0, onClick }: GlassCardProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`glass-card p-6 ${reveal ? (visible ? 'reveal active' : 'reveal') : ''} ${className}`}
      style={reveal ? { transitionDelay: `${delay}ms` } : undefined}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
