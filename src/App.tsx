import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Float, ContactShadows, Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Home,
  Layers,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  Search,
  Phone,
  CheckCircle2,
  Download,
  Calendar,
  Heart,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Compass,
  BedDouble,
  Bath,
  Square,
  Sun,
  Wifi,
  Flame,
  ShieldCheck,
  X,
  Database,
  Info
} from 'lucide-react';

// ==========================================
// 1. SAMPLE APARTMENTS DATA & SUPABASE SETUP
// ==========================================

interface Apartment {
  id: string;
  title: string;
  floor: number;
  rooms: number;
  area: number; // m²
  price: number; // USD
  status: 'available' | 'reserved' | 'sold';
  description: string;
  features: string[];
  position: [number, number, number];
  color: string;
}

const SAMPLE_APARTMENTS: Apartment[] = [
  {
    id: 'apt-2a',
    title: 'Apartment 2A - Executive Suite',
    floor: 2,
    rooms: 2,
    area: 64,
    price: 185000,
    status: 'available',
    description: 'Modern 2-bedroom condominium with custom Nifas Silk washable finishes, aluminum ceiling spotlights, and Australian wood doors.',
    features: ['Custom Ceiling Boards', 'Washable Matte Paint', 'Enclosed Wet Kitchen Prep', 'Split Bathrooms'],
    position: [0, 0.6, 0],
    color: '#3b82f6'
  },
  {
    id: 'apt-3b',
    title: 'Apartment 3B - Panorama Loft',
    floor: 3,
    rooms: 3,
    area: 96,
    price: 265000,
    status: 'available',
    description: 'Spacious 3-bedroom spatial layout optimized for residential living with dedicated laundry zone and high electrical capacity kitchen.',
    features: ['Panoramic Balcony', 'Smart Home Controls', 'Electric Mitad Kitchen Circuit', 'Acoustic Insulation'],
    position: [0, 1.8, 0],
    color: '#10b981'
  },
  {
    id: 'apt-4b',
    title: 'Apartment 4B - Penthouse Sky View',
    floor: 4,
    rooms: 4,
    area: 142,
    price: 410000,
    status: 'reserved',
    description: 'Luxurious top-floor penthouse with 360-degree skyline views, floor-to-ceiling Low-E glass, and private rooftop terrace access.',
    features: ['Private Rooftop Deck', 'Floor Heating', 'Designer Italian Fixtures', 'Private Elevator Key'],
    position: [0, 3.0, 0],
    color: '#8b5cf6'
  }
];

// ==========================================
// 2. 3D SCENE & BUILDING COMPONENTS
// ==========================================

