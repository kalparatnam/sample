import { useEffect, useState } from 'react';

export const Meteors = ({ number = 20 }: { number?: number }) => {
  const [meteors, setMeteors] = useState<any[]>([]);

  useEffect(() => {
    const generated = [...new Array(number)].map(() => ({
      id: Math.random(),
      left: Math.floor(Math.random() * 100) + 'vw',
      top: Math.floor(Math.random() * 100) + 'vh',
      animationDuration: Math.floor(Math.random() * 8 + 2) + 's',
      animationDelay: Math.floor(Math.random() * 2 + 0.5) + 's',
    }));
    setMeteors(generated);
  }, [number]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          style={{
            position: 'absolute',
            top: meteor.top,
            left: meteor.left,
            width: '2px',
            height: '2px',
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: '9999px',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 0 0 2px rgba(255,255,255,0.05)',
            transform: 'rotate(215deg)',
            animation: `meteor ${meteor.animationDuration} linear infinite`,
            animationDelay: meteor.animationDelay,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '50px',
              height: '1px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.8), transparent)',
            }}
          />
        </span>
      ))}
      <style>{`
        @keyframes meteor {
          0% { transform: rotate(215deg) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: rotate(215deg) translateX(-1000px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
