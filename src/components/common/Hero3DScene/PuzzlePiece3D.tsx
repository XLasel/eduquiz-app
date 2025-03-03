'use client';

import React, { JSX, useRef } from 'react';

import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    puzzle: THREE.Mesh;
  };
  materials: {
    material_puzzle: THREE.MeshPhysicalMaterial;
  };
};

export const PuzzlePiece3D = ({ ...props }: JSX.IntrinsicElements['group']) => {
  const { nodes, materials } = useGLTF('puzzle-model/model.gltf') as GLTFResult;
  const normalMap = materials.material_puzzle.normalMap;
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.2;
      meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
    }
  });

  const materialProps = {
    thickness: 0.15,
    roughness: 0.1,
    transmission: 0.8,
    ior: 1.2,
    chromaticAberration: 0.66,
    backside: true,
  };

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        geometry={nodes.puzzle.geometry}
        scale={[0.7, 0.7, 0.7]}
        onPointerOver={() => {
          if (document) document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (document) document.body.style.cursor = 'default';
        }}
      >
        <MeshTransmissionMaterial
          color="#FF7A00"
          normalMap={normalMap}
          normalScale={new THREE.Vector2(1, -1)}
          {...materialProps}
        />
      </mesh>
    </group>
  );
};

useGLTF.preload('puzzle-model/model.gltf');
