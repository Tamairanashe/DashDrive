import React, { useState, useEffect, useRef } from 'react';
import { Polygon, Marker, useMap, Circle, Polyline, Popup } from 'react-leaflet';
import { BaseMap } from '../components/BaseMap';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

import { Maximize2, X, Navigation, MapPin, Car, Bike, User, Layers } from 'lucide-react';
import L from 'leaflet';

// ðŸ”„ Map Synchronization & Resize Helper
const MapAutoResizer = ({ isFullscreen }: { isFullscreen: boolean }) => {
 const map = useMap();
 useEffect(() => {
 // We call invalidateSize multiple times with small delays to ensure 
 // the map captures the container at its final stable fullscreen dimensions
 const timers = [10, 100, 300, 500].map(delay =>
 setTimeout(() => {
 map.invalidateSize();
 }, delay)
 );
 return () => timers.forEach(t => clearTimeout(t));
 }, [map, isFullscreen]);
 return null;
};

// Custom Labeled Marker Creator
const createLabeledIcon = (name: string, color: string = '#00C4B4') => {
 return L.divIcon({
 className: 'custom-div-icon',
 html: `
 <div class="flex flex-col items-center group">
 <div class="w-8 h-8 rounded-full bg-white shadow-lg border-2 border-white flex items-center justify-center overflow-hidden" style="background-color: ${color}">
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
 </div>
 <div class="mt-1 px-3 py-1 bg-white/95 backdrop-blur-sm shadow-xl rounded-lg border border-slate-100 animate-in fade-in zoom-in duration-300">
 <span class="text-[9px] font-black whitespace-nowrap text-slate-700 tracking-tight">${name}</span>
 </div>
 </div>
 `,
 iconSize: [40, 50],
 iconAnchor: [20, 40],
 });
};

interface MapPreviewProps {
 type: 'point' | 'polygon' | 'circle' | 'order-route' | 'heat-map';
 data: any;
 status?: string;
 label?: string;
 mapType?: 'standard' | 'satellite';
}

const FitBounds = ({ points }: { points: [number, number][] }) => {
 const map = useMap();
 useEffect(() => {
 if (points && points.length > 0) {
 const bounds = L.latLngBounds(points);
 map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 });
 }
 }, [points, map]);
 return null;
};

