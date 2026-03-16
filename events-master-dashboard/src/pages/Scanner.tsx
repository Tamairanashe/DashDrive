import { Search, QrCode, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function Scanner() {
  const [scanResult, setScanResult] = useState<'idle' | 'success' | 'error' | 'used'>('idle');
  const [scannedTicket, setScannedTicket] = useState<any>(null);

  const simulateScan = (type: 'success' | 'error' | 'used') => {
    setScanResult(type);
    if (type === 'success') {
      setScannedTicket({
        id: 'TKT-89234',
        name: 'John Smith',
        type: 'VIP Ticket',
        event: 'Summer Music Festival',
        seat: 'Section A, Row 1, Seat 12'
      });
    } else if (type === 'used') {
      setScannedTicket({
        id: 'TKT-11223',
        name: 'Sarah Lee',
        type: 'Standard Ticket',
        event: 'Summer Music Festival',
        scannedAt: '14:23 PM Today'
      });
    } else {
      setScannedTicket(null);
    }
    
    // Reset after 3 seconds
    setTimeout(() => {
      setScanResult('idle');
      setScannedTicket(null);
    }, 5000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Ticket Scanner</h1>
        <div className="text-sm font-medium text-gray-500">
          Event: <span className="text-indigo-600">Summer Music Festival</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scanner Viewport */}
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <QrCode className="mr-2 h-5 w-5 text-gray-500" />
              Scan QR Code
            </h2>
          </div>
          <div className="flex-1 bg-gray-900 relative min-h-[400px] flex items-center justify-center">
            {/* Simulated camera view */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center mix-blend-overlay"></div>
            
            {/* Scanner frame */}
            <div className="relative w-64 h-64 border-2 border-white/50 rounded-lg overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_10px_2px_rgba(74,222,128,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
              
              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
            </div>

            {/* Simulation buttons (for demo) */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              <button onClick={() => simulateScan('success')} className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">Simulate Valid</button>
              <button onClick={() => simulateScan('used')} className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600">Simulate Used</button>
              <button onClick={() => simulateScan('error')} className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">Simulate Invalid</button>
            </div>
          </div>
        </div>

        {/* Scan Result */}
        <div className="bg-white shadow rounded-lg flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Scan Result</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
            {scanResult === 'idle' && (
              <div className="text-gray-500">
                <QrCode className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <p>Waiting for scan...</p>
                <p className="text-sm mt-2">Point camera at ticket QR code</p>
              </div>
            )}

            {scanResult === 'success' && scannedTicket && (
              <div className="w-full animate-in fade-in zoom-in duration-300">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Valid Ticket</h3>
                <p className="text-green-600 font-medium mb-6">Entry Granted</p>
                
                <div className="bg-gray-50 rounded-lg p-4 text-left space-y-3 border border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Attendee</p>
                    <p className="font-medium text-gray-900 text-lg">{scannedTicket.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Ticket Type</p>
                      <p className="font-medium text-gray-900">{scannedTicket.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Ticket ID</p>
                      <p className="font-medium text-gray-900">{scannedTicket.id}</p>
                    </div>
                  </div>
                  {scannedTicket.seat && (
                    <div className="pt-2 border-t border-gray-200 mt-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Seat Assignment</p>
                      <p className="font-bold text-indigo-600 text-lg">{scannedTicket.seat}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {scanResult === 'used' && scannedTicket && (
              <div className="w-full animate-in fade-in zoom-in duration-300">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 mb-4">
                  <XCircle className="h-12 w-12 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Already Scanned</h3>
                <p className="text-yellow-600 font-medium mb-6">Do Not Admit</p>
                
                <div className="bg-yellow-50 rounded-lg p-4 text-left space-y-3 border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    This ticket was already scanned at <strong>{scannedTicket.scannedAt}</strong>.
                  </p>
                  <div className="pt-2 border-t border-yellow-200 mt-2">
                    <p className="text-xs text-yellow-600 uppercase tracking-wider">Attendee</p>
                    <p className="font-medium text-yellow-900">{scannedTicket.name}</p>
                  </div>
                </div>
              </div>
            )}

            {scanResult === 'error' && (
              <div className="w-full animate-in fade-in zoom-in duration-300">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-4">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Invalid Ticket</h3>
                <p className="text-red-600 font-medium mb-6">Do Not Admit</p>
                
                <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
                  <p className="text-sm text-red-800">
                    This QR code is not recognized or belongs to a different event.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Entry */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Entry</h3>
        <div className="flex space-x-4">
          <div className="flex-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
              placeholder="Enter Ticket ID or Attendee Name"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Lookup
          </button>
        </div>
      </div>
    </div>
  );
}
