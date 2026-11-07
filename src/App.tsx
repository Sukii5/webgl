import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, BedDouble, Bath, Compass, Expand, Heart, RotateCcw, Ruler, Sun, X } from 'lucide-react';
import * as THREE from 'three';

interface Unit {
  id: string; name: string; rooms: number; size: number; price: number;
  bathrooms: number; floor: string; orientation: string; energy: string; completion: string; description: string;
}

const UNITS: Unit[] = [
  { id: 'apt-2a', name: 'Apartment 2A', rooms: 2, size: 64, price: 185000, bathrooms: 1, floor: '2nd floor', orientation: 'South-east', energy: 'A', completion: 'Ready to move in', description: 'A calm, considered home with generous natural light and an efficient open-plan living space.' },
  { id: 'apt-4b', name: 'Apartment 4B', rooms: 3, size: 96, price: 410000, bathrooms: 2, floor: '4th floor', orientation: 'South-west', energy: 'A+', completion: 'December 2026', description: 'A spacious multi-zone residence with a separate kitchen, generous bedrooms and an inviting living area.' },
  { id: 'apt-1c', name: 'Apartment 1C', rooms: 1, size: 45, price: 130000, bathrooms: 1, floor: '1st floor', orientation: 'East', energy: 'B', completion: 'Ready to move in', description: 'A beautifully optimized urban home with thoughtful storage and a bright, open living area.' },
];

