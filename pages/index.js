import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function MobileArenaTargeting() {
  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [hits, setHits] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({});

  useEffect(() => {
    const ua = navigator.userAgent;
    const info = {
      isMobile: /Mobile|Android|iPhone|iPad|iPod/i.test(ua),
      platform: navigator.platform,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      touchSupport: 'ontouchstart' in window,
      userAgent: ua
    };
    setDeviceInfo(info);
  }, []);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [timeLeft, gameActive]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setHits([]);
    spawnTarget();
  };

  const spawnTarget = () => {
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 200;
    setTargetX(Math.random() * maxX);
    setTargetY(Math.random() * maxY);
  };

  const handleTargetHit = (e) => {
    if (!gameActive) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    setScore(score + 1);
    setHits([...hits, { x: targetX + x, y: targetY + y, time: Date.now() }]);
    spawnTarget();
  };

  return (
    <>
      <Head>
        <title>Mobile Arena Targeting Test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Mobile Arena Targeting</h1>

          <div style={styles.deviceInfo}>
            <div><strong>Device:</strong> {deviceInfo.isMobile ? 'Mobile' : 'Desktop'}</div>
            <div><strong>Screen:</strong> {deviceInfo.screenWidth} × {deviceInfo.screenHeight}</div>
            <div><strong>Touch:</strong> {deviceInfo.touchSupport ? 'Enabled' : 'Disabled'}</div>
          </div>

          <div style={styles.stats}>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Score</div>
              <div style={styles.statValue}>{score}</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Time</div>
              <div style={styles.statValue}>{timeLeft}s</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Accuracy</div>
              <div style={styles.statValue}>
                {hits.length > 0 ? ((score / hits.length) * 100).toFixed(0) : 0}%
              </div>
            </div>
          </div>

          {!gameActive && (
            <button onClick={startGame} style={styles.startButton}>
              {score > 0 ? 'Play Again' : 'Start Game'}
            </button>
          )}
        </div>

        <div style={styles.arena}>
          {gameActive && (
            <div
              style={{
                ...styles.target,
                left: targetX,
                top: targetY,
              }}
              onTouchStart={handleTargetHit}
              onClick={handleTargetHit}
            >
              <div style={styles.targetInner}>🎯</div>
            </div>
          )}

          {hits.slice(-10).map((hit, i) => (
            <div
              key={hit.time}
              style={{
                ...styles.hitMarker,
                left: hit.x,
                top: hit.y,
                opacity: 1 - i * 0.1,
              }}
            >
              ✓
            </div>
          ))}

          {!gameActive && score > 0 && (
            <div style={styles.gameOver}>
              <h2>Game Over!</h2>
              <p style={styles.finalScore}>Final Score: {score}</p>
              <p>Targets Hit: {hits.length}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#0a0e27',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'manipulation',
  },
  header: {
    padding: '15px',
    backgroundColor: '#1a1f3a',
    borderBottom: '2px solid #2a3f5f',
  },
  title: {
    margin: '0 0 15px 0',
    fontSize: '24px',
    textAlign: 'center',
    color: '#4fc3f7',
  },
  deviceInfo: {
    fontSize: '12px',
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#0f1420',
    borderRadius: '8px',
    lineHeight: '1.6',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '15px',
  },
  statItem: {
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '5px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4fc3f7',
  },
  startButton: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#4fc3f7',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  arena: {
    position: 'relative',
    width: '100%',
    height: 'calc(100vh - 240px)',
    backgroundColor: '#0a0e27',
  },
  target: {
    position: 'absolute',
    width: '70px',
    height: '70px',
    cursor: 'pointer',
    transition: 'transform 0.1s',
    animation: 'pulse 1s infinite',
  },
  targetInner: {
    fontSize: '60px',
    lineHeight: '70px',
    textAlign: 'center',
    filter: 'drop-shadow(0 0 10px rgba(255, 107, 107, 0.8))',
  },
  hitMarker: {
    position: 'absolute',
    fontSize: '24px',
    color: '#4caf50',
    pointerEvents: 'none',
    animation: 'fadeOut 0.5s',
  },
  gameOver: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    backgroundColor: 'rgba(26, 31, 58, 0.95)',
    padding: '30px',
    borderRadius: '15px',
    border: '2px solid #4fc3f7',
  },
  finalScore: {
    fontSize: '32px',
    color: '#4fc3f7',
    margin: '15px 0',
  },
};
