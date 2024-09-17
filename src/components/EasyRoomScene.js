import React, { useRef, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import WebGazerComponent from '../hooks/WebGazerComponent';

const EasyRoomScene = ({ setScore }) => {
  const fragKnifeRef = useRef();
  const skullRef = useRef();
  const bloodSpatteredRef = useRef();
  const portraitRef = useRef();

  const [isLoaded, setIsLoaded] = useState(false); // Track if models are loaded

  const { scene: horrorRoomScene } = useGLTF('/model/horror_room/scene.gltf');
  const { scene: fragKnifeScene } = useGLTF('/model/frag_knife/scene.gltf');
  const { scene: skullScene } = useGLTF('/model/skull_downloadable/scene.gltf');
  const { scene: bloodSpatteredScene } = useGLTF('/model/blood_spattered/scene.gltf');
  const { scene: portraitScene } = useGLTF('/model/peinture_portrait_edmon_picard_1884/scene.gltf');

  const { camera, gl: renderer } = useThree();

  const objectsToCheck = [
    fragKnifeRef.current,
    skullRef.current,
    bloodSpatteredRef.current,
    portraitRef.current,
  ];

  useEffect(() => {
    const checkObjectsLoaded = () => {
      if (
        fragKnifeRef.current &&
        skullRef.current &&
        bloodSpatteredRef.current &&
        portraitRef.current
      ) {
        setIsLoaded(true);
      }
    };

    checkObjectsLoaded();
    const interval = setInterval(checkObjectsLoaded, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} color={0xffffff} />
      <directionalLight intensity={1} position={[10, 10, 10]} color={0xffffff} />

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

      {isLoaded && (
        <WebGazerComponent
          camera={camera}
          renderer={renderer}
          objectsToCheck={objectsToCheck}
          setScore={setScore}
        />
      )}
    </>
  );
};

export default EasyRoomScene;
