const MarkerData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "status": "done",
        "project_id": "PRJ-001"
      },
      "geometry": {
        "coordinates": [
          106.11139505183348,
          -6.378116838126104
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "done",
        "project_id": "PRJ-002"
      },
      "geometry": {
        "coordinates": [
          106.82718385990165,
          -6.1887837140957345
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "ongoing",
        "project_id": "PRJ-003"
      },
      "geometry": {
        "coordinates": [
          106.64519651746832,
          -6.29234484935651
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "ongoing",
        "project_id": "PRJ-004"
      },
      "geometry": {
        "coordinates": [
          106.56289697607053,
          -6.587661971539944
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "ongoing",
        "project_id": "PRJ-005"
      },
      "geometry": {
        "coordinates": [
          106.57661356630422,
          -6.7647684129613594
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "ongoing",
        "project_id": "PRJ-006"
      },
      "geometry": {
        "coordinates": [
          106.81893999375762,
          -6.4150358734821396
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "ongoing",
        "project_id": "PRJ-007"
      },
      "geometry": {
        "coordinates": [
          106.81893999375762,
          -6.514984527780271
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "ongoing",
        "project_id": "PRJ-008"
      },
      "geometry": {
        "coordinates": [
          106.44401986071523,
          -6.365054174902582
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "cancelled",
        "project_id": "PRJ-009"
      },
      "geometry": {
        "coordinates": [
          107.00640006027879,
          -6.242351278422134
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "done",
        "project_id": "PRJ-010"
      },
      "geometry": {
        "coordinates": [
          107.04297763423449,
          -6.392317524983156
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "done",
        "project_id": "PRJ-011"
      },
      "geometry": {
        "coordinates": [
          106.77321802631366,
          -6.655787409520443
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "done",
        "project_id": "PRJ-012"
      },
      "geometry": {
        "coordinates": [
          106.45773645094897,
          -6.142349858326114
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "cancelled",
        "project_id": "PRJ-013"
      },
      "geometry": {
        "coordinates": [
          106.97439468306862,
          -6.492270661810409
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "cancelled",
        "project_id": "PRJ-014"
      },
      "geometry": {
        "coordinates": [
          107.63017869451915,
          -6.875872016153423
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "ongoing",
        "project_id": "PRJ-015"
      },
      "geometry": {
        "coordinates": [
          107.52314324258259,
          -6.898010174096797
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "ongoing",
        "project_id": "PRJ-016"
      },
      "geometry": {
        "coordinates": [
          107.62640966442393,
          -7.023867833434309
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "done",
        "project_id": "PRJ-017"
      },
      "geometry": {
        "coordinates": [
          107.49282687632626,
          -6.976168432796172
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "done",
        "project_id": "PRJ-018"
      },
      "geometry": {
        "coordinates": [
          107.58282633997578,
          -6.431352948911808
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "done",
        "project_id": "PRJ-019"
      },
      "geometry": {
        "coordinates": [
          107.73566847531936,
          -6.408667296689302
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {
        "status": "ongoing",
        "project_id": "PRJ-020"
      },
      "geometry": {
        "coordinates": [
          107.80092134181797,
          -6.4329836304894314
        ],
        "type": "Point"
      }
    }
  ]
}

export default MarkerData;

export const pointValues = MarkerData.features.map(feature => {
  const projectId = feature.properties.project_id;
  const coordinates = feature.geometry.coordinates

  return {
    value: projectId,
    type: "polygon",
    coordinates: coordinates
  };
});