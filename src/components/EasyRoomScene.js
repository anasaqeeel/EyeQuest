import React, { useRef, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import WebGazerComponent from '../hooks/WebGazerComponent';

const EasyRoomScene = ({ onLoaded, setScore, onVictory }) => {
  const fragKnifeRef = useRef();
  const skullRef = useRef();
  const bloodSpatteredRef = useRef();

  const [objectsReady, setObjectsReady] = useState(false);
  const [objectsToCheck, setObjectsToCheck] = useState([]);
  const [objectNames, setObjectNames] = useState([]);

  const { scene: horrorRoomScene } = useGLTF('/model/horror_room/scene.gltf');
  const { scene: fragKnifeScene } = useGLTF('/model/frag_knife/scene.gltf');
  const { scene: skullScene } = useGLTF('/model/skull_downloadable/scene.gltf');
  const { scene: bloodSpatteredScene } = useGLTF('/model/blood_spattered/scene.gltf');

  const { camera, gl: renderer } = useThree();

  useEffect(() => {
    if (
      fragKnifeRef.current &&
      skullRef.current &&
      bloodSpatteredRef.current
    ) {
      setObjectsReady(true);
      setObjectsToCheck([
        fragKnifeRef.current,
        skullRef.current,
        bloodSpatteredRef.current,
      ]);

      setObjectNames([
        'Knife',
        'Skull',
        'Blood Spatter',
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
        ref={bloodSpatteredRef}
        object={bloodSpatteredScene}
        position={[0, 0.05, 1.5]}
        scale={[0.05, 0.05, 0.05]}
        rotation={[0, 1.8, 0]}
      />

      {objectsReady && (
        <WebGazerComponent
          camera={camera}
          renderer={renderer}
          objectsToCheck={objectsToCheck}
          objectNames={objectNames}
          setScore={setScore}
          onVictory={onVictory}
        />
      )}
    </>
  );
};

export default EasyRoomScene;
