import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L, { LeafletEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import axios from 'axios';
import { Box, Typography, Alert, Button } from '@mui/material';
import { FeatureCollection, Geometry } from 'geojson';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Props {
  token: string;
}

interface Site {
  id: number;
  geometry: string;
  project_id: number;
}

interface CustomFeature extends GeoJSON.Feature<Geometry, { id: number }> {}

interface DrawCreatedEvent extends LeafletEvent {
  layerType: string;
  layer: L.Layer & { getLatLngs: () => L.LatLng[][] };
}

const MapView: React.FC<Props> = ({ token }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [error, setError] = useState('');
  const [pendingPolygon, setPendingPolygon] = useState<string | null>(null);
  const center: L.LatLngExpression = [0, 0];

  useEffect(() => {
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }
    axios
      .get('http://localhost:8000/sites', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        console.log('Fetched sites:', res.data);
        setSites(res.data);
      })
      .catch((e) => {
        console.error('Failed to fetch sites:', e.response?.data || e.message);
        setError('Failed to load sites. Check console.');
      });
  }, [token]);

  const wktToGeoJSON = (wkt: string, siteId: number): CustomFeature | null => {
    try {
      // Example WKT: POLYGON((0 0, 1 1, 1 0, 0 0))
      const coordsStr = wkt.match(/\(\((.*?)\)\)/)?.[1];
      if (!coordsStr) {
        console.error('Invalid WKT format:', wkt);
        return null;
      }
      const coords = coordsStr
        .split(',')
        .map((pair) => {
          const [lng, lat] = pair.trim().split(' ').map(Number);
          if (isNaN(lng) || isNaN(lat)) {
            throw new Error(`Invalid coordinate pair: ${pair}`);
          }
          return [lng, lat] as [number, number];
        });
      console.log('Parsed GeoJSON coords:', coords);
      return {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [coords] },
        properties: { id: siteId },
      };
    } catch (e) {
      console.error('Error parsing WKT:', wkt, e);
      return null;
    }
  };

  const geoJsonData: FeatureCollection = {
    type: 'FeatureCollection',
    features: sites
      .map((site) => wktToGeoJSON(site.geometry, site.id))
      .filter((f): f is CustomFeature => f !== null),
  };

  const onEachFeature = (feature: CustomFeature, layer: L.Layer) => {
    layer.on('click', () => {
      window.location.href = `/site/${feature.properties.id}`;
    });
  };

  const handleDrawCreated = (e: DrawCreatedEvent) => {
    setError('');
    if (e.layerType === 'polygon') {
      try {
        const coords = (e.layer.getLatLngs()[0] as L.LatLng[])
          .map((c) => `${c.lng} ${c.lat}`)
          .join(', ');
        if (!coords) {
          setError('No coordinates found for polygon.');
          return;
        }
        const geometry = `POLYGON((${coords}, ${coords.split(', ')[0]}))`;
        setPendingPolygon(geometry);
        console.log('Polygon drawn:', geometry);
      } catch (e) {
        console.error('Error processing polygon:', e);
        setError('Error processing polygon. Check console.');
      }
    }
  };

  const handleSavePolygon = () => {
    if (!pendingPolygon) {
      setError('No polygon drawn to save.');
      return;
    }
    if (!token) {
      setError('No authentication token. Please log in.');
      return;
    }
    setError('');
    console.log('Saving polygon:', { project_id: 1, geometry: pendingPolygon, metrics: JSON.stringify({ carbon: 100, biodiversity: 80 }) });
    axios
      .post(
        'http://localhost:8000/sites',
        {
          project_id: 1,
          geometry: pendingPolygon,
          metrics: JSON.stringify({ carbon: 100, biodiversity: 80 }),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log('Polygon saved:', res.data);
        setPendingPolygon(null);
        setSites([...sites, res.data]); // Update sites to trigger re-render
      })
      .catch((e) => {
        console.error('Failed to save site:', e.response?.data || e.message);
        setError(`Failed to save polygon: ${e.response?.data?.detail || e.message}`);
      });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Map View - Draw Polygons for Sites
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {pendingPolygon && (
        <Button variant="contained" color="primary" onClick={handleSavePolygon} sx={{ mb: 2 }}>
          Save Polygon
        </Button>
      )}
      <MapContainer center={center} zoom={2} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          key={JSON.stringify(geoJsonData)} // Force re-render on data change
          data={geoJsonData}
          onEachFeature={onEachFeature}
          style={{ fillColor: '#088', fillOpacity: 0.8, color: '#088' }}
        />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleDrawCreated}
            draw={{
              polygon: { showArea: true },
              rectangle: false,
              polyline: false,
              circle: false,
              marker: false,
              circlemarker: false,
            }}
            edit={{ edit: false, remove: true }}
          />
        </FeatureGroup>
      </MapContainer>
    </Box>
  );
};

export default MapView;