import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useHelper, Stars } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";

const Planet = ({ ...props }) => {
  // const [clicked, setClicked] = useState(false);
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    ref.current.position.add(
      new THREE.Vector3(
        Math.cos(100 * props.random + t * 5) / 20,
        Math.sin(100 * props.random + t * 5) / 30,
        0
      )
    );
  });

  const handleClick = () => {
    props.setTargetPlanet(ref);
  };

  return (
    <mesh ref={ref} {...props} onClick={handleClick} receiveShadow castShadow>
      <sphereGeometry args={[props.radius, 32, 16]} />
      <meshStandardMaterial
        color={props.color}
        envMapIntensity={0.5}
        roughness={1}
      />
    </mesh>
  );
};

const DirLight = ({ ...props }) => {
  const spread = 50;
  const lightRef = useRef();
  useHelper(lightRef, THREE.DirectionalLightHelper, spread);
  return (
    <directionalLight
      ref={lightRef}
      color="rgb(128,128,255)"
      position={[0, 0, 100]}
      castShadow
    />
  );
};

const ControlsWrapper = ({...props}) => {
  useFrame(() => {
    props.controlsRef?.current?.target?.position?.lerp(props.target?.current?.position  || new THREE.Vector3(0, 0, 0), 0.2);
  });

  return (
  <OrbitControls
    makeDefault={true}
    ref={props.controlsRef}
  />
  );
};

function getRandomData () {
  const randomVector = (r) => [
    r / 2 - Math.random() * r,
    r / 2 - Math.random() * r,
    r / 2 - Math.random() * r,
  ];
  const randomEuler = () => [
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI,
  ];
  const randomColor = (r) => `#${
    ( Math.floor(Math.random() * 255 * 255 * 255) +
      Math.floor(Math.random() * 255 * 255) +
      Math.floor(Math.random() * 255)).toString(16).padStart(6, '0')}`;

  return Array.from({ length: 100 }, (r = 8) => ({
    random: Math.random(),
    position: randomVector(r),
    rotation: randomEuler(),
    color: randomColor(),
    radius: Math.random() * Math.random(),
  }));
}

let randomData = getRandomData();

function App() {
  const controlsRef = useRef();
  const [targetPlanet, setTargetPlanet] = useState();
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    randomData = randomData.map(datum => ({...datum, controls: controlsRef, setTargetPlanet}))
    setPlanets(randomData.map((props, i) => <Planet key={i} {...props} />));
  }, [])


  return (
    <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />
      <ambientLight color="#004000" intensity={0.2} />
      <DirLight />
      {planets}
      <ControlsWrapper target={targetPlanet} controlsRef={controlsRef} />
    </Canvas>
  );
}

export default App;
