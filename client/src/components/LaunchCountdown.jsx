import React, { useState, useEffect } from "react";
import { ClockIcon, StarIcon } from "@heroicons/react/24/outline";

const LaunchCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isLaunched, setIsLaunched] = useState(false);

  // Launch date: October 1, 2025 at 12:00 AM IST
  const launchDate = new Date("2025-10-01T00:00:00+05:30");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance < 0) {
        setIsLaunched(true);
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLaunched) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-0.5 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <StarIcon className="h-2.5 w-2.5" />
            <span className="text-xs font-medium">
              🎉 VCX MART is LIVE! Start shopping now!
            </span>
            <StarIcon className="h-2.5 w-2.5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center py-1 gap-3 sm:gap-4">
          {/* Clock Icon */}
          <ClockIcon className="h-3.5 w-3.5 text-white/90" />

          {/* Timer */}
          <div className="flex items-center gap-1">
            <div className="bg-white/20 rounded px-1.5 py-0.5 min-w-[1.75rem] text-center">
              <div className="text-xs font-bold leading-none">
                {timeLeft.days || 0}
              </div>
              <div className="text-[8px] leading-none mt-0.5 font-medium">
                d
              </div>
            </div>
            <span className="text-white/40">:</span>
            <div className="bg-white/20 rounded px-1.5 py-0.5 min-w-[1.75rem] text-center">
              <div className="text-xs font-bold leading-none">
                {timeLeft.hours || 0}
              </div>
              <div className="text-[8px] leading-none mt-0.5 font-medium">
                h
              </div>
            </div>
            <span className="text-white/40">:</span>
            <div className="bg-white/20 rounded px-1.5 py-0.5 min-w-[1.75rem] text-center">
              <div className="text-xs font-bold leading-none">
                {timeLeft.minutes || 0}
              </div>
              <div className="text-[8px] leading-none mt-0.5 font-medium">
                m
              </div>
            </div>
            <span className="text-white/40">:</span>
            <div className="bg-white/20 rounded px-1.5 py-0.5 min-w-[1.75rem] text-center">
              <div className="text-xs font-bold leading-none">
                {timeLeft.seconds || 0}
              </div>
              <div className="text-[8px] leading-none mt-0.5 font-medium">
                s
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-white/20"></div>

          {/* Become a Seller */}
          <a href="/become-seller" className="group flex items-center gap-2">
            <span className="text-xs font-medium whitespace-nowrap">
              Become a Seller
            </span>
            <span className="text-[10px] text-white/80 whitespace-nowrap hidden sm:inline">
              To sell your Products
            </span>
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <span className="text-[10px] transform group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LaunchCountdown;
