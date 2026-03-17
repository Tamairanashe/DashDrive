import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, useCursor } from '@react-three/drei';
import * as THREE from 'three';

type Seat = {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'locked' | 'sold';
  lockedBy: string | null;
  lockExpiry: number | null;
};

interface Venue3DProps {
  seats: Seat[];
  selectedSeat: Seat | null;
  onSeatSelect: (seat: Seat) => void;
  userId: string;
}

const getSeatPosition = (row: string, number: number): [number, number, number] => {
  const rowIndex = row.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
  const radius = 8 + rowIndex * 2.5;
  const angleStep = Math.PI / 8; 
  const startAngle = - (3 * angleStep) / 2; 
  const angle = startAngle + (number - 1) * angleStep;
  
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius - 5; 
  return [x, rowIndex * 0.5, z];
};

const SeatMesh = ({ seat, isSelected, onClick, isLockedByMe }: { seat: Seat, isSelected: boolean, onClick: () => void, isLockedByMe: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);
  
  const isAvailable = seat.status === 'available';
  const isLocked = seat.status === 'locked';
  const isSold = seat.status === 'sold';

  useCursor(hovered, 'pointer', 'auto');

  let color = '#10b981'; // emerald-500 (available)
  if (isSelected || isLockedByMe) color = '#4f46e5'; // indigo-600 (selected/locked by me)
  else if (isLocked) color = '#f59e0b'; // amber-500 (locked)
  else if (isSold) color = '#a1a1aa'; // zinc-400 (sold)

  if (hovered && isAvailable && !isSelected) {
    color = '#34d399'; // emerald-400 (hover)
  }

  const position = getSeatPosition(seat.row, seat.number);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 4, 0, 0]}
      >
        {seat.id}
      </Text>
    </group>
  );
};

const Stage = () => {
  return (
    <group position={[0, -0.5, -8]}>
      <mesh>
        <boxGeometry args={[12, 1, 4]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <Text
        position={[0, 0.6, 0]}
        fontSize={1}
        color="#ffffff"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        STAGE
      </Text>
    </group>
  );
};

const CameraAnimator = ({ selectedSeat }: { selectedSeat: Seat | null }) => {
  useFrame((state) => {
    if (selectedSeat) {
      const pos = getSeatPosition(selectedSeat.row, selectedSeat.number);
      // Move camera to slightly above and behind the seat
      const targetPos = new THREE.Vector3(pos[0], pos[1] + 2, pos[2] + 2);
      state.camera.position.lerp(targetPos, 0.05);
      
      // Look at the stage
      const lookAtTarget = new THREE.Vector3(0, 0, -8);
      
      // We need to smoothly interpolate the camera's rotation to look at the stage
      const currentQuaternion = state.camera.quaternion.clone();
      state.camera.lookAt(lookAtTarget);
      const targetQuaternion = state.camera.quaternion.clone();
      
      state.camera.quaternion.copy(currentQuaternion);
      state.camera.quaternion.slerp(targetQuaternion, 0.05);
    } else {
      // Default overview camera
      const targetPos = new THREE.Vector3(0, 15, 15);
      state.camera.position.lerp(targetPos, 0.05);
      
      const lookAtTarget = new THREE.Vector3(0, 0, 0);
      const currentQuaternion = state.camera.quaternion.clone();
      state.camera.lookAt(lookAtTarget);
      const targetQuaternion = state.camera.quaternion.clone();
      
      state.camera.quaternion.copy(currentQuaternion);
      state.camera.quaternion.slerp(targetQuaternion, 0.05);
    }
  });
  return null;
};

export default function Venue3D({ seats, selectedSeat, onSeatSelect, userId }: Venue3DProps) {
  return (
    <div className="w-full h-[500px] bg-zinc-900 rounded-3xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 15, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />
        
        <Stage />
        
        {seats.map(seat => (
          <SeatMesh
            key={seat.id}
            seat={seat}
            isSelected={selectedSeat?.id === seat.id}
            isLockedByMe={seat.status === 'locked' && seat.lockedBy === userId}
            onClick={() => onSeatSelect(seat)}
          />
        ))}
        
        <CameraAnimator selectedSeat={selectedSeat} />
        
        {!selectedSeat && <OrbitControls 
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2 - 0.1}
          minDistance={5}
          maxDistance={30}
        />}
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm pointer-events-none">
        {selectedSeat ? 'Viewing from selected seat' : 'Drag to rotate • Scroll to zoom'}
      </div>
    </div>
  );
}
