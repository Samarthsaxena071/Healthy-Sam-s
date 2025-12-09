
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, Loader2, AlertCircle, ExternalLink, RefreshCw, Map as MapIcon } from 'lucide-react';
import { searchNearbyPlaces } from '../services/geminiService';

const MapSearch: React.FC = () => {
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [manualLocation, setManualLocation] = useState('');
  const [useManual, setUseManual] = useState(false);
  
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string>('');

  const apiKey = process.env.API_KEY;

  useEffect(() => {
    attemptGeolocation();
  }, []);

  const attemptGeolocation = () => {
    setLoadingLocation(true);
    setError(null);

    if (!navigator.geolocation) {
      handleGeoError("Geolocation not supported.");
      return;
    }

    const geoOptions = {
      timeout: 10000,
      maximumAge: 0,
      enableHighAccuracy: true 
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoadingLocation(false);
        setUseManual(false);
      },
      (err) => {
        let msg = "Location access denied.";
        if (err.code === err.TIMEOUT) msg = "Location request timed out.";
        if (err.code === err.POSITION_UNAVAILABLE) msg = "Position unavailable (GPS signal lost).";
        
        console.warn(`Geolocation error (${err.code}): ${err.message}`);
        handleGeoError(msg);
      },
      geoOptions
    );
  };

  const handleGeoError = (msg: string) => {
    setLoadingLocation(false);
    setUseManual(true);
    setError(`${msg} Please enter your city or zip code.`);
  };

  const handleSearch = async (category: string) => {
    if (useManual && !manualLocation.trim()) {
      setError("Please enter a city or zip code.");
      return;
    }
    if (!useManual && !locationCoords) {
      setError("Location not found. Try entering it manually.");
      return;
    }

    setSearching(true);
    setQuery(category);
    setResults([]);
    setError(null);
    setResponseText('');

    try {
      const locationArg = useManual ? manualLocation : locationCoords!;
      const response = await searchNearbyPlaces(category, locationArg);
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapResults = chunks
        .map((chunk: any) => chunk.maps)
        .filter((map: any) => map);

      setResults(mapResults);
      
      const text = response.text;
      if (typeof text === 'string') {
        setResponseText(text);
      }
      
      if (mapResults.length === 0 && !text) {
         setError("No specific locations found. Try a different search term.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch nearby places. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  // Construct Google Maps Embed URL
  const getEmbedUrl = () => {
    if (!query) return null;
    
    const baseUrl = "https://www.google.com/maps/embed/v1/search";
    const qParam = encodeURIComponent(query + (useManual ? ` near ${manualLocation}` : ''));
    
    let url = `${baseUrl}?key=${apiKey}&q=${qParam}&zoom=13`;
    
    if (!useManual && locationCoords) {
      // If using GPS, strictly center the map
      url += `&center=${locationCoords.lat},${locationCoords.lng}`;
    }
    
    return url;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Find Nearby</h2>
          
          <button 
            onClick={() => setUseManual(!useManual)}
            className="text-xs text-blue-600 font-medium hover:underline"
          >
            {useManual ? "Try GPS Instead" : "Enter Location Manually"}
          </button>
        </div>

        {/* Location Input Section */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
           {loadingLocation ? (
             <div className="flex items-center gap-2 text-gray-500">
               <Loader2 className="animate-spin" size={18} />
               <span className="text-sm">Detecting location...</span>
             </div>
           ) : useManual ? (
             <div className="flex flex-col gap-2">
               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Search Location</label>
               <div className="flex gap-2">
                 <div className="relative flex-1">
                   <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input 
                      type="text" 
                      value={manualLocation}
                      onChange={(e) => setManualLocation(e.target.value)}
                      placeholder="Enter City, Zip, or Address"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                   />
                 </div>
               </div>
             </div>
           ) : (
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                  <MapPin size={16} />
                  <span className="text-sm font-medium">Using Current Location</span>
                </div>
                <button onClick={attemptGeolocation} className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Refresh GPS">
                  <RefreshCw size={18} />
                </button>
             </div>
           )}
        </div>
      </div>
      
      {error && (
         <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-sm text-yellow-800 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{error}</p>
         </div>
      )}

      {/* Quick Search Chips */}
      <div className="flex flex-wrap gap-2">
        {['Emergency Room', 'Urgent Care', 'Pharmacy', 'Hospital'].map((category) => (
          <button
            key={category}
            onClick={() => handleSearch(category)}
            disabled={searching || (useManual && !manualLocation)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              query === category
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {searching && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Loader2 className="animate-spin mb-3 text-blue-500" size={32} />
          <p>Searching Area...</p>
        </div>
      )}

      {/* Map Embed - Visual Result */}
      {!searching && query && (
        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-gray-100 h-64 w-full relative">
          <iframe
            title="Google Maps Search"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={getEmbedUrl() || ""}
          />
          <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 text-xs text-gray-500 rounded shadow-sm pointer-events-none">
            Google Maps
          </div>
        </div>
      )}

      {/* List Results Section */}
      {!searching && (results.length > 0 || responseText) && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 ml-1">
              Top results for <span className="font-semibold text-gray-900">"{query}"</span>
            </p>
          </div>
          
          {/* Map Cards */}
          {results.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {results.map((place, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{String(place.title || 'Unknown Place')}</h3>
                    <div className="text-sm text-gray-500 mb-3 flex items-start gap-1">
                       <MapPin size={14} className="mt-0.5 shrink-0" />
                       <span className="line-clamp-2">{place.address || "View details on map"}</span>
                    </div>
                  </div>

                  <a
                    href={place.googleMapsUri || place.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full bg-blue-50 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 border border-blue-100"
                  >
                    <Navigation size={18} />
                    Get Directions
                  </a>
                </div>
              ))}
            </div>
          )}
          
           {/* AI Summary */}
           {responseText && (
            <div className="bg-blue-50 p-4 rounded-xl text-sm text-gray-800 leading-relaxed border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-600 p-1 rounded-full">
                  <Search size={12} className="text-white" />
                </div>
                <span className="font-bold text-blue-900">AI Overview</span>
              </div>
              {responseText}
            </div>
          )}
        </div>
      )}
      
      {!searching && !query && (
         <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100 border-dashed">
          <MapIcon size={40} className="mx-auto mb-3 text-blue-100" />
          <p>Enter a location or use GPS, then select a category.</p>
        </div>
      )}
    </div>
  );
};

export default MapSearch;
