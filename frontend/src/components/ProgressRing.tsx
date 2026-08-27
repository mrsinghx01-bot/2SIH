import React from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showText?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 48,
  strokeWidth = 4.5,
  color = '#2563EB',
  showText = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePercentage = Math.min(100, Math.max(0, percentage || 0));
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  return (
    <div className="progress-ring-container" style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} className="progress-ring-svg">
        <circle
          className="progress-ring-bg"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className="progress-ring-stroke"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
      </svg>
      {showText && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size < 50 ? '11px' : '13px',
            fontWeight: 700,
            color: '#0F172A'
          }}
        >
          {safePercentage}%
        </div>
      )}
    </div>
  );
};
