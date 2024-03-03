import RBush from 'rbush';
import bbox from '@turf/bbox';
import intersect from '@turf/intersect';
import booleanOverlap from '@turf/boolean-overlap';
import union from '@turf/union';
import { featureCollection } from '@turf/helpers';

import type { Feature, FeatureCollection, Polygon } from '@turf/helpers';

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
function createSpatialIndex(features: Feature<Polygon>[]): RBush<RBushItem> {
	const tree = new RBush<RBushItem>();
	const items: RBushItem[] = features.map((feature, id) => {
		const fbbox = bbox(feature);

		// Structure required by rbush: {minX, minY, maxX, maxY, id}
		return { minX: fbbox[0], minY: fbbox[1], maxX: fbbox[2], maxY: fbbox[3], id };
	});

	tree.load(items);

	return tree;
}

/**
 * Merges overlapping polygons within a feature collection.
 *
 * @param {FeatureCollection<Polygon>} fc - The input feature collection containing polygons to be merged.
 * @param {number} [currentPass=1] - The current pass number. Defaults to 1.
 * @param {number} [totalPasses=3] - The total number of passes to perform. Defaults to 3.
 * @returns {FeatureCollection<Polygon>} - The merged feature collection.
 */
function polyunion(
	fc: FeatureCollection<Polygon>,
	currentPass: number = 1,
	totalPasses: number = 3
): FeatureCollection<Polygon> {
	// If there's only one feature, return it directly
	if (fc.features.length === 1) {
		return fc;
	}

	// TODO: add option to simplify polygons before merging.
	// fc = turf.simplify(fc, { tolerance: 0.00015, highQuality: false, mutate: true });

	const tree = createSpatialIndex(fc.features);
	let mergedFeatures: Feature<Polygon>[] = [];
	let processed = new Set<number>();

	fc.features.forEach((feature, index) => {
		if (processed.has(index)) return; // Skip if already processed

		const fbbox = bbox(feature);
		const candidates = tree.search({ minX: fbbox[0], minY: fbbox[1], maxX: fbbox[2], maxY: fbbox[3] });

		let mergeCandidate = feature;

		candidates.forEach((candidate) => {
			if (processed.has(candidate.id)) return; // Skip if already processed

			const targetFeature = fc.features[candidate.id];

			if (
				intersect(mergeCandidate, targetFeature) ||
				booleanOverlap(mergeCandidate, targetFeature)
			) {
				mergeCandidate = union(mergeCandidate, targetFeature) as Feature<Polygon>;
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
		const nextPassCollection = featureCollection(mergedFeatures);
		return polyunion(nextPassCollection, currentPass + 1, totalPasses); // Next pass
	}

	return featureCollection(mergedFeatures);
}

export default polyunion;
