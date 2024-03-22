# PolyUnion

A fast and efficient Javascript utility function designed to mergE multiple polygons into a GeoJSON FeatureCollection. It utilizes spatial indexing provided by **[rbush](https://github.com/mourner/rbush)** and the geospatial processing of **[Turfjs](https://github.com/Turfjs/turf)** to achieve high performance.

## How fast?

When attempting to merge approximately 1000 circle-shaped polygons using only @turf/union, it took approximately 25 seconds. In contrast, PolyUnion completed the same task in about 350 milliseconds.

![example-01](./images/example-01.webp)

## Installation

You can install PolyUnion via npm:

```shell
npm install polyunion
```

## Usage

```js
import { polyunion } from 'polyunion';

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
const mergedFeatureCollection = polyunion(features, 2);

console.log(mergedFeatureCollection);
```

The function has 2 parameters:

- `fc` (required): A GeoJSON FeatureCollection containing polygons to merge (make sure the polygons are valid).
- `totalPasses` (optional, defaults to 3): The total number of passes for recursive calls. Increasing the number of iterations can improve the results, but it will also prolong the execution time. It depends on the number of polygons being merged. For the case in the picture above, 4 passes worked great (350ms).

## Credits

I'm not smart enough to have created this from scratch. This took some back and forth with [ChatGPT](https://chat.openai.com) and I'm not ashamed to admit it. 😄
