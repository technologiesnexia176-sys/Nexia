import React from 'react';

interface NexiaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export const NexiaLogo: React.FC<NexiaLogoProps> = ({
  size = 'md',
  showText = true,
  textColor = 'text-neutral-900',
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', badge: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', badge: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', badge: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Stylized 'N' icon representing two connected human nodes with an energetic bridge */}
      <div
        className={`${currentSize.icon} relative rounded-xl bg-gradient-to-tr from-violet-700 via-purple-600 to-indigo-500 p-[2px] shadow-sm flex items-center justify-center shrink-0`}
      >
        <div className="w-full h-full bg-white/10 backdrop-blur-xs rounded-[10px] flex items-center justify-center relative overflow-hidden">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5"
          >
            {/* Left Node */}
            <circle cx="10" cy="11" r="3.5" fill="white" />
            <circle cx="10" cy="29" r="3.5" fill="white" />
            {/* Right Node */}
            <circle cx="30" cy="11" r="3.5" fill="white" />
            <circle cx="30" cy="29" r="3.5" fill="white" />

            {/* Left vertical bar */}
            <path
              d="M10 11V29"
              stroke="white"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Right vertical bar */}
            <path
              d="M30 11V29"
              stroke="white"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Dynamic Connecting Diagonal Bar */}
            <path
              d="M10 12L30 28"
              stroke="#FDF2F8"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Central glowing nexus spark */}
            <circle cx="20" cy="20" r="2.2" fill="#F43F5E" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${currentSize.text} ${textColor}`}>
              Nexia
            </span>
          </div>
          <span className="text-[10px] font-medium tracking-wide text-violet-600/90 uppercase">
            Technologies
          </span>
        </div>
      )}
    </div>
  );
};
