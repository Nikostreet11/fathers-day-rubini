import React from 'react';
import { motion } from 'framer-motion';

// SVG icons for Father's Day
const icons = [
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M7 2L10 6L7 10L10 22H14L17 10L14 6L17 2H7Z"/></svg>,
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M2 15C2 15 5 13 8 13C11 13 12 15 12 15C12 15 13 13 16 13C19 13 22 15 22 15C22 15 20 18 16 18C12 18 12 15 12 15C12 15 12 18 8 18C4 18 2 15 2 15Z"/></svg>,
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M22 14C22 16.2091 20.2091 18 18 18C15.7909 18 14 16.2091 14 14C14 13.9142 14.0027 13.8291 14.008 13.7447C13.435 13.5702 12.7562 13.5 12 13.5C11.2438 13.5 10.565 13.5702 9.99196 13.7447C9.99729 13.8291 10 13.9142 10 14C10 16.2091 8.20914 18 6 18C3.79086 18 2 16.2091 2 14C2 11.7909 3.79086 10 6 10C8.01956 10 9.69188 11.4952 9.9575 13.4393C10.5401 13.1558 11.2338 13 12 13C12.7662 13 13.4599 13.1558 14.0425 13.4393C14.3081 11.4952 15.9804 10 18 10C20.2091 10 22 11.7909 22 14ZM18 12C16.8954 12 16 12.8954 16 14C16 15.1046 16.8954 16 18 16C19.1046 16 20 15.1046 20 14C20 12.8954 19.1046 12 18 12ZM6 12C4.89543 12 4 12.8954 4 14C4 15.1046 4.89543 16 6 16C7.10457 16 8 15.1046 8 14C8 12.8954 7.10457 12 6 12Z"/></svg>,
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M4 3H18V14C18 16.2091 16.2091 18 14 18H8C5.79086 18 4 16.2091 4 14V3ZM6 5V14C6 15.1046 6.89543 16 8 16H14C15.1046 16 16 15.1046 16 14V5H6ZM18 5H20C21.1046 5 22 5.89543 22 7V10C22 11.1046 21.1046 12 20 12H18V5ZM20 7V10H18V7H20ZM2 20H22V22H2V20Z"/></svg>,
];

const colors = ['#ff4757', '#2ed573', '#ffa502', '#3742fa', '#ff6b81', '#1e90ff', '#eccc68', '#ff7f50', '#a29bfe'];

export const BackgroundPattern: React.FC = () => {
  // Generate a grid of items to avoid overlaps
  const elements = React.useMemo(() => {
    const gridItems = [];
    let id = 0;
    const rows = 6;
    const cols = 6;
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Only fill 70% of the grid to keep it airy and random
        if (Math.random() > 0.70) {
          const xOffset = Math.random() * (cellWidth * 0.8);
          const yOffset = Math.random() * (cellHeight * 0.8);
          
          gridItems.push({
            id: id++,
            icon: icons[Math.floor(Math.random() * icons.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 60 + 80, // 80px to 140px
            x: c * cellWidth + xOffset,
            y: r * cellHeight + yOffset,
            duration: Math.random() * 20 + 25, // 25s to 45s
            delay: Math.random() * -25,
            direction: Math.random() > 0.5 ? 1 : -1
          });
        }
      }
    }
    return gridItems;
  }, []);

  return (
    <div className="background-pattern">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="bg-icon"
          style={{
            color: el.color,
            width: el.size,
            height: el.size,
            left: `${el.x}%`,
            top: `${el.y}%`,
          }}
          animate={{
            y: ['0%', '-30%', '30%', '0%'],
            x: ['0%', `${15 * el.direction}%`, `${-15 * el.direction}%`, '0%'],
            rotate: [0, 90 * el.direction, 180 * el.direction, 360 * el.direction]
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "linear",
            delay: el.delay,
          }}
        >
          {el.icon}
        </motion.div>
      ))}
    </div>
  );
};