function Box({ position, size, color, roughness = 0.82, rotation }: { position: [number, number, number]; size: [number, number, number]; color: string; roughness?: number; rotation?: [number, number, number] }) {
  return <mesh position={position} rotation={rotation} castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={roughness} /></mesh>;
}
function Rug({ position, size = [3.1, 2.2] as [number, number], color = '#d8cbbb' }: { position: [number, number, number]; size?: [number, number]; color?: string }) {
  return <Box position={position} size={[size[0], 0.035, size[1]]} color={color} />;
}
function Sofa({ position }: { position: [number, number, number] }) {
  return <group position={position}>
    <Box position={[0, .32, 0]} size={[2.15, .48, .82]} color="#b8a895" />
    <Box position={[0, .72, -.31]} size={[2.15, .72, .22]} color="#c7b9a8" />
    {[-.78, 0, .78].map((x) => <Box key={x} position={[x, .68, -.08]} size={[.65, .15, .56]} color="#dfd4c7" />)}
    {[-.91, .91].map((x) => <Box key={x} position={[x, .46, .02]} size={[.22, .58, .86]} color="#a99580" />)}
    {[ -.78, .78 ].map(x => <Box key={x} position={[x, .12, .28]} size={[.12,.22,.12]} color="#765f4d" />)}
  </group>;
}
function Bed({ position, double = true }: { position: [number, number, number]; double?: boolean }) {
  const w = double ? 1.75 : 1.25;
  return <group position={position}>
    <Box position={[0,.22,0]} size={[w,.34,2.05]} color="#806c5a" />
    <Box position={[0,.43,.02]} size={[w-.12,.18,1.92]} color="#eee9df" />
    <Box position={[-w*.25,.56,-.62]} size={[w*.38,.16,.42]} color="#faf7f0" />
    <Box position={[w*.25,.56,-.62]} size={[w*.38,.16,.42]} color="#faf7f0" />
    <Box position={[0,.54,-1.03]} size={[w,.9,.12]} color="#9c8066" />
    <Box position={[-w*.32,.1,.78]} size={[.12,.2,.12]} color="#604d3d" />
    <Box position={[w*.32,.1,.78]} size={[.12,.2,.12]} color="#604d3d" />
  </group>;
}
function Plant({ position }: { position: [number, number, number] }) {
  return <group position={position}>
    <mesh position={[0,.2,0]} castShadow><cylinderGeometry args={[.22,.17,.4,16]} /><meshStandardMaterial color="#b78f70" roughness={.9}/></mesh>
    {[0,1,2,3,4].map((i) => <mesh key={i} position={[Math.sin(i*1.25)*.12,.62+(i%2)*.12,Math.cos(i*1.25)*.12]} rotation={[.2, i, -.35+ i*.12]} castShadow><coneGeometry args={[.13,.65,7]} /><meshStandardMaterial color={i%2 ? '#68775c' : '#849274'} roughness={1}/></mesh>)}
  </group>;
}
function ApartmentModel({ variant }: { variant: string }) {
  const isLarge = variant === 'apt-4b';
  const isSmall = variant === 'apt-1c';
  const wall = '#eee9df';
  const floor = '#c9b69f';
  const roomScale = isSmall ? .82 : isLarge ? 1.08 : 1;
  return <group scale={roomScale} position={[0,-.2,0]}>
    {/* Single continuous timber floor and low plinth */}
    <Box position={[0,-.12,0]} size={[10.2,.22,7.4]} color="#9a8976" />
    <Box position={[0,.015,0]} size={[10,.08,7.2]} color={floor} />
    {/* Rear and side walls; front remains open for the cutaway view */}
    <Box position={[0,1.32,-3.52]} size={[10,.0+2.65,.16]} color={wall} />
    <Box position={[-4.92,1.32,0]} size={[.16,2.65,7.15]} color="#e4ddd1" />
    <Box position={[4.92,1.32,0]} size={[.16,2.65,7.15]} color="#e4ddd1" />
    {/* Internal partitions */}
    <Box position={[-1.65,1.25,-1.95]} size={[.12,2.45,3.1]} color="#e8e1d6" />
    <Box position={[1.55,1.25,-1.95]} size={[.12,2.45,3.1]} color="#e8e1d6" />
    <Box position={[0,1.2,.1]} size={[.12,2.3,2.35]} color="#e8e1d6" />
    {isLarge && <Box position={[3.1,1.2,.8]} size={[.12,2.3,2.7]} color="#e8e1d6" />}
    {/* Back windows */}
    {[-3.25,0,3.25].map((x) => <group key={x} position={[x,1.62,-3.425]}><Box position={[0,0,0]} size={[1.7,1.45,.045]} color="#b5c5c6" roughness={.18}/><Box position={[0,0,.035]} size={[.055,1.5,.07]} color="#f8f5ed"/><Box position={[0,0,.04]} size={[1.75,.055,.07]} color="#f8f5ed"/></group>)}
    {/* Kitchen at back-left */}
    <Rug position={[-3.25,.075,-2.35]} size={[2.7,1.65]} color="#b8a58e" />
    {[-4.05,-3.25,-2.45].map(x => <Box key={x} position={[x,.48,-2.95]} size={[.72,.88,.9]} color="#e5ded2" />)}
    <Box position={[-3.25,.96,-2.95]} size={[2.55,.13,1.02]} color="#5c5b55" roughness={.3}/>
    <Box position={[-3.25,.99,-2.95]} size={[2.45,.035,.92]} color="#ddd8ce" roughness={.25}/>
    <Box position={[-3.35,1.04,-2.9]} size={[.42,.035,.38]} color="#484d4b" roughness={.2}/>
    <Box position={[-2.55,1.08,-2.95]} size={[.38,.12,.38]} color="#b8b8b0" roughness={.25}/>
    {/* Dining table */}
    <Box position={[-1.1,.72,-.25]} size={[1.5,.13,1.05]} color="#8a6e55" />
    {[-1.65,-.55].flatMap(x => [-.58,.08].map(z => <Box key={`${x}-${z}`} position={[x,.38,z]} size={[.09,.68,.09]} color="#715b48"/>))}
    {[-1.75,-.45].map(x => <group key={x}><Box position={[x,.38,-.25]} size={[.42,.62,.42]} color="#c2b29e"/><Box position={[x,.72,-.25]} size={[.45,.1,.45]} color="#d8cbbc"/></group>)}
    {/* Living room */}
    <Rug position={[2.35,.08,.65]} size={[3.6,2.65]} color="#e1d9ce" />
    <Sofa position={[2.35,.08,1.45]} />
    <Box position={[2.35,.42,-.05]} size={[1.25,.18,.72]} color="#8e735c" />
    <Box position={[2.35,.53,-.05]} size={[1.32,.07,.78]} color="#d0c2b0" />
    <Plant position={[4.15,.08,2.2]} />
    {/* Bedroom 1 */}
    <Rug position={[-3.2,.08,.75]} size={[2.7,2.7]} color="#ded5c8" />
    <Bed position={[-3.2,.08,.65]} />
    <Box position={[-4.35,.72,-.45]} size={[.78,1.35,.62]} color="#a58b70" />
    <Box position={[-4.35,1.42,-.45]} size={[.82,.08,.66]} color="#d4c4af" />
    <Plant position={[-4.25,.08,2.75]} />
    {/* Bedroom 2 */}
    {!isSmall && <><Rug position={[0,.08,2.55]} size={[2.6,2.1]} color="#ded5c8"/><Bed position={[0,.08,2.3]} double={false}/><Box position={[1.05,.62,1.45]} size={[.62,1.15,.55]} color="#a58b70"/></>}
    {isLarge && <><Rug position={[3.25,.08,-2.2]} size={[2.3,1.8]} color="#d9d0c4"/><Bed position={[3.25,.08,-2.25]} /></>}
    {/* Bathroom fixtures */}
    <Box position={[1.95,.3,-2.8]} size={[1.15,.5,.85]} color="#e7e5df" />
    <Box position={[2.1,.62,-2.78]} size={[.72,.18,.56]} color="#faf9f5" />
    <Box position={[3.55,.35,-2.8]} size={[.62,.62,.68]} color="#f8f7f2" />
    <Plant position={[4.35,.08,-.6]} />
    {/* Front edge trim */}
    <Box position={[0,.07,3.58]} size={[10,.12,.12]} color="#a68e75" />
  </group>;
}

