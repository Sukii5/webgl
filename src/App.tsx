import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { SlidersHorizontal, RotateCcw, PhoneCall, Building2, Layers, Palette, Mail, Search } from 'lucide-react';

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

// High-Fidelity 3D Architectural Apartment Model (64m² 2-Bedroom Layout)
function ApartmentScene() {
  return (
    <group position={[0, 0, 0]}>
      {/* Foundation Base Slab */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[8.2, 0.1, 6.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>

      {/* Flooring Zones */}
      {/* Living & Dining Area */}
      <mesh position={[-1.6, 0.01, 0]} receiveShadow>
        <boxGeometry args={[4.6, 0.02, 5.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>
      {/* Master Bedroom Flooring */}
      <mesh position={[2.4, 0.01, 1.5]} receiveShadow>
        <boxGeometry args={[3.2, 0.02, 2.7]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      {/* Second Bedroom / Office Flooring */}
      <mesh position={[2.4, 0.01, -1.5]} receiveShadow>
        <boxGeometry args={[3.2, 0.02, 2.7]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Outer Perimeter Walls */}
      {/* North Wall */}
      <mesh position={[0, 0.7, -3.05]} castShadow receiveShadow>
        <boxGeometry args={[8.2, 1.4, 0.1]} />
        <meshStandardMaterial color="#475569" roughness={0.2} />
      </mesh>
      {/* South Wall */}
      <mesh position={[0, 0.7, 3.05]} castShadow receiveShadow>
        <boxGeometry args={[8.2, 1.4, 0.1]} />
        <meshStandardMaterial color="#475569" roughness={0.2} />
      </mesh>
      {/* East Wall */}
      <mesh position={[4.05, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 1.4, 6.2]} />
        <meshStandardMaterial color="#475569" roughness={0.2} />
      </mesh>
      {/* West Wall */}
      <mesh position={[-4.05, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 1.4, 6.2]} />
        <meshStandardMaterial color="#475569" roughness={0.2} />
      </mesh>

      {/* Interior Partition Walls */}
      <mesh position={[0.8, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 1.4, 6.0]} />
        <meshStandardMaterial color="#334155" roughness={0.3} />
      </mesh>
      <mesh position={[2.4, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.1, 1.4, 0.1]} />
        <meshStandardMaterial color="#334155" roughness={0.3} />
      </mesh>

      {/* Australian Wood Doors (2.20m scale framing) */}
      <mesh position={[0.8, 0.6, 1.8]}>
        <boxGeometry args={[0.15, 1.2, 0.9]} />
        <meshStandardMaterial color="#78350f" roughness={0.2} />
      </mesh>
      <mesh position={[0.8, 0.6, -1.8]}>
        <boxGeometry args={[0.15, 1.2, 0.9]} />
        <meshStandardMaterial color="#78350f" roughness={0.2} />
      </mesh>

      {/* Interior Furniture & Fixtures */}
      {/* Modern Sectional Sofa */}
      <mesh position={[-2.4, 0.3, 1.2]} castShadow>
        <boxGeometry args={[1.4, 0.5, 2.4]} />
        <meshStandardMaterial color="#0284c7" roughness={0.3} />
      </mesh>
      {/* Coffee Table */}
      <mesh position={[-1.0, 0.2, 1.2]} castShadow>
        <boxGeometry args={[0.9, 0.3, 1.2]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.1} />
      </mesh>
      {/* Dining Table Set */}
      <mesh position={[-2.2, 0.35, -1.5]} castShadow>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        <meshStandardMaterial color="#64748b" roughness={0.4} />
      </mesh>
      {/* Master Bed */}
      <mesh position={[2.5, 0.3, 1.5]} castShadow>
        <boxGeometry args={[2.0, 0.5, 1.8]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.4} />
      </mesh>
      {/* Second Bed */}
      <mesh position={[2.5, 0.3, -1.5]} castShadow>
        <boxGeometry args={[2.0, 0.5, 1.8]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.4} />
      </mesh>

      {/* Architectural Spotlights & Ambient Glow */}
      <pointLight position={[-1.6, 3.2, 0]} intensity={1.8} color="#ffffff" distance={8} />
      <pointLight position={[2.4, 3.2, 1.5]} intensity={1.2} color="#38bdf8" distance={6} />
      <pointLight position={[2.4, 3.2, -1.5]} intensity={1.2} color="#38bdf8" distance={6} />
    </group>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'residences' | 'plans' | 'materials' | 'contact'>('residences');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [minRooms, setMinRooms] = useState<number>(1);
  const [selectedUnit, setSelectedUnit] = useState<Unit>(UNITS[0]);

  const filteredUnits = UNITS.filter(
    (unit) =>
      unit.price <= maxPrice &&
      unit.rooms >= minRooms &&
      (unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       unit.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <header className="px-8 py-5 border-b border-slate-800 bg-slate-900/90 backdrop-blur flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-20">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-white">PANOSPHERE STUDIO</h1>
          <p className="text-xs text-slate-400 mt-0.5">Architectural 3D Virtual Showcase</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <nav className="flex bg-slate-800/60 p-1 rounded-lg border border-slate-700/50">
            <button
              onClick={() => setActiveTab('residences')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'residences' ? 'bg-white text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Residences
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'plans' ? 'bg-white text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Floor Plans
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'materials' ? 'bg-white text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> Materials
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'contact' ? 'bg-white text-slate-950 shadow' : 'text-slate-300 hover:text-white'
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

      {/* 3D Architectural Viewport Banner */}
      <div className="w-full h-[500px] relative bg-slate-950 border-b border-slate-800">
        <Canvas shadows camera={{ position: [8, 7, 9], fov: 45 }} style={{ width: '100%', height: '100%' }}>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[12, 18, 12]} intensity={1.4} castShadow shadow-mapSize={[2048, 2048]} />
          
          <ApartmentScene />
          
          <ContactShadows position={[0, -0.06, 0]} opacity={0.7} scale={14} blur={1.8} far={12} />
          <OrbitControls makeDefault autoRotate autoRotateSpeed={0.4} minPolarAngle={Math.PI / 6} maxPolarAngle={Math.PI / 2.2} />
        </Canvas>

        {/* Floating Card Stack / HUD Overlay */}
        <div className="absolute top-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700/80 p-4 rounded-xl shadow-2xl flex flex-col gap-1 z-10 w-72">
          <span className="text-[10px] uppercase tracking-wider text-sky-400 font-bold">Interactive 3D Floor Plan</span>
          <span className="text-base font-bold text-white">{selectedUnit.name} ({selectedUnit.size} m²)</span>
          <span className="text-xs text-slate-300 font-semibold">${(selectedUnit.price / 1000).toFixed(0)}k</span>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-3">{selectedUnit.description}</p>
        </div>
      </div>

      {/* Main Content & Filters Section */}
      <main className="max-w-7xl w-full mx-auto p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold tracking-wide uppercase text-slate-200 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-sky-400" /> Unit Filters
            </h2>
            <button
              onClick={() => { setMaxPrice(500000); setMinRooms(1); setSearchQuery(''); }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset View
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-2 border-t border-slate-800/80">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search suite or specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-2">
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
              <span className="text-xs text-slate-400 block mb-2">Minimum Rooms</span>
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
        </div>

        {/* Available Suites Grid */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-slate-300">
            Available Suites ({filteredUnits.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                onClick={() => setSelectedUnit(unit)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  selectedUnit.id === unit.id
                    ? 'bg-slate-900 border-sky-500 shadow-xl shadow-sky-950/40 ring-1 ring-sky-500/50'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-base">{unit.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{unit.rooms} Rooms • {unit.size} m²</p>
                  </div>
                  <span className="text-sky-400 font-bold text-lg">${(unit.price / 1000).toFixed(0)}k</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{unit.description}</p>
                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-sky-400 font-medium">
                  <span>Explore 3D Model</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}