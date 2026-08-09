import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float, ContactShadows, Environment, Center, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function RealDogModel() {
  const { scene } = useGLTF('/cocker.glb')
  const ref = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ref.current) {
      ref.current.position.y = Math.sin(t * 2) * 0.03
    }
  })

  // Escala ajustada para encajar como un hero completo
  return (
    <group ref={ref} position={[0, -1.2, 0]}>
      <primitive object={scene} scale={1.2} />
    </group>
  )
}

function RealCatModel() {
  const { scene } = useGLTF('/cat_real.glb')
  const ref = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (ref.current) {
      ref.current.position.y = Math.sin(t * 2) * 0.03
    }
  })

  return (
    <group ref={ref} position={[0, -1.2, 0]}>
      <primitive object={scene} scale={1.4} />
    </group>
  )
}

useGLTF.preload('/cocker.glb')
useGLTF.preload('/cat_real.glb')

// Componente para ajustar la cámara según el tamaño de la pantalla
function CameraController() {
  const { camera, size } = useThree()
  
  useEffect(() => {
    // Si la pantalla es ancha (desktop), alejamos la cámara un poco para que encuadre bien en la mitad derecha
    if (size.width > 1024) {
      camera.position.set(4, 2, 7)
    } else {
      camera.position.set(3, 1.5, 6)
    }
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [size, camera])
  
  return null
}

export default function Hero3D({ currentPet }) {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [4, 2, 7], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <CameraController />
        
        {/* Luces premium estilo estudio */}
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[8, 10, 8]} 
          angle={0.4} 
          penumbra={1} 
          intensity={1.8} 
          castShadow 
          shadow-bias={-0.0001} 
        />
        <spotLight position={[-8, 5, -5]} angle={0.5} penumbra={1} intensity={0.6} color="#0F766E" />
        <Environment preset="apartment" />
        
        <Suspense fallback={null}>
          {/* Centramos el modelo pero lo movemos sutilmente a la derecha en el espacio 3D */}
          <group position={[1, 0, 0]}>
            <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2}>
              {currentPet === 'dog' ? <RealDogModel /> : <RealCatModel />}
            </Float>
            <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={12} blur={2.5} far={4} color="#2C2621" />
          </group>
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate 
          autoRotateSpeed={1.0} 
          maxPolarAngle={Math.PI / 2 - 0.05} 
          minPolarAngle={Math.PI / 3}
          minAzimuthAngle={-Math.PI / 2} // Limita la rotación para que siempre mire hacia adelante/lados
          maxAzimuthAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}
