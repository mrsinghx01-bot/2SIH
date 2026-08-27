import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateData } from '../types';
import { getStateAsset } from '../utils/stateAssets';

interface MapViewProps {
  states: StateData[];
  selectedStateId?: string;
  onSelectState?: (stateId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  states,
  selectedStateId,
  onSelectState
}) => {
  const navigate = useNavigate();
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Map state paths coordinates in an interactive SVG view
  const statePathMap: Record<string, { d: string; labelX: number; labelY: number }> = {
    'UP': { d: 'M 260 170 L 340 160 L 360 210 L 330 250 L 250 240 L 230 190 Z', labelX: 290, labelY: 200 },
    'MH': { d: 'M 180 290 L 270 280 L 290 350 L 240 400 L 170 370 L 160 320 Z', labelX: 225, labelY: 340 },
    'BR': { d: 'M 350 190 L 420 185 L 415 240 L 355 245 Z', labelX: 385, labelY: 215 },
    'WB': { d: 'M 410 180 L 440 200 L 425 280 L 400 270 L 405 230 Z', labelX: 420, labelY: 240 },
    'TN': { d: 'M 220 460 L 280 470 L 270 540 L 230 560 L 210 500 Z', labelX: 245, labelY: 510 },
    'RJ': { d: 'M 150 160 L 240 175 L 245 250 L 170 270 L 130 210 Z', labelX: 185, labelY: 215 },
    'GJ': { d: 'M 110 240 L 180 245 L 185 300 L 150 330 L 100 300 L 90 260 Z', labelX: 140, labelY: 280 },
    'KA': { d: 'M 180 380 L 230 390 L 225 480 L 185 470 L 175 410 Z', labelX: 205, labelY: 430 },
    'MP': { d: 'M 210 240 L 320 230 L 330 290 L 230 300 Z', labelX: 270, labelY: 265 },
    'AP': { d: 'M 250 360 L 320 370 L 310 450 L 240 460 Z', labelX: 280, labelY: 410 },
    'TS': { d: 'M 230 330 L 290 335 L 285 385 L 235 380 Z', labelX: 260, labelY: 360 },
    'KL': { d: 'M 195 500 L 220 505 L 215 570 L 195 550 Z', labelX: 205, labelY: 535 },
    'OD': { d: 'M 330 270 L 390 280 L 380 340 L 320 330 Z', labelX: 355, labelY: 305 },
    'JH': { d: 'M 345 235 L 400 230 L 395 275 L 340 270 Z', labelX: 370, labelY: 250 },
    'PB': { d: 'M 185 115 L 220 120 L 215 155 L 180 150 Z', labelX: 200, labelY: 135 },
    'HR': { d: 'M 205 135 L 240 140 L 235 175 L 200 170 Z', labelX: 220, labelY: 155 },
    'UK': { d: 'M 250 125 L 285 130 L 275 165 L 245 160 Z', labelX: 265, labelY: 145 },
    'HP': { d: 'M 210 90 L 250 95 L 245 130 L 210 125 Z', labelX: 230, labelY: 110 },
    'JK': { d: 'M 170 40 L 240 45 L 235 100 L 175 95 Z', labelX: 205, labelY: 70 },
    'AS': { d: 'M 460 170 L 520 175 L 515 210 L 455 205 Z', labelX: 490, labelY: 190 }
  };

  const handleMouseMove = (e: React.MouseEvent, state: StateData) => {
    setHoveredState(state);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div style={{ position: 'relative', width: '100%', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '16px', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>National Acquisition GIS Overview</h3>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Interactive Geo-Spatial Map of India</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#475569' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', background: '#2563EB', borderRadius: '2px' }} /> &gt;75% Progress
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', background: '#60A5FA', borderRadius: '2px' }} /> 50-75%
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', background: '#93C5FD', borderRadius: '2px' }} /> &lt;50%
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg
          viewBox="0 0 600 620"
          style={{ width: '100%', maxHeight: '420px' }}
        >
          {/* Subtle Outer India Boundary Silhouette */}
          <path
            d="M 180 30 L 260 40 L 290 80 L 320 140 L 440 150 L 530 160 L 540 220 L 460 230 L 430 290 L 380 350 L 300 480 L 250 580 L 210 560 L 170 420 L 130 320 L 80 270 L 120 180 L 170 110 Z"
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />

          {/* Render State Polygons */}
          {states.map(st => {
            const pathInfo = statePathMap[st.shortName || ''] || statePathMap[st.name.substring(0, 2).toUpperCase()];
            if (!pathInfo) return null;

            const isSelected = selectedStateId === st.id;
            const isHovered = hoveredState?.id === st.id;

            const fillColor = st.acquisitionPercentage >= 75 ? '#2563EB' : st.acquisitionPercentage >= 50 ? '#60A5FA' : '#93C5FD';

            return (
              <g key={st.id}>
                <path
                  d={pathInfo.d}
                  fill={isSelected ? '#1D4ED8' : isHovered ? '#1E40AF' : fillColor}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    filter: isHovered || isSelected ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' : 'none'
                  }}
                  onMouseMove={(e) => handleMouseMove(e, st)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => {
                    if (onSelectState) onSelectState(st.id);
                    else navigate(`/states/${st.id}`);
                  }}
                />
                <text
                  x={pathInfo.labelX}
                  y={pathInfo.labelY}
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="700"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {st.shortName}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredState && (
        <div
          style={{
            position: 'fixed',
            left: tooltipPos.x + 15,
            top: tooltipPos.y - 45,
            background: '#0A192F',
            color: '#FFFFFF',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '13px', color: '#93C5FD' }}>{hoveredState.name}</div>
          <div>Projects: <strong>{hoveredState.projectsCount}</strong></div>
          <div>Acquired: <strong>{hoveredState.landAcquired.toLocaleString('en-IN')} Ha ({hoveredState.acquisitionPercentage}%)</strong></div>
        </div>
      )}
    </div>
  );
};
