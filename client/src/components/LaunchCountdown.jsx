import React, { useState, useEffect } from 'react';
import { ClockIcon, StarIcon } from '@heroicons/react/24/outline';

const LaunchCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isLaunched, setIsLaunched] = useState(false);

  // Launch date: October 1, 2024 at 4:00 PM IST
  const launchDate = new Date('2024-10-01T16:00:00+05:30');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance < 0) {
        setIsLaunched(true);
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLaunched) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 sm:py-4 lg:py-6">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
            <StarIcon className="h-3 w-3 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            <span className="text-xs sm:text-base lg:text-lg font-semibold px-1 sm:px-0">🎉 VCX MART is now LIVE! Start shopping now!</span>
            <StarIcon className="h-3 w-3 sm:h-5 sm:w-5 lg:h-6 lg:w-6 hidden sm:block" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-saffron-500 to-orange-600 text-white py-4 sm:py-5 lg:py-6">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 mb-3 sm:mb-4 lg:mb-6">
            <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            <h2 className="text-base sm:text-xl lg:text-2xl font-bold">Store Opens In</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 max-w-xs sm:max-w-md lg:max-w-lg mx-auto mb-3 sm:mb-4 lg:mb-6">
            <div className="bg-white/20 rounded-lg p-2 sm:p-3 lg:p-4">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold">{timeLeft.days || 0}</div>
              <div className="text-xs sm:text-sm opacity-90">Days</div>
            </div>
            <div className="bg-white/20 rounded-lg p-2 sm:p-3 lg:p-4">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold">{timeLeft.hours || 0}</div>
              <div className="text-xs sm:text-sm opacity-90">Hours</div>
            </div>
            <div className="bg-white/20 rounded-lg p-2 sm:p-3 lg:p-4">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold">{timeLeft.minutes || 0}</div>
              <div className="text-xs sm:text-sm opacity-90">Minutes</div>
            </div>
            <div className="bg-white/20 rounded-lg p-2 sm:p-3 lg:p-4">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold">{timeLeft.seconds || 0}</div>
              <div className="text-xs sm:text-sm opacity-90">Seconds</div>
            </div>
          </div>

          <div className="text-xs sm:text-sm lg:text-base opacity-90 mb-1 sm:mb-2 px-2 sm:px-0">
            Launch Date: October 1, 2024 at 4:00 PM IST
          </div>
          <div className="text-xs sm:text-sm opacity-80 px-2 sm:px-0">
            Register as a seller now and get ready for the launch!
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchCountdown;