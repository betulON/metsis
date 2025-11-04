import { useState, useEffect, useRef } from 'react';
import ProjectSlider from './ProjectSlider';

const VideoSection = () => {
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // For demonstration, we'll transition after 3 seconds
    // In production, this would trigger when the actual video ends
    const timer = setTimeout(() => {
      setVideoEnded(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="video-section">
      {!videoEnded ? (
        <div className="video-container">
          <div className="logo-animation" ref={videoRef}>
            <h1 className="animated-logo">METSIS</h1>
            <p className="animated-tagline">İnşaat & Mimarlık</p>
          </div>
        </div>
      ) : (
        <ProjectSlider />
      )}
    </div>
  );
};

export default VideoSection;
