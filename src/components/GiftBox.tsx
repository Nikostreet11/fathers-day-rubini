import React from 'react';

interface GiftBoxProps {
  isOpen: boolean;
  onClick: () => void;
}

export const GiftBox: React.FC<GiftBoxProps> = ({ isOpen, onClick }) => {
  return (
    <div
      className={`gift-container ${isOpen ? 'opened' : ''}`}
      onClick={!isOpen ? onClick : undefined}
    >
      <div className="gift-box">
        <div className="gift-lid">
          <div className="ribbon-loop left"></div>
          <div className="ribbon-loop right"></div>
        </div>
      </div>
      {!isOpen && <div className="gift-text">🎁 Aprimi!</div>}
    </div>
  );
};
