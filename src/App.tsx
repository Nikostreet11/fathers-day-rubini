import { useState } from 'react';
import confetti from 'canvas-confetti';
import { GiftBox } from './components/GiftBox';
import { PhotoCollage } from './components/PhotoCollage';
import { BackgroundPattern } from './components/BackgroundPattern';
import { SITE_CONFIG } from './config';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCollage, setShowCollage] = useState(false);

  const handleOpenInfo = () => {
    if (isOpen) return;
    
    setIsOpen(true);
    
    // Trigger confetti explosion
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff4757', '#2ed573', '#ffa502', '#3742fa']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff4757', '#2ed573', '#ffa502', '#3742fa']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Show collage after a short delay (while box is animating out)
    setTimeout(() => {
      setShowCollage(true);
    }, 600);
  };

  return (
    <>
      <BackgroundPattern />
      <div className="main-content">
      <h1 className={`title ${showCollage ? 'celebration' : ''}`}>
        {showCollage ? SITE_CONFIG.titoloAperto : SITE_CONFIG.titoloIniziale}
      </h1>

      {!showCollage && <GiftBox isOpen={isOpen} onClick={handleOpenInfo} />}
      
      {showCollage && <PhotoCollage />}
    </div>
    </>
  );
}

export default App;
