'use client';

import React, { Suspense, useRef, useState } from 'react';

import dynamic from 'next/dynamic';

import {
  Environment,
  Html,
  PresentationControls,
  Text,
  useProgress,
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import * as THREE from 'three';

import { usePauseOnTabInactive } from '@/hooks';

const PuzzlePiece3D = dynamic(
  () => import('./PuzzlePiece3D').then((mod) => mod.PuzzlePiece3D),
  {
    ssr: false,
  }
);

const PauseHandler = () => {
  usePauseOnTabInactive({ stopClock: true });
  return null;
};

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="h-1 w-40 overflow-hidden rounded-full bg-gray-300">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="mt-2 text-sm">{progress.toFixed(0)}%</span>
      </div>
    </Html>
  );
};

const CameraRig = ({
  children,
  isMobile,
}: {
  children: React.ReactNode;
  isMobile: boolean;
}) => {
  const group = useRef<THREE.Group>(null);
  const [hover, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (isMobile || !group.current) return;

    const rotationAmount = hover ? 0.3 : 0.1;

    easing.dampE(
      group.current.rotation,
      [state.pointer.y * rotationAmount, -state.pointer.x * rotationAmount, 0],
      0.25,
      delta
    );
    if (hover) {
      easing.damp3(group.current.scale, [1.05, 1.05, 1.05], 0.15, delta);
    } else {
      easing.damp3(group.current.scale, [1, 1, 1], 0.15, delta);
    }
  });

  return (
    <group
      ref={group}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {children}
    </group>
  );
};

const Hero3DScene = ({ isMobile }: { isMobile: boolean }) => (
  <Canvas
    shadows={isMobile ? false : true}
    camera={{
      position: [0, 0, 10],
      fov: 30,
      near: 0.1,
      far: 1000,
    }}
    style={{ touchAction: 'none' }}
  >
    <Suspense fallback={<Loader />}>
      <PauseHandler />
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

      <Environment preset="city" />

      <group position={[1, 0, 0]}>
        <CameraRig isMobile={isMobile}>
          <PresentationControls
            global={false}
            cursor={true}
            snap={true}
            speed={1}
            zoom={1}
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 2, Math.PI / 2]}
            azimuth={[-Math.PI / 2, Math.PI / 2]}
          >
            <PuzzlePiece3D isMobile={isMobile} />
          </PresentationControls>
        </CameraRig>
      </group>

      <Text
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        position={[0, 0, -6]}
        fontSize={6}
        color="#3A9646"
      >
        EduQuiz.
      </Text>
    </Suspense>
  </Canvas>
);

export { Hero3DScene };
