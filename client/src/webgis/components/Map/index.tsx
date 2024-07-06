import {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  Map,
  MapProvider,
  NavigationControl,
} from 'react-map-gl';

const MapComponent = () => {
  return (
    <>
      <MapProvider>
        <Map
          id="mainMap"
          mapboxAccessToken="pk.eyJ1IjoiZHdpcHV0cmFzYW0iLCJhIjoiY2xlMDRxZDU2MTU3dTNxb2Fkc3Q0NWFpciJ9.M-nfqnbgrf7QQdXHAXn07Q"
          style={{
            width: '100vw',
            height: '92vh',
          }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          attributionControl={false}
        >
          <AttributionControl customAttribution="Made with love by Sam" style={{ color: 'black' }} />
          <NavigationControl position="bottom-right" />
          <FullscreenControl />
          <GeolocateControl />
        </Map>
      </MapProvider>
    </>
  );
};

export default MapComponent;
