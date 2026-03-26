import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, CheckCircle2, XCircle } from 'lucide-react';
import { Zone } from '../hooks/useZones';

interface PointInZoneTesterProps {
  zones: Zone[];
}

export function PointInZoneTester({ zones }: PointInZoneTesterProps) {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [result, setResult] = useState<Zone[] | null>(null);

  const handleTest = () => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    
    if (isNaN(latNum) || isNaN(lngNum)) {
      setResult([]);
      return;
    }

    // Simple bounding box test for mock purposes
    // In a real app, use google.maps.geometry.poly.containsLocation
    const matchingZones = zones.filter(zone => {
      const lats = zone.geometry.map(p => p.lat);
      const lngs = zone.geometry.map(p => p.lng);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      
      return latNum >= minLat && latNum <= maxLat && lngNum >= minLng && lngNum <= maxLng;
    });

    setResult(matchingZones);
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" /> Point-in-Zone Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-4">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Latitude" 
            className="h-8 text-xs" 
            value={lat} 
            onChange={e => setLat(e.target.value)} 
          />
          <Input 
            placeholder="Longitude" 
            className="h-8 text-xs" 
            value={lng} 
            onChange={e => setLng(e.target.value)} 
          />
          <Button size="sm" className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleTest}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {result !== null && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Test Results</h4>
            {result.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Point is inside {result.length} zone(s)
                </div>
                <ul className="space-y-1 mt-2">
                  {result.map(z => (
                    <li key={z.id} className="text-xs flex items-center justify-between bg-white p-2 rounded border border-slate-100">
                      <span className="font-medium text-slate-900">{z.name}</span>
                      <Badge variant="outline" className="text-[10px] uppercase">{z.zoneType}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-red-700 font-medium">
                <XCircle className="w-4 h-4" /> Point is outside all active zones
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
