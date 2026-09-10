import { useMemo } from 'react';

export function Background() {
  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 8,
        duration: Math.random() * 10 + 10,
      })),
    []
  );

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" style={{ contain: 'strict' }}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020408] via-[#040810]/80 to-[#020408]" />

      {/* Block grid */}
      <div className="absolute inset-0 block-grid-bg opacity-40" />

      {/* Background image - foydalanuvchi oz rasmini qo'shadi */}
      <img
        src={`${import.meta.env.BASE_URL}mc-bg.jpg`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        loading="eager"
        decoding="async"
      />

      {/* Glow orbs - ko'k rang */}
      <div className="absolute top-[-8%] left-[10%] w-[350px] h-[350px] rounded-full bg-primary-600/10 blur-[100px]" />
      <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-secondary-500/8 blur-[90px]" />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
