"use client";

import { useState, useRef, useEffect } from "react";

export const useTooltip = () => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement | null>(null);

  const show = (event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setCoords({ x: rect.right + 8, y: rect.top + rect.height / 2 });
    setVisible(true);
  };

  const hide = () => setVisible(false);

  useEffect(() => {
    const handleScroll = () => setVisible(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const Tooltip = ({ message }: { message: string }) =>
    visible ? (
      <div
        ref={ref}
        className="fixed z-50 px-3 py-2 text-sm font-medium text-white bg-[#131920] border border-[#1E2938] rounded-2xl shadow-lg max-w-[220px] animate-fade-in"
        style={{
          top: coords.y,
          left: coords.x,
          transform: "translateY(-50%)",
        }}
      >
        {message}
        <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-[#1b2a38]" />
      </div>
    ) : null;

  return { show, hide, Tooltip };
};
