import React, {
  memo, useEffect, useRef, useState
} from "react";
import Map, {
  MapProvider,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  Marker,
  AttributionControl,
  Source,
  Layer,
  Popup
} from "react-map-gl";
import polygon from "../../constants/Shapefiles/polygon";
import MarkerData from "../../constants/Shapefiles/marker";

const MapScreen = (props) => {
  const {
    baseMap, isPolygonShown, isMarkerShown, zoomCoord
  } = props;

  const [ popupInfo, setPopupInfo ] = useState(null);
  const [ polygonData, setPolygonData ] = useState(null);
  console.log(polygonData)

  const mapRef = useRef(null)

  useEffect(() => {
    if (zoomCoord.length === 0) return
    mapRef.current?.flyTo({ center: zoomCoord, zoom: 10 })
  }, [ zoomCoord ])

  return (
    <MapProvider>
      <Map
        initialViewState={{
          longitude: 107.550965,
          latitude: -6.899872,
          zoom: 5,
        }}
        mapboxAccessToken={baseMap.apiKey}
        style={{
          width: "100vw",
          height: "100vh",
        }}
        mapStyle={baseMap.url}
        attributionControl={false}
        ref={mapRef}
        onClick={(e) => {
          if (polygonData) {
            return setPolygonData(null)
          }
          const coordinates = e.lngLat;
          return setPolygonData({ features: e.features, coordinates: coordinates })
        }
        }
        interactiveLayerIds={[ "polygon-layer" ]}
      >
        <AttributionControl customAttribution="Made with love by Sam" style={{ color: "black" }}/>
        <NavigationControl position="bottom-right" />
        <FullscreenControl />
        <GeolocateControl />
        { isPolygonShown && (
          <Source id="polygon-layer" type="geojson" data={polygon} >
            <Layer
              id="polygon-layer"
              type="fill"
              source="my-data"
              paint={{
                "fill-color": [ "case", [ "<", [ "get", "users" ], 250 ], "#FD9D0D",
                  [ "all", [ ">=", [ "get", "users" ], 250 ], [ "<", [ "get", "users" ], 500 ] ], "#0F9504",
                  [ "<=", [ "get", "users" ], 500 ], "#3CA1FF",
                  "#3CA1FF"
                ],
                "fill-opacity": 0.85,
                'fill-outline-color': 'rgba(0, 0, 0, 1)'
              }}
            />
          </Source>
        )}
        { isMarkerShown && MarkerData.features.map((el) => {
          return (
            <Marker latitude={el?.geometry.coordinates[1]} longitude={el?.geometry.coordinates[0]} offsetLeft={-20} offsetTop={-10} color={el?.properties.status === "done" ? "green" : el?.properties.status === "ongoing" ? 'yellow' : "red"} 
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setPopupInfo(el)
              }}
            />
          )
        })}
        {popupInfo && (
          <Popup
            anchor="bottom"
            longitude={Number(popupInfo.geometry.coordinates[0])}
            latitude={Number(popupInfo.geometry.coordinates[1])}
            onClose={() => setPopupInfo(null)}
          >
            <div style={{ margin: 10 }}>
              project id: {popupInfo?.properties.project_id} 
              <br />
              status: {popupInfo?.properties.status} 
            </div>
          </Popup>
        )}
        {polygonData && polygonData?.features?.length !== 0 && (
          <Popup
            anchor="bottom"
            longitude={polygonData?.coordinates?.lng}
            latitude={polygonData?.coordinates?.lat}
            onClose={() => setPolygonData(null)}
          >
            <div style={{ margin: 10 }}>
              ID: {polygonData?.features[0]?.properties?.ID} 
              <br />
              Propinsi: {polygonData?.features[0]?.properties?.Propinsi} 
              <br />
              Users: {polygonData?.features[0]?.properties?.users} 
            </div>
          </Popup>
        )}
      </Map>
    </MapProvider>
  );
};

export default memo(MapScreen);
