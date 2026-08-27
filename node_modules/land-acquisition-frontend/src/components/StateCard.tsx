import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, MapPin, Pickaxe, ArrowRight } from 'lucide-react';
import { StateData } from '../types';
import { getStateAsset } from '../utils/stateAssets';
import { ProgressRing } from './ProgressRing';

interface StateCardProps {
  state: StateData;
}

export const StateCard: React.FC<StateCardProps> = ({ state }) => {
  const navigate = useNavigate();
  const asset = getStateAsset(state.shortName || state.name);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleClick = () => {
    navigate(`/states/${state.id}`);
  };

  const formatHa = (num: number) => {
    return Number(num || 0).toLocaleString('en-IN') + ' Ha';
  };

  return (
    <div className="state-card" onClick={handleClick}>
      {/* Top Landmark Monument Photograph Section */}
      <div className="state-card-top-landmark" style={{ background: asset.bgGradient }}>
        <img
          src={asset.imageUrl}
          alt={`${state.name} Landmark - ${asset.landmarkTitle}`}
          className="landmark-photo-img"
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          style={{
            opacity: imgLoaded ? 1 : 0.4,
            transition: 'opacity 0.3s ease'
          }}
        />

        {/* Subtle Bottom Wave Gradient Overlay */}
        <div className="landmark-wave-overlay" />

        {/* Small Geographic Vector Map Outline of State with Crisp White Border */}
        <div className="state-map-outline-container" title={`${state.name} Geographic Map Outline`}>
          <svg viewBox="0 0 100 100" className="state-map-outline-svg">
            <path
              d={asset.mapOutlineSvg}
              fill={asset.mapFillColor}
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.45))' }}
            />
          </svg>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="state-card-bottom-info">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h3 className="state-card-name" style={{ margin: 0 }}>{state.name}</h3>
          <span style={{ fontSize: '11px', fontWeight: 700, background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '4px' }}>
            {state.shortName}
          </span>
        </div>

        <div className="state-card-body-row">
          <div className="state-metrics-list">
            <div className="metric-item">
              <div className="metric-icon-box metric-icon-blue">
                <Folder size={12} />
              </div>
              <span className="metric-text-label">Project:</span>
              <strong className="metric-text-val">{state.projectsCount}</strong>
            </div>

            <div className="metric-item">
              <div className="metric-icon-box metric-icon-cyan">
                <MapPin size={12} />
              </div>
              <span className="metric-text-label">Land Proposed:</span>
              <strong className="metric-text-val">{formatHa(state.landProposed)}</strong>
            </div>

            <div className="metric-item">
              <div className="metric-icon-box metric-icon-green">
                <Pickaxe size={12} />
              </div>
              <span className="metric-text-label">Acquired:</span>
              <strong className="metric-text-val">{formatHa(state.landAcquired)}</strong>
            </div>
          </div>

          {/* Circular Progress Ring */}
          <div className="state-progress-col">
            <ProgressRing
              percentage={state.acquisitionPercentage}
              size={56}
              strokeWidth={5}
              color="#10B981"
            />
          </div>
        </div>

        {/* Centered Soft Blue Pill Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button
            className="view-state-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            View State <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
