import React from 'react';
import { Layers, Sprout, Truck, IndianRupee, Users } from 'lucide-react';

export type KpiType = 'projects' | 'proposed' | 'acquired' | 'compensation' | 'families';

interface KpiCardProps {
  type: KpiType;
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down';
  comparisonText?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  type,
  title,
  value,
  trend = '12%',
  trendDirection = 'up',
  comparisonText = 'vs last month',
  onClick
}) => {
  const getIcon = () => {
    switch (type) {
      case 'projects':
        return <Layers size={22} />;
      case 'proposed':
        return <Sprout size={22} />;
      case 'acquired':
        return <Truck size={22} />;
      case 'compensation':
        return <IndianRupee size={22} />;
      case 'families':
        return <Users size={22} />;
      default:
        return <Layers size={22} />;
    }
  };

  const getCardClass = () => {
    switch (type) {
      case 'projects': return 'kpi-card kpi-card-blue';
      case 'proposed': return 'kpi-card kpi-card-green';
      case 'acquired': return 'kpi-card kpi-card-orange';
      case 'compensation': return 'kpi-card kpi-card-purple';
      case 'families': return 'kpi-card kpi-card-cyan';
      default: return 'kpi-card kpi-card-blue';
    }
  };

  const cleanTrend = String(trend).replace('+', '');

  return (
    <div className={getCardClass()} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="kpi-icon-container">
        {getIcon()}
      </div>
      <div className="kpi-content-box">
        <span className="kpi-title">{title}</span>
        <div className="kpi-value-number">{value}</div>
        <div className="kpi-bottom-trend">
          <span>▲ {cleanTrend} {comparisonText}</span>
        </div>
      </div>
    </div>
  );
};
