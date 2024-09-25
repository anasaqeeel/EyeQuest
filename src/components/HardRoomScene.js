// HardRoomScene.js
import React, { useRef, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import WebGazerComponent from '../hooks/WebGazerComponent';

const HardRoomScene = ({ onLoaded, setScore, onVictory }) => {
  const snakeRef = useRef();
  const fragKnifeRef = useRef();
  const deadBodyRef = useRef();
  const skullRef = useRef();
  const skeletonRef = useRef();
  const bloodSpatteredRef = useRef();
  const portraitRef = useRef();
  const carpetRef = useRef();

  const [objectsReady, setObjectsReady] = useState(false);
  const [objectsToCheck, setObjectsToCheck] = useState([]);


  const { scene: horrorRoomScene } = useGLTF('/model/horror_room/scene.gltf');
  const { scene: fragKnifeScene } = useGLTF('/model/frag_knife/scene.gltf');
  const { scene: snakeScene } = useGLTF('/model/snake/scene.gltf');
  const { scene: deadBodyScene } = useGLTF('/model/dead_body/scene.gltf');
  const { scene: skullScene } = useGLTF('/model/skull_downloadable/scene.gltf');
  const { scene: skeletonScene } = useGLTF('/model/skeleton/scene.gltf');
  const { scene: bloodSpatteredScene } = useGLTF('/model/blood_spattered/scene.gltf');
  const { scene: portraitScene } = useGLTF('/model/peinture_portrait_edmon_picard_1884/scene.gltf');
  const { scene: carpetScene } = useGLTF('/model/carpet_fluffy/scene.gltf');

  const { camera, gl: renderer } = useThree();

  useEffect(() => {
    if (
      snakeRef.current &&
      fragKnifeRef.current &&
      deadBodyRef.current &&
      skullRef.current &&
      skeletonRef.current &&
      bloodSpatteredRef.current &&
      portraitRef.current &&
      carpetRef.current
    ) {
      setObjectsReady(true);
      setObjectsToCheck([
        snakeRef.current,
        fragKnifeRef.current,
        deadBodyRef.current,
        skullRef.current,
        skeletonRef.current,
        bloodSpatteredRef.current,
        portraitRef.current,
        carpetRef.current,
      ]);
      if (onLoaded) {
        onLoaded();
      }
    }
  }, [onLoaded]);

  return (
    <>
      <primitive object={horrorRoomScene} position={[0, 0, 0]} />

      <primitive
        ref={fragKnifeRef}
        object={fragKnifeScene}
        position={[0, 0.2, 0]}
        scale={[0.2, 0.2, 0.2]}
        rotation={[0, Math.PI / 4, 0]}
      />

      <primitive
        ref={skullRef}
        object={skullScene}
        position={[-1.8, 1.0, 1.5]}
        scale={[0.2, 0.2, 0.2]}
        rotation={[0.8, 2.5, 0]}
      />

      <primitive
        ref={skeletonRef}
        object={skeletonScene}
        position={[-2.8, 0.7, 1.5]}
        scale={[0.5, 0.5, 0.5]}
        rotation={[0, 1.8, 0]}
      />

      <primitive
        ref={bloodSpatteredRef}
        object={bloodSpatteredScene}
        position={[0, 0.05, 1.5]}
        scale={[0.05, 0.05, 0.05]}
        rotation={[0, 1.8, 0]}
      />

      <primitive
        ref={portraitRef}
        object={portraitScene}
        position={[-1.8, 1.6, 3.2]}
        scale={[0.04, 0.04, 0.04]}
        rotation={[0, 3.1, 0]}
      />

      <primitive
        ref={carpetRef}
        object={carpetScene}
        position={[-1.6, 0.1, 0]}
        scale={[0.6, 0.6, 0.6]}
        rotation={[0, 1.5, 0]}
      />

      <primitive
        ref={deadBodyRef}
        object={deadBodyScene}
        position={[1.8, 0.1, 0]}
        scale={[0.009, 0.009, 0.009]}
        rotation={[1.5, 3.0, 0]}
      />

      <primitive
        ref={snakeRef}
        object={snakeScene}
        position={[0.5, 0.6, 2.8]}
        scale={[0.2, 0.2, 0.2]}
        rotation={[0, Math.PI / 4, 0]}
      />

      {
        objectsReady && (
          <WebGazerComponent
            camera={camera}
            renderer={renderer}
            objectsToCheck={objectsToCheck}
            setScore={setScore}
            onVictory={onVictory}
          />
        )
      }
    </>
  );
};

export default HardRoomScene;
