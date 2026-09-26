
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import './styles.css'; // You can move your CSS content into this file

export const JevPresentation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Configuration for scenes
  const scenes = [
    { start: 0, tag: 'Hook' },
    { start: 4, tag: 'The Problem' },
    { start: 9, tag: 'A Different Idea' },
    { start: 16, tag: 'How It Works' },
    { start: 24, tag: 'Three Primitives' },
    { start: 33, tag: 'Why It Matters' },
    { start: 42, tag: 'Agent Architecture' },
    { start: 50, tag: 'The Big Idea' },
    { start: 56, tag: 'The Future' },
  ];

  const activeIndex = scenes.findIndex((s, i) => {
    const next = scenes[i + 1];
    return currentTime >= s.start && (next ? currentTime < next.start : true);
  });

  const activeScene = scenes[activeIndex];

  return (
    <AbsoluteFill className="stage">
      <div className="bg-blob blob1" />
      <div className="bg-blob blob2" />
      <div className="bg-blob blob3" />
      <div className="grid-dots" />

      <div className="sceneTag show">{activeScene.tag}</div>

      {/* Render Scenes - Using conditional rendering based on activeIndex */}
      {activeIndex === 0 && <Scene1 />}
      {activeIndex === 1 && <Scene2 />}
      {/* ... Add other scene components similarly */}
      
      {/* Timeline UI */}
      <div className="timeline">
        <div className="track"><div className="progress" style={{ width: `${(currentTime / 60) * 100}%` }} /></div>
      </div>
    </AbsoluteFill>
  );
};
