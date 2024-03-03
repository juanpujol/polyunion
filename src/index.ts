import RBush from 'rbush';
import * as turf from '@turf/turf';

interface RBushItem {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
	id: number;
}

/**
 * Creates a spatial index using the RBush library.
 *
 * @param {Array<Object>} features - An array of features.
 * @returns {RBush} The spatial index tree.
 */
function createSpatialIndex(features: turf.Feature<turf.Polygon>[]): RBush<RBushItem> {
	const tree = new RBush<RBushItem>();
	const items: RBushItem[] = features.map((feature, id) => {
		const bbox = turf.bbox(feature);

		// Structure required by rbush: {minX, minY, maxX, maxY, id}
		return { minX: bbox[0], minY: bbox[1], maxX: bbox[2], maxY: bbox[3], id };
	});

	tree.load(items);

	return tree;
}

/**
 * Merges overlapping polygons within a feature collection.
 *
 * @param {FeatureCollection<Polygon>} featureCollection - The input feature collection containing polygons to be merged.
 * @param {number} [currentPass=1] - The current pass number. Defaults to 1.
 * @param {number} [totalPasses=3] - The total number of passes to perform. Defaults to 3.
 * @returns {FeatureCollection<Polygon>} - The merged feature collection.
 */
function polyunion(
	featureCollection: turf.FeatureCollection<turf.Polygon>,
	currentPass: number = 1,
	totalPasses: number = 3
): turf.FeatureCollection<turf.Polygon> {
	// If there's only one feature, return it directly
	if (featureCollection.features.length === 1) {
		return featureCollection;
	}

	// TODO: add option to simplify polygons before merging.
	// featureCollection = turf.simplify(featureCollection, { tolerance: 0.00015, highQuality: false, mutate: true });

	const tree = createSpatialIndex(featureCollection.features);
	let mergedFeatures: turf.Feature<turf.Polygon>[] = [];
	let processed = new Set<number>();

	featureCollection.features.forEach((feature, index) => {
		if (processed.has(index)) return; // Skip if already processed

		const bbox = turf.bbox(feature);
		const candidates = tree.search({ minX: bbox[0], minY: bbox[1], maxX: bbox[2], maxY: bbox[3] });

		let mergeCandidate = feature;

		candidates.forEach((candidate) => {
			if (processed.has(candidate.id)) return; // Skip if already processed

			const targetFeature = featureCollection.features[candidate.id];

			if (
				turf.intersect(mergeCandidate, targetFeature) ||
				turf.booleanOverlap(mergeCandidate, targetFeature)
			) {
				mergeCandidate = turf.union(mergeCandidate, targetFeature) as turf.Feature<turf.Polygon>;
				processed.add(candidate.id);
			}
		});

		mergedFeatures.push(mergeCandidate);
		processed.add(index);
	});

	// Filter out features that have been merged
	mergedFeatures = mergedFeatures.filter((_, index) => processed.has(index));

	// If the current pass is less than the total passes, call the function again for the next pass
	if (currentPass < totalPasses) {
		const nextPassCollection = turf.featureCollection(mergedFeatures);
		return polyunion(nextPassCollection, currentPass + 1, totalPasses); // Next pass
	}

	return turf.featureCollection(mergedFeatures);
}

export default polyunion;
