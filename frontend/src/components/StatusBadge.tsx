import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'project' | 'case' | 'payment' | 'rr';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'case' }) => {
  const getBadgeStyle = () => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'PAID':
      case 'ACQUIRED':
      case 'APPROVED':
      case 'RESETTLED':
      case 'REHABILITATED':
        return { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' };

      case 'IN_PROGRESS':
      case 'PARTIALLY_PAID':
      case 'SURVEY':
      case 'NOTIFICATION':
      case 'POSSESSION':
      case 'IDENTIFIED':
        return { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD' };

      case 'PLANNING':
      case 'INITIATED':
      case 'VALUATION':
      case 'AWARD':
      case 'PENDING':
      case 'ASSESSED':
        return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };

      case 'OBJECTION':
      case 'ON_HOLD':
      case 'DISPUTED':
        return { bg: '#FFEDD5', text: '#C2410C', border: '#FED7AA' };

      case 'REJECTED':
      case 'CANCELLED':
        return { bg: '#FEE2E2', text: '#B91C1C', border: '#FCA5A5' };

      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };
    }
  };

  const style = getBadgeStyle();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.3px',
        textTransform: 'uppercase',
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`
      }}
    >
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: style.text }} />
      {status.replace(/_/g, ' ')}
    </span>
  );
};
