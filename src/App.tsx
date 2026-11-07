import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
// Pannellum script / CSS can also be imported or loaded via CDN in index.html

export default function App() {
  const [viewState, setViewState] = useState<'landing' | 'building' | 'interior'>('landing');
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [currentScenes, setCurrentScenes] = useState<any[]>([]);
  const [activeScene, setActiveScene] = useState<any>(null);
  const viewerRef = useRef<any>(null);

  // 1. Triggered when user clicks "Find your home in Aria" / Apartment 4B
  const handleSelectApartment = async (tourId: string) => {
    // Smooth transition trigger (e.g. fade overlay)
    const overlay = document.getElementById('transition-overlay');
    if (overlay) overlay.style.opacity = '1';

    setTimeout(async () => {
      // Fetch tour and scenes from Supabase tables ('tours' and 'scenes')
      const { data: tour } = await supabase.from('tours').select('*').eq('id', tourId).single();
      const { data: scenes } = await supabase.from('scenes').select('*').eq('tour_id', tourId).order('order_index');

      if (tour && scenes && scenes.length > 0) {
        setSelectedTour(tour);
        setCurrentScenes(scenes);
        setActiveScene(scenes[0]);
        setViewState('interior');
      }

      if (overlay) overlay.style.opacity = '0';
    }, 400);
  };

  // 2. Initialize Pannellum 360 Viewer when entering interior view
  useEffect(() => {
    if (viewState === 'interior' && activeScene && (window as any).pannellum) {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }

      // Build scenes configuration for Pannellum
      const scenesConfig: Record<string, any> = {};
      currentScenes.forEach((scene) => {
        scenesConfig[scene.id] = {
          title: scene.title,
          type: "equirectangular",
          panorama: scene.panorama_url,
          autoLoad: true,
          hotSpots: (scene.hotspots || []).map((hs: any) => ({
            pitch: hs.pitch,
            yaw: hs.yaw,
            type: "info",
            text: hs.label,
            clickHandlerFunc: () => {
              const target = currentScenes.find(s => s.id === hs.target_scene_id);
              if (target && (window as any).viewer) {
                (window as any).viewer.loadScene(target.id);
                setActiveScene(target);
              }
            }
          }))
        };
      });

      // Initialize viewer instance
      (window as any).viewer = (window as any).pannellum.viewer('panorama-container', {
        default: {
          firstScene: activeScene.id,
          sceneFadeDuration: 600,
          compass: true
        },
        scenes: scenesConfig
      });
      viewerRef.current = (window as any).viewer;
    }
  }, [viewState, activeScene]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans">
      {/* Transition Overlay */}
      <div id="transition-overlay" className="absolute inset-0 bg-black opacity-0 pointer-events-none transition-opacity duration-500 z-50"></div>

      {/* LANDING / BUILDING WEBGL VIEW */}
      {viewState !== 'interior' && (
        <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
          <header className="flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-wider">Aria Residences</h1>
            <button onClick={() => setViewState('building')} className="px-5 py-2 bg-amber-500 text-black font-semibold rounded-full shadow-lg hover:bg-amber-400 transition">
              Explore Building
            </button>
          </header>

          <div className="max-w-xl space-y-4">
            <h2 className="text-5xl font-extrabold tracking-tight">Find your home in Aria</h2>
            <p className="text-slate-300">Interactive 3D architectural visualization and immersive living spaces.</p>
            <button 
              onClick={() => handleSelectApartment('your-supabase-tour-uuid-here')}
              className="px-6 py-3 bg-white text-black font-bold rounded-xl shadow-xl hover:bg-slate-200 transition"
            >
              View Apartment 4B (€199,000)
            </button>
          </div>
        </div>
      )}

      {/* SEAMLESS INTERIOR 360° PANORAMIC VIEWER VIEW */}
      {viewState === 'interior' && (
        <div className="absolute inset-0 z-30 flex flex-col">
          {/* Top Bar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4">
            <span className="w-3 h-3 rounded-full bg-sky-400 animate-pulse"></span>
            <div>
              <h3 className="text-sm font-bold">{selectedTour?.title}</h3>
              <p className="text-xs text-slate-400">{activeScene?.title}</p>
            </div>
            <button 
              onClick={() => setViewState('landing')} 
              className="ml-4 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold transition"
            >
              Back to Building
            </button>
          </div>

          {/* Pannellum Container */}
          <div id="panorama-container" className="w-full h-full"></div>

          {/* Room Navigation Thumbnail Drawer */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3 overflow-x-auto">
            {currentScenes.map((scene) => (
              <div 
                key={scene.id}
                onClick={() => {
                  setActiveScene(scene);
                  if ((window as any).viewer) (window as any).viewer.loadScene(scene.id);
                }}
                className={`relative w-20 h-14 rounded-xl overflow-hidden cursor-pointer border-2 transition ${activeScene?.id === scene.id ? 'border-sky-400 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={scene.panorama_url} alt={scene.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-center font-medium truncate px-1">{scene.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}