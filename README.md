# PolyUnion

A fast and efficient function designed for merging multiple polygons within a GeoJSON FeatureCollection. It utilizes spatial indexing provided by rbush and the geospatial processing of Turf to achieve high performance.

## Installation

You can install PolyUnion via npm:

```shell
npm install polyunion
```

## Usage

```js
import polyunion from 'polyunion';

// Example GeoJSON FeatureCollection input
const features = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[1, 1], [1, 2], [2, 2], [2, 1], [1, 1]]]
      }
    }
  ]
};

// Merge polygons
const mergedFeatureCollection = polyunion(features);

console.log(mergedFeatureCollection);
```

The function has 3 parameters:

- `featureCollection` (required): A GeoJSON FeatureCollection containing polygons to merge.
- `currentPass` (optional): The current pass number. This is used internally for recursive calls and should not be set manually.
- `totalPasses` (optional): The total number of passes. This is used internally for recursive calls and should not be set manually.

## Performance

I wanted to merge about 1000 circle shaped polygons and when I tried to do it just with @turf/union it took about 25 seconds. With PolyUnion it took about 350ms.