function BuildingMesh({ onSelectApartment, selectedId }: { onSelectApartment: (apt: Apartment) => void; selectedId: string | null }) {
  const buildingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (buildingRef.current && !selectedId) {
      buildingRef.current.rotation.y = THREE.MathUtils.lerp(
        buildingRef.current.rotation.y,
        Math.sin(state.clock.elapsedTime * 0.1) * 0.15,
        0.05
      );
    }
  });

  return (
    <group ref={buildingRef} position={[0, -0.5, 0]}>
      {/* Base Foundation */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[6.2, 0.2, 5.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Ground Floor Commercial / Lobby */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.8, 0.8, 4.8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.3} />
      </mesh>

      {/* Retail Glass Windows */}
      <mesh position={[0, 0.6, 2.41]}>
        <planeGeometry args={[5.2, 0.6]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.6} />
      </mesh>

      {/* Floors 2 to 4 (Apartment Levels) */}
      {SAMPLE_APARTMENTS.map((apt, index) => {
        const yPos = 1.4 + index * 1.2;
        const isSelected = selectedId === apt.id;

        return (
          <group key={apt.id} position={[0, yPos, 0]}>
            {/* Floor Slab */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[6.0, 0.2, 5.0]} />
              <meshStandardMaterial color={isSelected ? '#6366f1' : '#334155'} roughness={0.5} />
            </mesh>

            {/* Interior Glass Walls / Room Division */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[5.6, 0.8, 4.6]} />
              <meshStandardMaterial 
                color={apt.color} 
                roughness={0.2} 
                transparent 
                opacity={isSelected ? 0.85 : 0.45} 
              />
            </mesh>

            {/* Interactive 3D DOM Hotspot Badge */}
            <Html position={[0, 1.1, 2.6]} center distanceFactor={12}>
              <button
                onClick={() => onSelectApartment(apt)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg transition-all transform hover:scale-110 flex items-center gap-1.5 border ${
                  isSelected 
                    ? 'bg-indigo-600 text-white border-indigo-400 animate-pulse' 
                    : 'bg-slate-900/80 text-slate-200 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {apt.title.split(' - ')[0]} (${(apt.price / 1000).toFixed(0)}k)
              </button>
            </Html>
          </group>
        );
      })}

      {/* Architectural Roof Feature */}
      <mesh position={[0, 5.0, 0]} castShadow>
        <boxGeometry args={[5.6, 0.4, 4.6]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Camera Controller for smooth zooming into selected apartment
function CameraController({ selectedApt }: { selectedApt: Apartment | null }) {
  const { camera } = useThree();

  useEffect(() => {
    const targetPos = selectedApt ? new THREE.Vector3(0, selectedApt.position[1] + 1.2, 6.5) : new THREE.Vector3(7, 6, 8);
    const lookTarget = selectedApt ? new THREE.Vector3(0, selectedApt.position[1], 0) : new THREE.Vector3(0, 2, 0);

    let frameId: number;
    let progress = 0;

    const startPos = camera.position.clone();

    const animateCamera = () => {
      progress += 0.03;
      if (progress <= 1) {
        camera.position.lerpVectors(startPos, targetPos, progress);
        camera.lookAt(lookTarget);
        frameId = requestAnimationFrame(animateCamera);
      }
    };

    animateCamera();
    return () => cancelAnimationFrame(frameId);
  }, [selectedApt, camera]);

  return null;
}

// ==========================================
// 3. MAIN APPLICATION COMPONENT
// ==========================================

export default function App() {
  const [apartments] = useState<Apartment[]>(SAMPLE_APARTMENTS);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minRooms, setMinRooms] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filter logic
  const filteredApartments = useMemo(() => {
    return apartments.filter(apt => {
      const matchesSearch = apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            apt.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = apt.price <= maxPrice;
      const matchesRooms = apt.rooms >= minRooms;
      return matchesSearch && matchesPrice && matchesRooms;
    });
  }, [apartments, searchQuery, maxPrice, minRooms]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      
      {/* Top Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">PANOSPHERE STUDIO</h1>
            <p className="text-xs text-slate-400">Architectural 3D Virtual Showcase</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button className="hover:text-indigo-400 transition-colors">Residences</button>
          <button className="hover:text-indigo-400 transition-colors">Floor Plans</button>
          <button className="hover:text-indigo-400 transition-colors">Materials</button>
          <button className="hover:text-indigo-400 transition-colors">Contact</button>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-all">
            <Phone className="w-3.5 h-3.5" /> Request a Call
          </button>
        </div>
      </header>

      {/* 3D WebGL Viewport */}
      <div className="absolute inset-0 z-10">
        <Canvas shadows camera={{ position: [7, 6, 8], fov: 45 }}>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={2048} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Suspense fallback={null}>
            <BuildingMesh 
              onSelectApartment={(apt) => setSelectedApartment(apt)} 
              selectedId={selectedApartment ? selectedApartment.id : null}
            />
            <ContactShadows position={[0, -0.6, 0]} opacity={0.6} scale={15} blur={2.5} far={4} />
          </Suspense>

          <CameraController selectedApt={selectedApartment} />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            maxPolarAngle={Math.PI / 2.1} 
            minDistance={4} 
            maxDistance={18} 
          />
        </Canvas>
      </div>

      {/* Left Control Panel / Search & Filters */}
      <div className="absolute left-6 top-24 z-20 w-80 max-h-[calc(100vh-7rem)] overflow-y-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> Unit Filters
          </h2>
          <button 
            onClick={() => setSelectedApartment(null)}
            className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset View
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search suite or specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Price Filter Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>Max Price</span>
            <span className="text-indigo-400 font-bold">${(maxPrice / 1000).toFixed(0)}k</span>
          </div>
          <input
            type="range"
            min="150000"
            max="500000"
            step="10000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Rooms Filter */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-slate-400 font-medium">Minimum Rooms</span>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => setMinRooms(num)}
                className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  minRooms === num 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                }`}
              >
                {num}+ Rooms
              </button>
            ))}
          </div>
        </div>

        {/* Apartment List Results */}
        <div className="flex flex-col gap-2.5 mt-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Suites ({filteredApartments.length})</span>
          {filteredApartments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => setSelectedApartment(apt)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedApartment?.id === apt.id 
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/20' 
                  : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800'
              }`}
            >
              <div>
                <h4 className="text-xs font-bold text-white">{apt.title.split(' - ')[0]}</h4>
                <p className="text-[10px] text-slate-400">{apt.rooms} Rooms • {apt.area} m²</p>
              </div>
              <span className="text-xs font-bold text-indigo-400">${(apt.price / 1000).toFixed(0)}k</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Apartment Detail Modal / Drawer */}
      <AnimatePresence>
        {selectedApartment && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-6 top-24 z-30 w-96 max-h-[calc(100vh-7rem)] overflow-y-auto bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {selectedApartment.status}
                </span>
                <h3 className="text-base font-bold text-white mt-2">{selectedApartment.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Floor {selectedApartment.floor} • {selectedApartment.area} m²</p>
              </div>
              <button
                onClick={() => setSelectedApartment(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-sm font-bold text-indigo-400">
              ${selectedApartment.price.toLocaleString()} <span className="text-xs text-slate-400 font-normal">incl. VAT</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedApartment.description}
            </p>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Architectural Specifications</span>
              <div className="grid grid-cols-2 gap-2">
                {selectedApartment.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-[11px] text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Book Viewing
              </button>
              <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Status bar */}
      <footer className="absolute bottom-4 left-6 right-6 z-20 flex items-center justify-between text-xs text-slate-400 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          <span>Interactive WebGL 3D Engine Active</span>
        </div>
        <div className="hidden md:flex items-center gap-4 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 pointer-events-auto">
          <span>Rotate: Left Click + Drag</span>
          <span>Pan: Right Click + Drag</span>
          <span>Zoom: Scroll</span>
        </div>
      </footer>

    </div>
  );
}