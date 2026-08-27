import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, MapPin, Pickaxe, ArrowRight } from 'lucide-react';
import { StateData } from '../types';
import { getStateAsset } from '../utils/stateAssets';
import { ProgressRing } from './ProgressRing';

interface UTCardProps {
  ut: StateData;
}

export const UTCard: React.FC<UTCardProps> = ({ ut }) => {
  const navigate = useNavigate();
  const asset = getStateAsset(ut.shortName || ut.name);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleClick = () => {
    navigate(`/states/${ut.id}`);
  };

  const displayName = ut.name.includes('(UT)') ? ut.name : `${ut.name} (UT)`;

  return (
    <div className="ut-compact-card" onClick={handleClick}>
      {/* Left: Landmark Photo */}
      <div className="ut-landmark-thumb" style={{ background: asset.bgGradient }}>
        <img
          src={asset.imageUrl}
          alt={`${ut.name} Landmark - ${asset.landmarkTitle}`}
          className="ut-landmark-img"
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          style={{
            opacity: imgLoaded ? 1 : 0.4,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>

      {/* Middle: Details */}
      <div className="ut-info-block">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 className="ut-name-title">{displayName}</h4>
          {/* Small Geographic Vector Map Outline of UT */}
          <svg viewBox="0 0 100 100" style={{ width: '28px', height: '28px' }}>
            <path
              d={asset.mapOutlineSvg}
              fill={asset.mapFillColor}
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.35))' }}
            />
          </svg>
        </div>

        <div className="ut-metrics-list">
          <div className="metric-item-sm">
            <span className="metric-icon-box metric-icon-blue"><Folder size={10} /></span>
            <span>Project: <strong>{ut.projectsCount}</strong></span>
          </div>
          <div className="metric-item-sm">
            <span className="metric-icon-box metric-icon-cyan"><MapPin size={10} /></span>
            <span>Land Proposed: <strong>{Number(ut.landProposed).toLocaleString('en-IN')} Ha</strong></span>
          </div>
          <div className="metric-item-sm">
            <span className="metric-icon-box metric-icon-green"><Pickaxe size={10} /></span>
            <span>Acquired: <strong>{Number(ut.landAcquired).toLocaleString('en-IN')} Ha</strong></span>
          </div>
        </div>

        <div className="ut-footer-row">
          <button
            className="view-state-btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            View State <ArrowRight size={11} />
          </button>
          <ProgressRing
            percentage={ut.acquisitionPercentage}
            size={38}
            strokeWidth={4}
            color="#10B981"
          />
        </div>
      </div>
    </div>
  );
};
