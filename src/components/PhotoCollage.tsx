import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_CONFIG } from '../config';

// Dynamically import all images in the photos directory
const images = import.meta.glob('/src/assets/photos/*.{png,jpg,jpeg,gif,webp,heic}', { eager: true });

export const PhotoCollage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Track which photos have completed their entrance animation (the scatter drop sequence)
  const [finishedIds, setFinishedIds] = useState<number[]>([]);

  const photoUrls = useMemo(() => {
    return Object.values(images).map((mod: any) => mod.default);
  }, []);

  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine positions on mount based on screen size so each photo has a safety boundary
  const photosData = useMemo(() => {
    const items = photoUrls.length > 0 ? photoUrls : [1, 2, 3].map(() => 'placeholder');
    return items.map((url, i) => {
      // Safe boundary box for scattering (compacted for V4/V5 to stay strictly within borders)
      const maxW = windowSize.width * 0.50; // use 50% of screen width
      const maxH = windowSize.height * 0.40; // use 40% of screen height
      const x = (Math.random() - 0.5) * maxW; // from -maxW/2 to maxW/2
      const y = (Math.random() - 0.5) * maxH;
      const rotation = Math.random() * 40 - 20; // -20 to 20 degrees
      return { url, x, y, rotation, id: i };
    });
  }, [photoUrls, windowSize]);

  // Spring transition settings for layout animations (lightbox)
  // Adjusted for V5 to feel fluid and less overly bouncy
  const springTransition = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    mass: 1
  };

  return (
    <div className="collage-container" style={{ position: 'relative', width: '100%', height: '60vh' }}>
      {photosData.map((data, index) => {
        // Hide the underlying card slightly when it's selected to prevent visual duplication during morph
        const isSelected = selectedId === data.id;
        const isFinished = finishedIds.includes(data.id);

        return (
          // Wrapper to center the element exactly so framer motion can use pure numerical offset values for fluid animation
          <div key={data.id} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: isSelected ? 0 : index }}>
            <motion.div
              layoutId={`photo-${data.id}`}
              className="photo-card"
              onClick={() => {
                // Prevent clicking before the photo has landed, to avoid interrupting the initial sequence
                if (isFinished) {
                  setSelectedId(data.id);
                }
              }}
              onAnimationComplete={() => {
                // Register this photo sequence as completed so we can safely enable hover and clicks
                setFinishedIds(prev => prev.includes(data.id) ? prev : [...prev, data.id]);
              }}
              style={{ 
                cursor: isFinished ? 'zoom-in' : 'default', // Don't hint clickability until it lands
                opacity: isSelected ? 0 : 1
              }}
              initial={{ scale: 0, opacity: 0, x: 0, y: 0, rotate: 0 }}
              
              // Only use the complex staggered array if it hasn't finished.
              // Once finished, we supply fixed numeric end-states so Framer Motion doesn't replay the array when hover stops.
              animate={isSelected ? undefined : (
                isFinished ? {
                  scale: 1,
                  opacity: 1,
                  x: data.x, 
                  y: data.y, 
                  rotate: data.rotation
                } : {
                  scale: [0, 1.2, 1.2, 1], // Start 0 -> Pop up 1.2 -> Read time 1.2 -> scale down to land 1
                  opacity: [0, 1, 1, 1], // Fade in immediately -> stay 1 -> stay 1 -> stay 1
                  x: [0, 0, 0, data.x], // stay center -> stay center -> wait -> slide to target X
                  y: [0, 0, 0, data.y], // stay center -> stay center -> wait -> slide to target Y
                  rotate: [0, 0, 0, data.rotation] // wait centered -> wait -> rotate gently during landing move
                }
              )}
              transition={isFinished ? { type: "tween", duration: 0.2 } : {
                duration: 3.5, // Slower sequence overall
                times: [0, 0.15, 0.6, 1], // 15% pop up, 15-60% read time, 60-100% fly out
                delay: index * 3.5, // Sequential wait matching exact duration to prevent any overlap
                ease: "easeInOut"
              }}
              
              // Only apply hover interactions when the initial landing sequence is fully complete
              whileHover={(!isSelected && isFinished) ? { 
                scale: 1.1, 
                zIndex: 50, 
                boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
                transition: { duration: 0.2 } 
              } : undefined}
            >
              {data.url === 'placeholder' ? (
                <div className="placeholder">{SITE_CONFIG.testoPlaceholderFoto}</div>
              ) : (
                <img src={data.url as string} alt={`Foto Papà ${index + 1}`} />
              )}
            </motion.div>
          </div>
        );
      })}

      <AnimatePresence>
        {selectedId !== null && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'transparent', // V5 completely transparent wrapper
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px'
            }}
          >
            {(() => {
               const item = photosData.find(d => d.id === selectedId);
               if (!item) return null;
               
               return (
                 <motion.div
                   layoutId={`photo-${item.id}`}
                   className="photo-card"
                   style={{
                     width: 'auto',
                     height: 'auto',
                     cursor: 'zoom-out',
                     margin: 0,
                     rotate: 0, // ensure no rotation in lightbox
                     position: 'relative',
                     zIndex: 1001,
                   }}
                   transition={springTransition}
                   onClick={(e) => {
                     e.stopPropagation();
                     setSelectedId(null);
                   }}
                 >
                    {item.url === 'placeholder' ? (
                      <div className="placeholder" style={{ width: '80vw', height: '65vh' }}>{SITE_CONFIG.testoPlaceholderFoto}</div>
                    ) : (
                      <img src={item.url as string} alt="Focus" style={{ width: 'auto', height: 'auto', maxWidth: '85vw', maxHeight: '65vh', objectFit: 'contain' }} />
                    )}
                 </motion.div>
               );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
