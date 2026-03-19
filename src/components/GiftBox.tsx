import React from 'react';
import { motion } from 'framer-motion';
import { SITE_CONFIG } from '../config';

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
      {!isOpen && (
        <motion.div
          className="gift-text"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {SITE_CONFIG.testoBottoneRegalo}
        </motion.div>
      )}
    </div>
  );
};
