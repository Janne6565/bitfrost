import { useEffect, useState } from "react";


interface BeamProps {
  origin: { x: number; y: number };
  onAnimationEnd: () => void;
}

export default function Beam({ origin, onAnimationEnd }: BeamProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onAnimationEnd();
    }, 200); // Beam Duration 0.2s
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  if (!visible) return null;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const dx = centerX - origin.x;
  const dy = centerY - origin.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div
      style={{
        position: "fixed",
        left: origin.x,
        top: origin.y,
        width: length,
        height: 6,
        background:
          "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
        backgroundSize: "400% 400%",
        transform: `rotate(${angle}deg)`,
        transformOrigin: "left center",
        animation: "beamAnim 0.2s ease-out forwards, rainbow 2s linear infinite",
        zIndex: 2000,
      }}
    >
      <style>
        {`
          @keyframes beamAnim {
            from { width: 0; opacity: 1; }
            to   { width: ${length}px; opacity: 0; }
          }
          @keyframes rainbow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}
      </style>
    </div>
  );
}
