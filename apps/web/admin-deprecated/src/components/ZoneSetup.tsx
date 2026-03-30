import React, { useState, useEffect, useRef } from 'react';
import {
 Info, Map as MapIcon, Search, Layers, Maximize2, Plus, Minus, RefreshCw,
 Download, MoreVertical, Edit3, Trash2, CheckCircle2, XCircle, X, Filter,
 Grid, ChevronRight, ChevronLeft, ChevronDown, History, Files, MousePointer2,
 Hand, MapPin, Car, DollarSign, AlertCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '../utils';
import { Tabs } from 'antd';
import { MapPreview } from './MapPreview';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
 iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
 iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
 shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper to check if two line segments (p1,q1) and (p2,q2) intersect
const doIntersect = (p1: [number, number], q1: [number, number], p2: [number, number], q2: [number, number]) => {
 const onSegment = (p: [number, number], q: [number, number], r: [number, number]) => {
 return q[1] <= Math.max(p[1], r[1]) && q[1] >= Math.min(p[1], r[1]) &&
 q[0] <= Math.max(p[0], r[0]) && q[0] >= Math.min(p[0], r[0]);
 };

 const orientation = (p: [number, number], q: [number, number], r: [number, number]) => {
 const val = (q[0] - p[0]) * (r[1] - q[1]) - (q[1] - p[1]) * (r[0] - q[0]);
 if (val === 0) return 0; // colinear
 return (val > 0) ? 1 : 2; // clock or counterclock
 };

 const o1 = orientation(p1, q1, p2);
 const o2 = orientation(p1, q1, q2);
 const o3 = orientation(p2, q2, p1);
 const o4 = orientation(p2, q2, q1);

 // General case
 if (o1 !== o2 && o3 !== o4) return true;

 // Special Cases
 if (o1 === 0 && onSegment(p1, p2, q1)) return true;
 if (o2 === 0 && onSegment(p1, q2, q1)) return true;
 if (o3 === 0 && onSegment(p2, p1, q2)) return true;
 if (o4 === 0 && onSegment(p2, q1, q2)) return true;

 return false;
};

const checkSelfIntersection = (points: [number, number][]) => {
 if (points.length < 4) return false;

 const edges = [];
 for (let i = 0; i < points.length; i++) {
 edges.push({ p1: points[i], p2: points[(i + 1) % points.length] });
 }

 for (let i = 0; i < edges.length; i++) {
 for (let j = i + 2; j < edges.length; j++) {
 // Don't check adjacent edges (they share a vertex)
 if (i === 0 && j === edges.length - 1) continue;

 if (doIntersect(edges[i].p1, edges[i].p2, edges[j].p1, edges[j].p2)) {
 return true;
 }
 }
 }
 return false;
};

interface Zone {
 id: string;
 name: string;
 volume: 'Low' | 'Medium' | 'High';
 extraFareEnabled: boolean;
 extraFarePercent: number;
 status: 'Active' | 'Inactive';
 points: [number, number][]; // [lat, lng]
}

interface LogEntry {
 id: string;
 date: string;
 time: string;
 editedBy: string;
 editedObject: string;
 beforeStatus: string;
 afterStatus: string;
}

const initialZones: Zone[] = [
 { id: '1', name: 'Dhanmondi', volume: 'High', extraFareEnabled: true, extraFarePercent: 15, status: 'Active', points: [[23.7516, 90.3704], [23.7556, 90.3804], [23.7456, 90.3854], [23.7406, 90.3754]] },
 { id: '2', name: 'Gulshan', volume: 'Medium', extraFareEnabled: false, extraFarePercent: 0, status: 'Active', points: [[23.7925, 90.4078], [23.7985, 90.4178], [23.7885, 90.4228], [23.7825, 90.4128]] },
 { id: '3', name: 'Uttara', volume: 'Low', extraFareEnabled: false, extraFarePercent: 0, status: 'Inactive', points: [[23.8759, 90.3795], [23.8859, 90.3895], [23.8659, 90.3995], [23.8559, 90.3895]] },
];

const mockLogs: LogEntry[] = [];

export const ZoneSetup: React.FC = () => {
 const [activeView, setActiveView] = useState<'setup' | 'trash' | 'activityLog'>('setup');
 const [selectedZoneName, setSelectedZoneName] = useState<string>('');
 const [logSearchQuery, setLogSearchQuery] = useState('');
 const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Inactive'>('All');
 const [zones, setZones] = useState<Zone[]>(initialZones);
 const [searchQuery, setSearchQuery] = useState('');
 const [deletedZones, setDeletedZones] = useState<Zone[]>([
 { id: '4', name: 'Old Town', volume: 'Medium', extraFareEnabled: false, extraFarePercent: 0, status: 'Inactive', points: [[23.7231, 90.3925], [23.7281, 90.3975], [23.7181, 90.4025]] }
 ]);
 const [zoneName, setZoneName] = useState('');
 const [nameError, setNameError] = useState(false);
 const [points, setPoints] = useState<[number, number][]>([]);
 const [mousePos, setMousePos] = useState<[number, number] | null>(null);
 const [isInvalid, setIsInvalid] = useState(false);
 const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null);
 const [activeTool, setActiveTool] = useState<'draw' | 'hand'>('draw');
 const [isExtraFareModalOpen, setIsExtraFareModalOpen] = useState(false);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [zoneToDeleteId, setZoneToDeleteId] = useState<string | null>(null);
 const [editingZone, setEditingZone] = useState<Zone | null>(null);
 const [isConfirmTurnOffModalOpen, setIsConfirmTurnOffModalOpen] = useState(false);
 const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
 const [globalExtraFare, setGlobalExtraFare] = useState({
 enabled: false,
 percent: 30,
 reason: 'Heavy Traffic'
 });
 const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
 const mapContainerRef = useRef<HTMLDivElement>(null);
 const modalMapContainerRef = useRef<HTMLDivElement>(null);
 const [isFullscreen, setIsFullscreen] = useState(false);
 const [isModalFullscreen, setIsModalFullscreen] = useState(false);

 useEffect(() => {
 const handleFullscreenChange = () => {
 setIsFullscreen(document.fullscreenElement === mapContainerRef.current);
 setIsModalFullscreen(document.fullscreenElement === modalMapContainerRef.current);
 };
 document.addEventListener('fullscreenchange', handleFullscreenChange);
 return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
 }, []);

 const toggleFullscreen = () => {
 if (!mapContainerRef.current) return;
 if (!document.fullscreenElement) {
 mapContainerRef.current.requestFullscreen().catch(err => {
 console.error(`Error attempting to enable full-screen mode: ${err.message}`);
 });
 } else {
 document.exitFullscreen();
 }
 };

 const toggleModalFullscreen = () => {
 if (!modalMapContainerRef.current) return;
 if (!document.fullscreenElement) {
 modalMapContainerRef.current.requestFullscreen().catch(err => {
 console.error(`Error attempting to enable full-screen mode: ${err.message}`);
 });
 } else {
 document.exitFullscreen();
 }
 };

 // Map Helper Components
 const MapEvents = ({ onMapClick, onMapMouseMove, onMapDoubleClick }: any) => {
 useMapEvents({
 mousedown: (e) => {
 if (activeTool === 'hand') return;
 onMapClick([e.latlng.lat, e.latlng.lng]);
 },
 mousemove: (e) => {
 onMapMouseMove([e.latlng.lat, e.latlng.lng]);
 },
 dblclick: (e) => {
 if (activeTool === 'draw') {
 onMapDoubleClick();
 }
 }
 });
 return null;
 };

 const handleMapClick = (latlng: [number, number]) => {
 if (draggedPointIndex !== null || activeTool === 'hand') return;

 // Check if we're clicking the first point to close the polygon
 // Note: Leaflet distance is in meters, for simplicity we'll check lat/lng proximity
 if (points.length >= 3) {
 const firstPoint = points[0];
 const latDist = Math.abs(firstPoint[0] - latlng[0]);
 const lngDist = Math.abs(firstPoint[1] - latlng[1]);
 if (latDist < 0.0005 && lngDist < 0.0005) { // Rough threshold
 setActiveTool('hand');
 return;
 }
 }

 const newPoints = [...points, latlng];
 setPoints(newPoints);
 setIsInvalid(checkSelfIntersection(newPoints));
 };

 const handleMapDoubleClick = () => {
 if (activeTool === 'draw' && points.length >= 2) {
 const finalPoints = points.slice(0, -1); // double click usually adds one point we don't want
 setPoints(finalPoints);
 setIsInvalid(checkSelfIntersection(finalPoints));
 setActiveTool('hand');
 }
 };

 const handleMouseMove = (latlng: [number, number]) => {
 setMousePos(latlng);

 if (draggedPointIndex !== null) {
 const newPoints = [...points];
 newPoints[draggedPointIndex] = latlng;
 setPoints(newPoints);
 setIsInvalid(checkSelfIntersection(newPoints));
 return;
 }

 if (points.length >= 2) {
 const tempPoints = [...points, latlng];
 setIsInvalid(checkSelfIntersection(tempPoints));
 }
 };

 const handlePointDelete = (index: number) => {
 if (activeTool === 'hand') {
 if (points.length <= 3) {
 alert("A zone must have at least 3 points. Cannot delete.");
 return;
 }
 const newPoints = points.filter((_, i) => i !== index);
 setPoints(newPoints);
 setIsInvalid(checkSelfIntersection(newPoints));
 }
 };

 const handleMouseUp = () => {
 setDraggedPointIndex(null);
 };

 const handleSubmit = () => {
 if (!zoneName.trim()) {
 setNameError(true);
 return;
 }
 setNameError(false);

 if (points.length < 3) {
 alert("Please draw a zone with at least 3 points on the map.");
 return;
 }
 if (isInvalid) {
 alert("The drawn zone is invalid (self-intersecting). Please redraw.");
 return;
 }
 if (activeTool === 'draw') {
 alert("Please close the polygon or switch to selection mode before submitting.");
 return;
 }

 const newZone: Zone = {
 id: Math.random().toString(36).substr(2, 9),
 name: zoneName,
 volume: 'Low',
 extraFareEnabled: false,
 extraFarePercent: 0,
 status: 'Active',
 points: [...points]
 };

 setZones(prev => [newZone, ...prev]);
 setZoneName('');
 setPoints([]);
 setActiveTool('draw'); // Reset tool after submission
 };

 const handleRestore = (id: string) => {
 const zoneToRestore = deletedZones.find(z => z.id === id);
 if (zoneToRestore) {
 setZones(prev => [...prev, zoneToRestore]);
 setDeletedZones(prev => prev.filter(z => z.id !== id));
 }
 };

 const handleDeleteClick = (id: string) => {
 setZoneToDeleteId(id);
 setIsDeleteModalOpen(true);
 };

 const confirmDelete = () => {
 if (!zoneToDeleteId) return;
 const zoneToDelete = zones.find(z => z.id === zoneToDeleteId);
 if (zoneToDelete) {
 setDeletedZones(prev => [...prev, zoneToDelete]);
 setZones(prev => prev.filter(z => z.id !== zoneToDeleteId));
 }
 setIsDeleteModalOpen(false);
 setZoneToDeleteId(null);
 };

 const handleToggleStatus = (id: string) => {
 setZones(prev => prev.map(zone =>
 zone.id === id
 ? { ...zone, status: zone.status === 'Active' ? 'Inactive' : 'Active' }
 : zone
 ));
 };

 const handleToggleExtraFare = (id: string) => {
 setZones(prev => prev.map(zone =>
 zone.id === id
 ? { ...zone, extraFareEnabled: !zone.extraFareEnabled, extraFarePercent: !zone.extraFareEnabled ? 15 : 0 }
 : zone
 ));
 };

 const handleEdit = (zone: Zone) => {
 setEditingZone({ ...zone });
 setPoints(zone.points);
 setZoneName(zone.name);
 setIsEditModalOpen(true);
 setActiveTool('hand'); // Start in hand mode for editing existing zones
 };

 const handleUpdateZone = () => {
 if (!editingZone) return;
 if (!zoneName.trim()) {
 setNameError(true);
 return;
 }
 if (points.length < 3) {
 alert("Please draw a zone with at least 3 points on the map.");
 return;
 }
 if (isInvalid) {
 alert("The drawn zone is invalid (self-intersecting).");
 return;
 }
 if (activeTool === 'draw') {
 alert("Please close the polygon or switch to selection mode before saving.");
 return;
 }

 setZones(prev => prev.map(z =>
 z.id === editingZone.id
 ? { ...z, name: zoneName, points: [...points] }
 : z
 ));

 setIsEditModalOpen(false);
 setEditingZone(null);
 setZoneName('');
 setPoints([]);
 setActiveTool('draw'); // Reset tool after submission
 };

 const handleViewLog = (zone: Zone) => {
 setSelectedZoneName(zone.name);
 setActiveView('activityLog');
 };

 const filteredZones = zones.filter(zone => {
 const matchesTab = activeTab === 'All' || zone.status === activeTab;
 const matchesSearch = zone.name.toLowerCase().includes(searchQuery.toLowerCase());
 return matchesTab && matchesSearch;
 });

 const renderActivityLog = () => {
 const filteredLogs = mockLogs.filter(log =>
 log.editedBy.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
 log.editedObject.toLowerCase().includes(logSearchQuery.toLowerCase())
 );

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="flex items-center gap-4">
 <button
 onClick={() => setActiveView('setup')}
 className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-primary shadow-sm"
 >
 <ChevronLeft className="w-6 h-6" />
 </button>
 <div className="flex items-baseline gap-2">
 <h2 className="text-2xl font-bold text-slate-800">Zone Activity Log</h2>
 <span className="text-2xl font-bold text-primary">{filteredLogs.length}</span>
 </div>
 </div>

 <div className="bg-white rounded-[32px] shadow-soft border border-slate-50 overflow-hidden">
 <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-4">
 <div className="flex-1 max-w-md relative group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search Here by Edited"
 value={logSearchQuery}
 onChange={(e) => setLogSearchQuery(e.target.value)}
 className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
 />
 <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">
 Search
 </button>
 </div>

 <div className="relative group">
 <button className="flex items-center gap-2 px-6 py-2.5 border-2 border-primary/20 text-primary rounded-xl text-sm font-bold hover:bg-primary/5 transition-all">
 <Download className="w-4 h-4" /> Download <ChevronDown className="w-4 h-4" />
 </button>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-8 py-5 text-xs font-bold text-slate-400 ">Edited Date</th>
 <th className="px-8 py-5 text-xs font-bold text-slate-400 ">Edited Time</th>
 <th className="px-8 py-5 text-xs font-bold text-slate-400 ">Edited By</th>
 <th className="px-8 py-5 text-xs font-bold text-slate-400 ">Edited Object</th>
 <th className="px-8 py-5 text-xs font-bold text-slate-400 ">Before Edit Status</th>
 <th className="px-8 py-5 text-xs font-bold text-slate-400 ">After Edit Status</th>
 </tr>
 </thead>
 <tbody>
 {filteredLogs.length === 0 ? (
 <tr>
 <td colSpan={6} className="py-24">
 <div className="flex flex-col items-center justify-center text-center">
 <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6 relative">
 <Files className="w-16 h-16 text-slate-200" />
 <div className="absolute bottom-4 right-4 bg-white rounded-full p-1 shadow-sm">
 <AlertCircle className="w-6 h-6 text-slate-400" />
 </div>
 </div>
 <h4 className="text-lg font-bold text-slate-400">No data available</h4>
 </div>
 </td>
 </tr>
 ) : (
 filteredLogs.map((log) => (
 <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
 <td className="px-8 py-5 text-sm font-medium text-slate-600">{log.date}</td>
 <td className="px-8 py-5 text-sm text-slate-500">{log.time}</td>
 <td className="px-8 py-5 text-sm text-slate-600">{log.editedBy}</td>
 <td className="px-8 py-5 text-sm font-bold text-slate-800">{log.editedObject}</td>
 <td className="px-8 py-5">
 <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
 {log.beforeStatus}
 </span>
 </td>
 <td className="px-8 py-5">
 <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
 {log.afterStatus}
 </span>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
 };

 if (activeView === 'trash') {
 return (
 <div className="space-y-8 pb-12">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <button
 onClick={() => setActiveView('setup')}
 className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
 >
 <ChevronRight className="w-6 h-6 rotate-180" />
 </button>
 <div>
 <h2 className="text-xl font-bold text-slate-800">Deleted Zone List</h2>
 <p className="text-sm text-slate-500">Restore or permanently remove zones</p>
 </div>
 </div>
 </div>

 <div className="bg-white p-4 rounded-[20px] shadow-soft border border-slate-100 flex items-center justify-between gap-4">
 <div className="relative flex-1 max-w-md">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input
 type="text"
 placeholder="Search here by zone name"
 className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
 />
 </div>
 </div>

 <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">SL</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Geo Preview</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Zone Name</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 ">Trip Request Volume</th>
 <th className="px-6 py-4 text-[10px] font-bold text-slate-400 text-right">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {deletedZones.map((zone, idx) => (
 <tr key={zone.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-6 py-4 text-xs font-medium text-slate-400">{idx + 1}</td>
 <td className="px-6 py-4">
 <MapPreview type="polygon" data={zone.points} status={zone.status} label={zone.name} />
 </td>
 <td className="px-6 py-4 text-xs font-bold text-slate-800">{zone.name}</td>
 <td className="px-6 py-4">
 <span className={cn(
 "text-[10px] font-bold px-2 py-1 rounded-lg ",
 zone.volume === 'High' ? "bg-emerald-50 text-emerald-600" :
 zone.volume === 'Medium' ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"
 )}>
 {zone.volume}
 </span>
 </td>
 <td className="px-6 py-4 text-right">
 <button
 onClick={() => handleRestore(zone.id)}
 className="p-2 hover:bg-primary/10 rounded-lg transition-all text-slate-400 hover:text-primary"
 title="Restore"
 >
 <RefreshCw className="w-4 h-4" />
 </button>
 </td>
 </tr>
 ))}
 {deletedZones.length === 0 && (
 <tr>
 <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
 No zones in trash
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
 }

 if (activeView === 'activityLog') {
 return renderActivityLog();
 }

 return (
 <div className="space-y-8 pb-12">
 {/* Page Header */}
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-xl font-bold text-slate-800">Zone Setup</h2>
 <p className="text-sm text-slate-500">Manage operational boundaries and pricing zones</p>
 </div>
 </div>

 {/* Zone Creation Card */}
 <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 overflow-hidden">
 <div className="grid grid-cols-1 lg:grid-cols-12">
 {/* Left Side: Instructions */}
 <div className="lg:col-span-4 p-8 bg-slate-50/50 border-r border-slate-100">
 <div className="flex items-center gap-2 mb-6">
 <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
 <Info className="w-4 h-4 text-primary" />
 </div>
 <h3 className="font-bold text-slate-800">Instructions</h3>
 </div>

 <ul className="space-y-6">
 {[
 "Create zone by click on map and connect the dots together",
 "Drag map to find proper area",
 "Click to start pin points and connect them to draw a zone (Minimum 3 points required)"
 ].map((instruction, idx) => (
 <li key={idx} className="flex gap-3">
 <div className="mt-1 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-slate-400">
 {idx + 1}
 </div>
 <p className="text-sm text-slate-600 leading-relaxed">{instruction}</p>
 </li>
 ))}
 </ul>

 <div className="mt-12 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
 <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative">
 {points.length > 0 ? (
  <MapPreview type="polygon" data={points} status={isInvalid ? 'Inactive' : 'Active'} label={zoneName || 'New Zone'} />
 ) : (
 <div className="w-full h-full flex flex-col items-center justify-center grayscale opacity-50 bg-[url('https://picsum.photos/seed/map-preview/400/225')] bg-cover bg-center">
 <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
 <MapIcon className="w-6 h-6 text-primary" />
 </div>
 </div>
 )}
 </div>
 <p className="text-[10px] text-center text-slate-400 mt-3 font-medium ">Preview Helper</p>
 </div>
 </div>

 {/* Right Side: Form + Map */}
 <div className="lg:col-span-8 p-8 flex flex-col">
 <div className="mb-6">
 <label className="block text-xs font-bold text-slate-400 mb-2">
 Zone Name <span className="text-red-500">*</span>
 </label>
 <input
 type="text"
 value={zoneName}
 onChange={(e) => {
 setZoneName(e.target.value);
 if (e.target.value.trim()) setNameError(false);
 }}
 placeholder="Ex: Dhanmondi"
 className={cn(
 "w-full px-4 py-3 bg-slate-50 rounded-xl text-sm transition-all outline-none border-2",
 nameError
 ? "border-red-500 bg-red-50/50 focus:bg-white animate-shake"
 : "border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20"
 )}
 />
 {nameError && (
 <p className="mt-1.5 text-[11px] font-bold text-red-500 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
 <AlertCircle className="w-3.5 h-3.5" />
 Zone name is required to save
 </p>
 )}
 </div>

 {/* Interactive Map Placeholder */}
 <div
 ref={mapContainerRef}
 className={cn(
 "flex-1 min-h-[400px] bg-slate-200 rounded-[20px] relative overflow-hidden group border border-slate-100 shadow-inner transition-all",
 activeTool === 'draw' ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing",
 isFullscreen && "rounded-none border-none"
 )}
 >
 <MapContainer
 center={[23.8103, 90.4125]}
 zoom={13}
 style={{ height: '100%', width: '100%' }}
 zoomControl={false}
 doubleClickZoom={false}
 >
 <TileLayer
 url={mapType === 'satellite'
 ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
 : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
 }
 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
 />

 <MapEvents
 onMapClick={handleMapClick}
 onMapMouseMove={handleMouseMove}
 onMapDoubleClick={handleMapDoubleClick}
 />

 {/* Existing Zones */}
 {zones.map(zone => (
 <Polygon
 key={zone.id}
 positions={zone.points}
 pathOptions={{
 fillColor: zone.status === 'Active' ? '#00C4B4' : '#64748b',
 fillOpacity: 0.2,
 color: zone.status === 'Active' ? '#00C4B4' : '#64748b',
 weight: 2
 }}
 />
 ))}

 {/* Active Drawing */}
 {points.length > 0 && (
 <Polygon
 positions={points}
 pathOptions={{
 fillColor: isInvalid ? "#EF4444" : "#00C4B4",
 fillOpacity: 0.3,
 color: isInvalid ? "#EF4444" : "#00C4B4",
 weight: 3,
 dashArray: activeTool === 'draw' ? '5, 5' : '0'
 }}
 />
 )}

 {/* Mouse interaction lines */}
 {mousePos && points.length > 0 && activeTool === 'draw' && (
 <Polygon
 positions={[points[points.length - 1], mousePos, points[0]]}
 pathOptions={{
 color: isInvalid ? "#EF4444" : "#00C4B4",
 weight: 1,
 dashArray: '4',
 fillOpacity: 0
 }}
 />
 )}

 {points.map((p, i) => (
 <Marker
 key={`${i}-${p[0]}-${p[1]}`}
 position={p}
 draggable={activeTool === 'hand'}
 icon={L.divIcon({
 className: 'custom-marker',
 html: `<div class="w-3 h-3 bg-white border-2 border-primary rounded-full shadow-lg transition-transform hover:scale-125 cursor-move"></div>`,
 iconSize: [12, 12],
 iconAnchor: [6, 6]
 })}
 eventHandlers={{
 dragstart: () => setDraggedPointIndex(i),
 drag: (e) => {
 const latlng = e.target.getLatLng();
 const newPoints = [...points];
 newPoints[i] = [latlng.lat, latlng.lng];
 setPoints(newPoints);
 setIsInvalid(checkSelfIntersection(newPoints));
 },
 dragend: () => setDraggedPointIndex(null),
 click: () => handlePointDelete(i)
 }}
 />
 ))}
 </MapContainer>

 {/* Map Layout Controls */}
 <div className="absolute top-4 left-4 flex flex-col gap-2 z-[1001]">
 <button
 onClick={() => setActiveTool('draw')}
 className={cn(
 "p-2 rounded-xl shadow-lg border transition-all",
 activeTool === 'draw' ? "bg-primary text-white border-primary" : "bg-white text-slate-400 border-slate-100 hover:bg-primary/5"
 )}
 title="Draw Tool"
 >
 <MousePointer2 className="w-4 h-4" />
 </button>
 <button
 onClick={() => setActiveTool('hand')}
 className={cn(
 "p-2 rounded-xl shadow-lg border transition-all",
 activeTool === 'hand' ? "bg-primary text-white border-primary" : "bg-white text-slate-400 border-slate-100 hover:bg-primary/5"
 )}
 title="Hand Tool"
 >
 <Hand className="w-4 h-4" />
 </button>
 <div className="h-px w-full bg-slate-100" />
 <button
 onClick={() => setMapType(prev => prev === 'standard' ? 'satellite' : 'standard')}
 className="bg-white p-2 text-slate-400 rounded-xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-all"
 title="Change Map Type"
 >
 <Layers className="w-4 h-4" />
 </button>
 <button
 onClick={toggleFullscreen}
 className={cn(
 "bg-white p-2 rounded-xl shadow-lg border border-slate-100 transition-all",
 isFullscreen ? "text-primary bg-primary/5" : "text-slate-400 hover:bg-slate-50"
 )}
 title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
 >
 <Maximize2 className="w-4 h-4" />
 </button>
 <button
 onClick={(e) => { e.stopPropagation(); setPoints([]); setIsInvalid(false); setActiveTool('draw'); }}
 className="bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-red-500 hover:bg-red-50 transition-all group"
 title="Clear Drawing"
 >
 <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
 </button>
 </div>

 <div className="absolute top-4 right-4 flex gap-2 z-[1001]">
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input
 type="text"
 placeholder="Search location..."
 onClick={(e) => e.stopPropagation()}
 className="pl-10 pr-4 py-2 bg-white rounded-xl shadow-lg border border-slate-100 text-sm focus:ring-2 focus:ring-primary/20 outline-none w-64"
 />
 </div>
 <button
 onClick={(e) => e.stopPropagation()}
 className="bg-white px-3 py-2 rounded-xl shadow-lg border border-slate-100 text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50"
 >
 <Layers className="w-4 h-4" /> Satellite
 </button>
 </div>

 {/* Drawing Tool Indicator */}
 <div className={cn(
 "absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-xl border flex items-center gap-3 transition-all duration-300 z-[1001]",
 isInvalid ? "bg-red-50 border-red-200" : "bg-white border-slate-100"
 )}>
 <div className={cn(
 "flex items-center gap-2 px-2 py-1 rounded-lg",
 isInvalid ? "bg-red-100" : "bg-primary/10"
 )}>
 {isInvalid ? (
 <AlertCircle className="w-3.5 h-3.5 text-red-500" />
 ) : (
 activeTool === 'draw' ? <MousePointer2 className="w-3.5 h-3.5 text-primary" /> : <Hand className="w-3.5 h-3.5 text-primary" />
 )}
 <span className={cn(
 "text-[11px] font-bold",
 isInvalid ? "text-red-500" : "text-primary"
 )}>
 {isInvalid ? "Invalid Zone" : (activeTool === 'draw' ? "Drawing Mode" : "Selection Mode")}
 </span>
 </div>
 <div className="w-px h-4 bg-slate-100" />
 <span className={cn(
 "text-[11px] font-medium",
 isInvalid ? "text-red-400" : "text-slate-500"
 )}>
 {isInvalid ? "Polygon self-intersects" : (points.length === 0 ? "Click on map to start drawing" : activeTool === 'hand' ? "Drag points to move, Click to delete" : `${points.length} points added`)}
 </span>
 </div>

 {/* Action Bar */}
 <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
 <div className="flex items-center gap-4 text-slate-400">
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-primary" />
 <span className="text-[10px] font-bold ">Geofence Active</span>
 </div>
 </div>
 <button
 onClick={handleSubmit}
 className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center gap-2"
 >
 Submit Zone <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Zone List Section */}
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <h3 className="text-lg font-bold text-slate-800">Zone List</h3>
 <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md ">
 Total Zones: {zones.length}
 </span>
 </div>

 <Tabs activeKey={activeTab} onChange={(k) => setActiveTab(k as any)} items={['All', 'Active', 'Inactive'].map(tab => ({ key: tab, label: tab }))} className="mb-6 font-bold" />
 </div>

 {/* Search & Action Bar */}
 <div className="bg-white p-4 rounded-[20px] shadow-soft border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
 <div className="flex items-center gap-4 w-full md:w-auto">
 <div className="relative flex-1 md:w-80">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
 <input
 type="text"
 placeholder="Search here by zone name"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
 />
 </div>
 <button className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all">
 Search
 </button>
 </div>

 <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
 <div
 onClick={() => setIsExtraFareModalOpen(true)}
 className="flex items-center gap-2 cursor-pointer group"
 >
 <div className={cn(
 "w-9 h-5 rounded-full transition-all relative",
 globalExtraFare.enabled ? "bg-primary" : "bg-slate-200"
 )}>
 <div className={cn(
 "absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full transition-transform",
 globalExtraFare.enabled ? "translate-x-4" : ""
 )} />
 </div>
 <span className="text-xs font-bold text-slate-600">Apply For All Zone Extra Fare</span>
 <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
 </div>

 <div className="flex items-center gap-2">
 <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-all">
 <RefreshCw className="w-4 h-4" />
 </button>
 <button
 onClick={() => setActiveView('trash')}
 className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-all"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-all">
 <Download className="w-4 h-4" />
 </button>
 <div className="w-px h-6 bg-slate-100 mx-1" />
 <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
 Download <ChevronRight className="w-3 h-3 rotate-90" />
 </button>
 </div>
 </div>
 </div>

 {/* Data Table */}
 <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50/50">
 <th className="px-6 py-5 text-[10px] font-black text-slate-400 ">SL</th>
 <th className="px-6 py-5 text-[10px] font-black text-slate-400 ">Geo Preview</th>
 <th className="px-6 py-5 text-[10px] font-black text-slate-400 ">Zone Details</th>
 <th className="px-6 py-5 text-[10px] font-black text-slate-400 ">Demand Intelligence</th>
 <th className="px-6 py-5 text-[10px] font-black text-slate-400 ">Surcharge Logic</th>
 <th className="px-6 py-5 text-[10px] font-black text-slate-400 ">Operational Status</th>
 <th className="px-6 py-5 text-[10px] font-black text-slate-400 text-right">Action Desk</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {filteredZones.map((zone, idx) => (
 <tr key={zone.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-6 py-4 text-xs font-medium text-slate-400">{idx + 1}</td>
 <td className="px-6 py-4">
 <MapPreview type="polygon" data={zone.points} status={zone.status} label={zone.name} variant="mini" />
 </td>
 <td className="px-6 py-4">
 <div className="flex flex-col gap-0.5">
 <span className="text-sm font-black text-slate-900 italic tracking-tight">{zone.name}</span>
 <div className="flex items-center gap-1.5">
 <MapPin className="w-3 h-3 text-primary" />
 <span className="text-[10px] font-bold text-slate-400">ID: {zone.id}</span>
 </div>
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <div className={cn(
 "w-1 h-8 rounded-full shadow-inner",
 zone.volume === 'High' ? "bg-emerald-500 shadow-emerald-500/50" :
 zone.volume === 'Medium' ? "bg-amber-500 shadow-amber-500/50" : "bg-slate-300"
 )} />
 <div className="flex flex-col">
 <span className="text-[10px] font-black text-slate-800 tracking-tight leading-none mb-1">{zone.volume} Volume</span>
 <span className="text-[10px] font-bold text-slate-400 leading-none">Market Demand</span>
 </div>
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex flex-col gap-2">
 <div
 className="relative inline-flex items-center"
 onMouseEnter={() => setHoveredZoneId(zone.id)}
 onMouseLeave={() => setHoveredZoneId(null)}
 >
 <label className="relative inline-flex items-center cursor-pointer group">
 <input
 type="checkbox"
 checked={zone.extraFareEnabled}
 onChange={() => handleToggleExtraFare(zone.id)}
 className="sr-only peer"
 />
 <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-inner group-hover:scale-105 transition-transform"></div>
 <span className={cn(
 "ml-3 text-[10px] font-black transition-colors",
 zone.extraFareEnabled ? "text-primary" : "text-slate-400"
 )}>
 {zone.extraFareEnabled ? `${zone.extraFarePercent}% SURCHARGE` : "NO SURCHARGE"}
 </span>
 </label>

 {/* Tooltip Popover */}
 {hoveredZoneId === zone.id && zone.extraFareEnabled && (
 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/50 p-4 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
 <div className="space-y-2">
 <div className="flex justify-between items-center">
 <span className="text-[9px] font-black text-slate-400 ">Global Payout</span>
 <span className="text-xs font-black text-primary">+{zone.extraFarePercent}%</span>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-[9px] font-black text-slate-400 ">Reason</span>
 <span className="text-[9px] font-bold text-white truncate max-w-[80px]">Heavy Traffic</span>
 </div>
 <button
 onClick={() => setIsExtraFareModalOpen(true)}
 className="w-full mt-2 py-2 bg-white/10 hover:bg-primary text-white text-[9px] font-black rounded-lg transition-all flex items-center justify-center gap-1.5"
 >
 <Edit3 className="w-3 h-3" /> Refine Fare
 </button>
 </div>
 {/* Arrow */}
 <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
 </div>
 )}
 </div>
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <label className="relative inline-flex items-center cursor-pointer group">
 <input
 type="checkbox"
 checked={zone.status === 'Active'}
 onChange={() => handleToggleStatus(zone.id)}
 className="sr-only peer"
 />
 <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 shadow-inner group-hover:scale-105 transition-transform"></div>
 </label>
 <span className={cn(
 "text-[10px] font-black ",
 zone.status === 'Active' ? "text-emerald-500" : "text-slate-400"
 )}>
 {zone.status}
 </span>
 </div>
 </td>
 <td className="px-6 py-4 text-right">
 <div className="flex items-center justify-end gap-2">
 <button
 onClick={() => handleViewLog(zone)}
 className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-slate-600"
 title="View Activity Log"
 >
 <History className="w-4 h-4" />
 </button>
 <button
 onClick={() => handleEdit(zone)}
 className="p-2 hover:bg-primary/10 rounded-lg transition-all text-slate-400 hover:text-primary"
 >
 <Edit3 className="w-4 h-4" />
 </button>
 <button
 onClick={() => handleDeleteClick(zone.id)}
 className="p-2 hover:bg-red-50 rounded-lg transition-all text-slate-400 hover:text-red-500"
 >
 <Trash2 className="w-4 h-4" />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 {/* Extra Fare Setup Modal */}
 {
 isExtraFareModalOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
 <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
 {/* Modal Header */}
 <div className="p-8 border-b border-slate-50 flex items-center justify-between">
 <div>
 <h3 className="text-xl font-bold text-slate-800">Extra Fare Setup - All Zone</h3>
 <p className="text-sm text-slate-500 mt-1">
 Enabling this option will apply the extra fare to all rides and parcels across all Zones when conditions change or heavy traffic.
 </p>
 </div>
 <button
 onClick={() => setIsExtraFareModalOpen(false)}
 className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
 >
 <X className="w-6 h-6" />
 </button>
 </div>

 <div className="p-8 space-y-8">
 {/* Global Toggle */}
 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
 <span className="text-sm font-bold text-slate-700">Enable Extra Fare Globally</span>
 <label className="relative inline-flex items-center cursor-pointer">
 <input
 type="checkbox"
 checked={globalExtraFare.enabled}
 onChange={(e) => {
 if (!e.target.checked) {
 setIsConfirmTurnOffModalOpen(true);
 } else {
 setGlobalExtraFare(prev => ({ ...prev, enabled: true }));
 }
 }}
 className="sr-only peer"
 />
 <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
 </label>
 </div>

 {/* Form Fields */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <div className="flex items-center gap-2">
 <label className="text-xs font-bold text-slate-400 ">Extra Fare (%)</label>
 <Info className="w-3 h-3 text-slate-300" />
 </div>
 <input
 type="number"
 value={globalExtraFare.percent}
 onChange={(e) => setGlobalExtraFare(prev => ({ ...prev, percent: parseInt(e.target.value) || 0 }))}
 className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
 placeholder="30"
 />
 </div>
 <div className="space-y-2">
 <label className="text-xs font-bold text-slate-400 ">Reasons For Extra Fare</label>
 <input
 type="text"
 value={globalExtraFare.reason}
 onChange={(e) => setGlobalExtraFare(prev => ({ ...prev, reason: e.target.value }))}
 className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
 placeholder="Heavy Traffic"
 />
 </div>
 </div>

 {/* Instruction Section */}
 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
 <div className="flex items-center gap-2 text-primary">
 <Info className="w-4 h-4" />
 <span className="text-xs font-bold ">Admin Guidance</span>
 </div>
 <ul className="space-y-3">
 <li className="flex gap-3 text-xs text-slate-500 leading-relaxed">
 <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
 When Allow Extra Fare Setup - All Zone, the Extra Fare (%) will be applicable to all the active zones.
 </li>
 <li className="flex gap-3 text-xs text-slate-500 leading-relaxed">
 <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
 If want to set up separately for each zone:
 </li>
 <li className="ml-4 flex gap-3 text-xs text-slate-400 leading-relaxed italic">
 a. Popup for Extra Fare & Reason
 </li>
 <li className="ml-4 flex gap-3 text-xs text-slate-400 leading-relaxed italic">
 b. Configure zone-level surcharge
 </li>
 <li className="ml-4 flex gap-3 text-xs text-slate-400 leading-relaxed italic">
 c. Update from Zone Settings page
 </li>
 </ul>
 </div>
 </div>

 {/* Modal Footer */}
 <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
 <button
 onClick={() => setIsExtraFareModalOpen(false)}
 className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
 >
 Cancel
 </button>
 <button
 onClick={() => setIsExtraFareModalOpen(false)}
 className="px-8 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
 >
 Save
 </button>
 </div>
 </div>
 </div>
 )
 }

 {/* Confirmation Modal: Turn Off Extra Fare */}
 {
 isConfirmTurnOffModalOpen && (
 <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
 <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden p-8 text-center animate-in fade-in zoom-in duration-200">
 <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
 <div className="relative">
 <Car className="w-10 h-10 text-amber-500" />
 <DollarSign className="w-6 h-6 text-amber-600 absolute -top-2 -right-2 bg-white rounded-full shadow-sm" />
 </div>
 </div>

 <h3 className="text-xl font-bold text-slate-800 mb-2">
 Are you sure to turn off Extra Fare for All Zones?
 </h3>
 <p className="text-sm text-slate-500 mb-8">
 This action will revert all pricing to standard rates across all active service areas.
 </p>

 <div className="flex items-center gap-4">
 <button
 onClick={() => setIsConfirmTurnOffModalOpen(false)}
 className="flex-1 py-3 border-2 border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-all"
 >
 Cancel
 </button>
 <button
 onClick={() => {
 setGlobalExtraFare(prev => ({ ...prev, enabled: false }));
 setIsConfirmTurnOffModalOpen(false);
 }}
 className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
 >
 Turn Off
 </button>
 </div>
 </div>
 </div>
 )
 }
 {/* Edit Zone Modal */}
 {
 isEditModalOpen && editingZone && (
 <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
 <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
 {/* Modal Header */}
 <div className="p-8 border-b border-slate-50 flex items-center justify-between">
 <div>
 <h3 className="text-xl font-bold text-slate-800">Edit Zone: {editingZone.name}</h3>
 <p className="text-sm text-slate-500 mt-1">Modify zone name or redraw operational boundaries</p>
 </div>
 <button
 onClick={() => setIsEditModalOpen(false)}
 className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
 >
 <X className="w-6 h-6" />
 </button>
 </div>

 <div className="flex-1 overflow-y-auto p-8 space-y-6">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Left Side: Form */}
 <div className="space-y-6">
 <div>
 <label className="block text-xs font-bold text-slate-400 mb-2">
 Zone Name <span className="text-red-500">*</span>
 </label>
 <input
 type="text"
 value={zoneName}
 onChange={(e) => {
 setZoneName(e.target.value);
 if (e.target.value.trim()) setNameError(false);
 }}
 className={cn(
 "w-full px-4 py-3 bg-slate-50 rounded-xl text-sm transition-all outline-none border-2",
 nameError
 ? "border-red-500 bg-red-50/50 animate-shake"
 : "border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20"
 )}
 />
 {nameError && (
 <p className="mt-1.5 text-[11px] font-bold text-red-500 flex items-center gap-1.5 animate-in fade-in duration-200">
 <AlertCircle className="w-3.5 h-3.5" /> Zone name is required
 </p>
 )}
 </div>

 <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
 <div className="flex items-center gap-2 text-primary mb-2">
 <MapIcon className="w-4 h-4" />
 <span className="text-xs font-bold ">Map Instructions</span>
 </div>
 <p className="text-xs text-slate-600 leading-relaxed">
 Click on the map to redraw the zone. Connect the points to complete the polygon. Minimum 3 points required.
 </p>
 </div>
 </div>

 {/* Right Side: Mini Map */}
 <div
 ref={modalMapContainerRef}
 className={cn(
 "aspect-square bg-slate-200 rounded-[24px] relative overflow-hidden group border border-slate-100 shadow-inner transition-all min-h-[300px]",
 activeTool === 'draw' ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing",
 isModalFullscreen && "rounded-none border-none"
 )}
 >
 <MapContainer
 center={points[0] || [23.8103, 90.4125]}
 zoom={15}
 style={{ height: '100%', width: '100%' }}
 zoomControl={false}
 doubleClickZoom={false}
 >
 <TileLayer
 url={mapType === 'satellite'
 ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
 : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
 }
 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
 />

 <MapEvents
 onMapClick={handleMapClick}
 onMapMouseMove={handleMouseMove}
 onMapDoubleClick={handleMapDoubleClick}
 />

 {/* Active Drawing */}
 {points.length > 0 && (
 <Polygon
 positions={points}
 pathOptions={{
 fillColor: isInvalid ? "#EF4444" : "#00C4B4",
 fillOpacity: 0.3,
 color: isInvalid ? "#EF4444" : "#00C4B4",
 weight: 3,
 dashArray: activeTool === 'draw' ? '5, 5' : '0'
 }}
 />
 )}

 {/* Mouse interaction lines */}
 {mousePos && points.length > 0 && activeTool === 'draw' && (
 <Polygon
 positions={[points[points.length - 1], mousePos, points[0]]}
 pathOptions={{
 color: isInvalid ? "#EF4444" : "#00C4B4",
 weight: 1,
 dashArray: '4',
 fillOpacity: 0
 }}
 />
 )}

 {points.map((p, i) => (
 <Marker
 key={`${i}-${p[0]}-${p[1]}`}
 position={p}
 draggable={activeTool === 'hand'}
 icon={L.divIcon({
 className: 'custom-marker',
 html: `<div class="w-3 h-3 bg-white border-2 border-primary rounded-full shadow-lg transition-transform hover:scale-125 cursor-move"></div>`,
 iconSize: [12, 12],
 iconAnchor: [6, 6]
 })}
 eventHandlers={{
 dragstart: () => setDraggedPointIndex(i),
 drag: (e) => {
 const latlng = e.target.getLatLng();
 const newPoints = [...points];
 newPoints[i] = [latlng.lat, latlng.lng];
 setPoints(newPoints);
 setIsInvalid(checkSelfIntersection(newPoints));
 },
 dragend: () => setDraggedPointIndex(null),
 click: () => handlePointDelete(i)
 }}
 />
 ))}
 </MapContainer>

 {/* Map UI Controls */}
 <div className="absolute top-4 left-4 flex flex-col gap-2 z-[1001]">
 <button
 onClick={() => setActiveTool('draw')}
 className={cn(
 "p-2 rounded-xl shadow-lg border transition-all",
 activeTool === 'draw' ? "bg-primary text-white border-primary" : "bg-white text-slate-400 border-slate-100 hover:bg-primary/5"
 )}
 title="Draw Tool"
 >
 <MousePointer2 className="w-4 h-4" />
 </button>
 <button
 onClick={() => setActiveTool('hand')}
 className={cn(
 "p-2 rounded-xl shadow-lg border transition-all",
 activeTool === 'hand' ? "bg-primary text-white border-primary" : "bg-white text-slate-400 border-slate-100 hover:bg-primary/5"
 )}
 title="Hand Tool"
 >
 <Hand className="w-4 h-4" />
 </button>
 <div className="h-px w-full bg-slate-100/50" />
 <button
 onClick={toggleModalFullscreen}
 className={cn(
 "bg-white p-2 rounded-xl shadow-lg border border-slate-100 transition-all",
 isModalFullscreen ? "text-primary bg-primary/5" : "text-slate-400 hover:bg-slate-50"
 )}
 title={isModalFullscreen ? "Exit Fullscreen" : "Fullscreen"}
 >
 <Maximize2 className="w-4 h-4" />
 </button>
 <button
 onClick={(e) => { e.stopPropagation(); setPoints([]); setIsInvalid(false); setActiveTool('draw'); }}
 className="bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-red-500 hover:bg-red-50 transition-all group"
 title="Clear Drawing"
 >
 <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
 </button>
 </div>

 <div className={cn(
 "absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-xl border flex items-center gap-3 transition-all duration-300 z-[1001]",
 isInvalid ? "bg-red-50 border-red-200" : "bg-white border-slate-100"
 )}>
 <div className={cn(
 "flex items-center gap-2 px-2 py-1 rounded-lg",
 isInvalid ? "bg-red-100" : "bg-primary/10"
 )}>
 {isInvalid ? (
 <AlertCircle className="w-3.5 h-3.5 text-red-500" />
 ) : (
 activeTool === 'draw' ? <MousePointer2 className="w-3.5 h-3.5 text-primary" /> : <Hand className="w-3.5 h-3.5 text-primary" />
 )}
 <span className={cn(
 "text-[11px] font-bold",
 isInvalid ? "text-red-500" : "text-primary"
 )}>
 {isInvalid ? "Invalid Zone" : (activeTool === 'draw' ? "Drawing Mode" : "Selection Mode")}
 </span>
 </div>
 <div className="w-px h-4 bg-slate-100" />
 <span className={cn(
 "text-[11px] font-medium",
 isInvalid ? "text-red-400" : "text-slate-500"
 )}>
 {isInvalid ? "Polygon self-intersects" : (points.length === 0 ? "Click to start" : `${points.length} points`)}
 </span>
 </div>

 </div>
 </div>
 </div>

 {/* Modal Footer */}
 <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
 <button
 onClick={() => setIsEditModalOpen(false)}
 className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700"
 >
 Cancel
 </button>
 <button
 onClick={handleUpdateZone}
 className="px-8 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
 >
 Save Changes
 </button>
 </div>
 </div>
 </div>
 )
 }
 {/* Delete Confirmation Modal */}
 {
 isDeleteModalOpen && (
 <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
 <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden p-8 text-center animate-in fade-in zoom-in duration-200">
 <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
 <Trash2 className="w-10 h-10 text-red-500" />
 </div>

 <h3 className="text-xl font-bold text-slate-800 mb-2">
 Confirm Deletion
 </h3>
 <p className="text-sm text-slate-500 mb-8">
 Are you sure you want to delete this zone? This action will move it to the trash.
 </p>

 <div className="flex items-center gap-4">
 <button
 onClick={() => { setIsDeleteModalOpen(false); setZoneToDeleteId(null); }}
 className="flex-1 py-3 border-2 border-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all"
 >
 Cancel
 </button>
 <button
 onClick={confirmDelete}
 className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200"
 >
 Delete
 </button>
 </div>
 </div>
 </div>
 )
 }
 </div>
 );
};

export default ZoneSetup;
