import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Bounds, Center, useGLTF } from '@react-three/drei';
import dsbcUrl from 'assets/models/CAD_DSBC_40_180_PPV.glb';

function DSBC(props) {
  const { scene } = useGLTF(dsbcUrl);
  return <primitive object={scene} {...props} />;
}
useGLTF.preload(dsbcUrl);

export default function ModelDsbc() {
  return (
    <div style={{ width: '100%', height: 520 }}>
      <Canvas
        camera={{ position: [0, 0, 350], fov: 35, near: 0.1, far: 5000 }}
        gl={{ antialias: true, logarithmicDepthBuffer: true }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 5, 4]} intensity={0.9} />
        <Environment preset="city" />

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <DSBC />
            </Center>
          </Bounds>
        </Suspense>

        <OrbitControls
          makeDefault
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.08}
          minDistance={200}
          maxDistance={1200}
        />
      </Canvas>
    </div>
  );
}