function formatPrice(price: number) { return `$${price.toLocaleString('en-US')}`; }

export default function App() {
  const [selected, setSelected] = useState(UNITS[1]);
  const [saved, setSaved] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'plan'>('3d');
  const [showContact, setShowContact] = useState(false);

  return <div className="site-shell">
    <header className="topbar">
      <a className="brand" href="#top" aria-label="PanoSphere home"><span className="brand-mark">P.</span><span><strong>PANOSPHERE</strong><small>SPACES, REIMAGINED</small></span></a>
      <nav className="desktop-nav"><a href="#residences" className="nav-active">Residences</a><a href="#experience">The experience</a><a href="#details">About the residence</a></nav>
      <button className="header-cta" onClick={() => setShowContact(true)}>Arrange a viewing <ArrowRight size={15}/></button>
    </header>

    <main id="top">
      <section className="intro-band">
        <div className="eyebrow"><span className="eyebrow-line"/> A NEW PERSPECTIVE ON HOME</div>
        <div className="intro-row"><div><h1>Space to live.<br/><em>Room to become.</em></h1></div><p>Explore thoughtfully designed residences through an entirely new perspective. Discover every detail before you step inside.</p></div>
      </section>

      <section className="showcase" id="residences">
        <div className="showcase-top"><div><span className="section-kicker">THE RESIDENCES / 01—03</span><h2>Explore your space</h2></div><div className="view-controls"><button className={viewMode === '3d' ? 'view-active' : ''} onClick={() => setViewMode('3d')}>3D view</button><button className={viewMode === 'plan' ? 'view-active' : ''} onClick={() => setViewMode('plan')}>Floor plan</button></div></div>
        <div className="viewer-layout" id="experience">
          <div className="model-stage">
            <div className="stage-label"><span className="live-dot"/> INTERACTIVE MODEL <span className="stage-divider">/</span> DRAG TO EXPLORE</div>
            <Canvas key={viewMode} shadows dpr={[1, 1.7]} camera={{ position: viewMode === 'plan' ? [0, 17, 0.01] : [11, 10, 12], fov: viewMode === 'plan' ? 38 : 34 }} gl={{ antialias: true, alpha: false }}>
              <color attach="background" args={['#f1eee8']} />
              <ambientLight intensity={1.15}/>
              <directionalLight position={[7,12,8]} intensity={2.2} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10}/>
              <directionalLight position={[-7,6,-4]} intensity={.55} color="#fff0d9"/>
              <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.5,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial opacity={.15}/></mesh>
              <ApartmentModel variant={selected.id}/>
              <ContactShadows position={[0,-.48,0]} opacity={.28} scale={18} blur={2.6} far={8}/>
              <OrbitControls makeDefault target={[0,.4,0]} minDistance={8} maxDistance={21} minPolarAngle={viewMode === 'plan' ? .01 : .45} maxPolarAngle={viewMode === 'plan' ? .01 : 1.35} enableRotate={viewMode !== 'plan'} enablePan={false} />
            </Canvas>
            <div className="stage-bottom"><span>01 / 03 <b>—</b> {selected.name.toUpperCase()}</span><button onClick={() => window.location.reload()} aria-label="Reset view"><RotateCcw size={14}/> Reset view</button></div>
            <div className="compass"><Compass size={16}/><span>N</span></div>
          </div>

          <aside className="property-panel" id="details">
            <div className="panel-topline"><span>FEATURED RESIDENCE</span><button className={`save-button ${saved ? 'is-saved' : ''}`} onClick={() => setSaved(!saved)} aria-label="Save residence"><Heart size={17} fill={saved ? 'currentColor' : 'none'}/></button></div>
            <AnimatePresence mode="wait"><motion.div key={selected.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.25}}>
              <div className="unit-number">RESIDENCE 0{UNITS.findIndex(u => u.id === selected.id)+1}</div>
              <h3>{selected.name}</h3>
              <div className="price">{formatPrice(selected.price)} <span> / asking price</span></div>
              <p className="property-description">{selected.description}</p>
              <div className="spec-grid">
                <div className="spec"><Ruler/><strong>{selected.size} m²</strong><span>Floor area</span></div>
                <div className="spec"><BedDouble/><strong>{selected.rooms}</strong><span>Bedrooms</span></div>
                <div className="spec"><Bath/><strong>{selected.bathrooms}</strong><span>Bathrooms</span></div>
                <div className="spec"><Sun/><strong>{selected.orientation}</strong><span>Orientation</span></div>
              </div>
              <div className="detail-list"><div><span>Floor</span><strong>{selected.floor}</strong></div><div><span>Energy rating</span><strong>{selected.energy}</strong></div><div><span>Completion</span><strong>{selected.completion}</strong></div></div>
              <button className="primary-cta" onClick={() => setShowContact(true)}>Book a private viewing <ArrowRight size={16}/></button>
              <button className="text-cta" onClick={() => { setViewMode('3d'); window.scrollTo({top: document.getElementById('experience')?.offsetTop ?? 0, behavior:'smooth'}); }}><Expand size={14}/> Explore the apartment</button>
            </motion.div></AnimatePresence>
          </aside>
        </div>
        <div className="selector-row"><div><span className="section-kicker">FIND YOUR FIT</span><h2>Discover the collection</h2></div><span className="selector-note">Select a residence to explore its details</span></div>
        <div className="unit-selector">{UNITS.map((unit, index) => <button key={unit.id} className={`unit-option ${selected.id === unit.id ? 'unit-selected' : ''}`} onClick={() => setSelected(unit)}><span className="unit-index">0{index+1}</span><span className="unit-copy"><strong>{unit.name}</strong><small>{unit.size} m² <i>·</i> {unit.rooms} bedrooms</small></span><span className="unit-price">{formatPrice(unit.price)}</span><ArrowDownRight className="unit-arrow" size={17}/></button>)}</div>
      </section>
      <section className="closing-band"><div><span className="section-kicker">YOUR NEXT CHAPTER STARTS HERE</span><h2>Come see what<br/><em>feels like home.</em></h2></div><button className="closing-cta" onClick={() => setShowContact(true)}>Arrange a private viewing <ArrowRight size={16}/></button></section>
    </main>
    <footer><span className="footer-brand">PANOSPHERE</span><span>DESIGNED FOR THE WAY YOU LIVE.</span><span>© 2026 PANOSPHERE STUDIO</span></footer>

    {showContact && <div className="modal-backdrop" onClick={() => setShowContact(false)}><div className="contact-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setShowContact(false)}><X size={18}/></button><span className="section-kicker">LET'S CONNECT</span><h2>Arrange a viewing</h2><p>Our residence team will be happy to help you discover {selected.name}.</p><form onSubmit={e => {e.preventDefault(); setShowContact(false); alert('Thank you. Your viewing request has been noted.');}}><label>Your name<input required placeholder="Full name"/></label><label>Email address<input required type="email" placeholder="you@example.com"/></label><label>Interested in<select value={selected.id} onChange={e => setSelected(UNITS.find(u => u.id === e.target.value) || UNITS[0])}>{UNITS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></label><button className="primary-cta" type="submit">Send viewing request <ArrowRight size={16}/></button></form></div></div>}
  </div>;
}