export const MapPreview: React.FC<MapPreviewProps> = ({
 type,
 data,
 status = 'Active',
 label,
 mapType: initialMapType = 'standard'
}) => {
 const [isFullscreen, setIsFullscreen] = useState(false);
 const [mapType, setMapType] = useState(initialMapType);
 const containerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const handleFsChange = () => {
 setIsFullscreen(document.fullscreenElement === containerRef.current);
 };
 document.addEventListener('fullscreenchange', handleFsChange);
 return () => document.removeEventListener('fullscreenchange', handleFsChange);
 }, []);

 const toggleFullscreen = (e: React.MouseEvent) => {
 e.stopPropagation();
 if (!containerRef.current) return;
 if (!document.fullscreenElement) {
 containerRef.current.requestFullscreen().catch(err => {
 console.error(`Error attempting to enable full-screen mode: ${err.message}`);
 });
 } else {
 document.exitFullscreen();
 }
 };

 const getPointsForBounds = (): [number, number][] => {
 if (type === 'order-route') {
 return [data.restaurant, data.customer];
 }
 if (type === 'polygon') return data;
 if (type === 'point') return [data];
 return [[23.8103, 90.4125]];
 };

 const center = type === 'point' ? data :
 type === 'order-route' ? data.restaurant :
 (data[0] || [23.8103, 90.4125]);

 return (
 <div
 ref={containerRef}
 onClick={!isFullscreen ? toggleFullscreen : undefined}
 className={cn(
 "bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative group/map transition-all duration-500 shadow-sm",
 isFullscreen ? "w-full h-full rounded-none border-none fixed inset-0 z-[9999]" : "w-16 h-12 cursor-pointer hover:border-primary/50 hover:shadow-md"
 )}
 >
  <BaseMap
  center={center}
  zoom={14}
  height="100%"
  >
  <MapAutoResizer isFullscreen={isFullscreen} />

  {type === 'point' && <Marker position={data} />}

  {type === 'order-route' && (
  <>
  <Marker
  position={data.restaurant}
  icon={L.divIcon({
  className: 'origin-icon',
  html: '<div class="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg animate-pulse"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
  })}
  />
  <Marker position={data.customer} />
  <Polyline
  positions={[data.restaurant, data.customer]}
  pathOptions={{
  color: '#3b82f6',
  weight: 2,
  dashArray: '5, 10',
  opacity: 0.4
  }}
  />
  </>
  )}

  {type === 'polygon' && (
  <Polygon
  positions={data}
  pathOptions={{
  fillColor: status === 'Active' ? '#00C4B4' : '#64748b',
  fillOpacity: 0.3,
  color: status === 'Active' ? '#00C4B4' : '#64748b',
  weight: isFullscreen ? 3 : 1
  }}
  />
  )}

  <FitBounds points={getPointsForBounds()} />
  </BaseMap>

 {/* UI Overlays */}
 {!isFullscreen ? (
 <>
 <div className="absolute inset-0 bg-transparent z-[1000]" />
 <div className="absolute inset-0 bg-black/0 group-hover/map:bg-black/5 transition-colors z-[1001] flex items-center justify-center">
 <Maximize2 className="w-3.5 h-3.5 text-white opacity-0 group-hover/map:opacity-100 transition-opacity" />
 </div>
 </>
 ) : (
 <div className="absolute inset-0 pointer-events-none z-[10001]">
 <div className="relative w-full h-full p-8 flex flex-col justify-between">
 {/* Header Overlay */}
 <div className="flex items-start justify-between pointer-events-auto">
 <div className="bg-white/95 backdrop-blur-md px-8 py-5 rounded-[28px] shadow-2xl border border-slate-100 animate-in slide-in-from-top-4 duration-500">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
 <Navigation className="w-6 h-6 text-primary" />
 </div>
 <div>
 <p className="text-[10px] font-bold text-slate-400 font-small-caps tracking-[0.2em] mb-0.5">Order Logistics Snapshot</p>
 <h2 className="text-2xl font-display font-black text-slate-800 tracking-tight">{label}</h2>
 </div>
 </div>
 {type === 'order-route' && (
 <div className="mt-6 flex items-center gap-8 border-t border-slate-100 pt-5">
 <div className="flex items-center gap-3">
 <div className="w-2 h-2 rounded-full bg-red-500" />
 <span className="text-[11px] font-bold text-slate-600 font-small-caps">{data.restaurantName} (Origin)</span>
 </div>
 <div className="flex items-center gap-3">
 <div className="w-2 h-2 rounded-full bg-blue-500" />
 <span className="text-[11px] font-bold text-slate-600 font-small-caps">{data.customerName} (Dest)</span>
 </div>
 </div>
 )}
 </div>

 <div className="flex items-center gap-3">
 <button
 onClick={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
 className="bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-xl hover:bg-slate-50 transition-all flex items-center gap-2.5 text-[10px] font-bold font-small-caps text-slate-600 active:scale-95"
 >
 <Layers className="w-4 h-4" />
 {mapType === 'standard' ? 'Satellite' : 'Standard'}
 </button>
 <button
 onClick={toggleFullscreen}
 className="bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl shadow-2xl border border-slate-100 text-slate-500 hover:text-red-500 hover:bg-white transition-all active:scale-95 group"
 >
 <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
 </button>
 </div>
 </div>

 {/* Footer Overlay */}
 <div className="flex items-center justify-between pointer-events-auto">
 <div className="bg-slate-900/95 backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-2xl text-white/90 text-[10px] font-bold font-small-caps animate-in slide-in-from-bottom-4 duration-500">
 {isFullscreen ? 'LIVE ORDER TRACKING ACTIVE' : 'PREVIEW MODE'}
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};
