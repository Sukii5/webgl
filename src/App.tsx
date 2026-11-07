import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { SlidersHorizontal, RotateCcw, PhoneCall, Building2, Layers, Palette, Mail } from 'lucide-react';

interface Unit {
  id: string;
  name: string;
  rooms: number;
  size: number;
  price: number;
  description: string;
}

const UNITS: Unit[] = [
  {
    id: 'apt-2a',
    name: 'Apartment 2A',
    rooms: 2,
    size: 64,
    price: 185000,
    description: 'Modern 2-bedroom condominium featuring Nifas Silk washable finishes, custom aluminum ceiling lighting, and 2.20m Australian wood doors.'
  },
  {
    id: 'apt-4b',
    name: 'Apartment 4B',
    rooms: 3,
    size: 96,
    price: 410000,
    description: 'Spacious multi-zone architectural layout with isolated wet kitchen, split bathrooms, and integrated laundry facility.'
  },
  {
    id: 'apt-1c',
    name: 'Apartment 1C',
    rooms: 1,
    size: 45,
    price: 130000,
    description: 'Compact urban studio with optimized spatial planning and custom recessed spotlighting.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'residences' | 'plans' | 'materials' | 'contact'>('residences');
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [minRooms, setMinRooms] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<Unit>(UNITS[0]);

  const filteredUnits = UNITS.filter(
    (unit) => unit.price <= maxPrice && unit.rooms >= minRooms
  );

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex justify-between items-center z-10">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-white">PANOSPHERE STUDIO</h1>
          <p className="text-xs text-slate-400">Architectural 3D Virtual Showcase</p>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex bg-slate-800/60 p-1 rounded-lg border border-slate-700/50">
            <button
              onClick={() => setActiveTab('residences')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'residences' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Residences
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'plans' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Floor Plans
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'materials' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> Materials
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'contact' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Contact
            </button>
          </nav>
          <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all">
            <PhoneCall className="w-4 h-4" /> Request a Call
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Filters and Unit Catalog */}
        <div className="w-96 border-r border-slate-800 bg-slate-900/40 p-6 flex flex-col gap-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-300 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-sky-400" /> Unit Filters
            </h2>
            <button
              onClick={() => { setMaxPrice(500000); setMinRooms(1); }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset View
            </button>
          </div>

          {/* Filter Controls */}
          <div className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Max Price</span>
                <span className="font-semibold text-sky-400">${(maxPrice / 1000).toFixed(0)}k</span>
              </div>
              <input
                type="range"
                min="100000"
                max="500000"
                step="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1.5">Minimum Rooms</span>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((rooms) => (
                  <button
                    key={rooms}
                    onClick={() => setMinRooms(rooms)}
                    className={`py-1.5 text-xs rounded-lg font-medium border transition-all ${
                      minRooms === rooms
                        ? 'bg-sky-600 border-sky-500 text-white shadow'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {rooms}+ Rooms
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Unit List */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium text-slate-400">
              Available Suites ({filteredUnits.length})
            </span>
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                onClick={() => setSelectedUnit(unit)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                  selectedUnit.id === unit.id
                    ? 'bg-slate-800/80 border-sky-500 shadow-lg shadow-sky-950/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-white text-sm">{unit.name}</h3>
                  <span className="text-sky-400 font-bold text-sm">${(unit.price / 1000).toFixed(0)}k</span>
                </div>
                <p className="text-xs text-slate-400">{unit.rooms} Rooms • {unit.size} m²</p>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1">{unit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Area: 3D WebGL Viewport */}
        <div className="flex-1 relative bg-slate-950 flex items-center justify-center">
          <Canvas shadows camera={{ position: [6, 4, 6], fov: 45 }}>
            <color attach="background" args={['#020617']} />
            <Stage environment="city" intensity={0.8} shadows={{ type: 'contact', opacity: 0.4 }}>
              {/* Architectural Showcase 3D Model Representation */}
              <group position={[0, 0, 0]}>
                {/* Base floor slab */}
                <mesh position={[0, -0.1, 0]} receiveShadow>
                  <boxGeometry args={[4, 0.2, 4]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.4} />
                </mesh>
                {/* Architectural volume */}
                <mesh position={[0, 1, 0]} castShadow receiveShadow>
                  <boxGeometry args={[2.5, 2, 2.5]} />
                  <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.1} />
                </mesh>
                {/* Accent structural frame */}
                <mesh position={[0, 1, 1.3]} castShadow>
                  <boxGeometry args={[2.6, 2.1, 0.1]} />
                  <meshStandardMaterial color="#94a3b8" roughness={0.1} metalness={0.8} />
                </mesh>
              </group>
            </Stage>
            <OrbitControls makeDefault autoRotate autoRotateSpeed={0.8} maxPolarAngle={Math.PI / 2.1} />
          </Canvas>

          {/* Floating HUD Overlay */}
          <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-xl shadow-2xl flex flex-col gap-1 pointer-events-none">
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">Active Selection</span>
            <span className="text-sm font-bold text-white">{selectedUnit.name}</span>
            <span className="text-xs text-slate-300">{selectedUnit.rooms} Bedrooms • {selectedUnit.size} m² • ${(selectedUnit.price / 1000).toFixed(0)}k</span>
          </div>
        </div>
      </div>
    </div>
  );
}