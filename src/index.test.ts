import polyunion from './index';
import { describe, expect, it } from 'vitest';
import { polygon } from '@turf/helpers';

import type { FeatureCollection, Polygon } from '@turf/helpers';

describe('polyunion function', () => {
	it('handles an empty feature collection', () => {
		const featureCollection: FeatureCollection<Polygon> = {
			type: 'FeatureCollection',
			features: []
		};

		const result = polyunion(featureCollection);
		expect(result.features.length).toBe(0);
	});

	it('handles a single feature', () => {
		const featureCollection: FeatureCollection<Polygon> = {
			type: 'FeatureCollection',
			features: [
				polygon([
					[
						[0, 0],
						[0, 1],
						[1, 1],
						[1, 0],
						[0, 0]
					]
				])
			]
		};

		const result = polyunion(featureCollection);
		expect(result.features.length).toBe(1);
		expect(result.features[0].geometry.type).toBe('Polygon');
		expect(result.features[0].geometry.coordinates).toEqual([
			[
				[0, 0],
				[0, 1],
				[1, 1],
				[1, 0],
				[0, 0]
			]
		]);
	});

	it('handles multiple non-overlapping features', () => {
		const featureCollection: FeatureCollection<Polygon> = {
			type: 'FeatureCollection',
			features: [
				polygon([
					[
						[0, 0],
						[0, 1],
						[1, 1],
						[1, 0],
						[0, 0]
					]
				]),
				polygon([
					[
						[2, 0],
						[2, 1],
						[3, 1],
						[3, 0],
						[2, 0]
					]
				]),
				polygon([
					[
						[4, 0],
						[4, 1],
						[5, 1],
						[5, 0],
						[4, 0]
					]
				])
			]
		};

		const result = polyunion(featureCollection);
		expect(result.features.length).toBe(3);
	});

	it('handles multiple overlapping features', () => {
		const featureCollection: FeatureCollection<Polygon> = {
			type: 'FeatureCollection',
			features: [
				polygon([
					[
						[0, 0],
						[0, 1],
						[1, 1],
						[1, 0],
						[0, 0]
					]
				]),
				polygon([
					[
						[0.5, 0.5],
						[0.5, 1.5],
						[1.5, 1.5],
						[1.5, 0.5],
						[0.5, 0.5]
					]
				]),
				polygon([
					[
						[1, 0],
						[1, 1],
						[2, 1],
						[2, 0],
						[1, 0]
					]
				])
			]
		};

		const result = polyunion(featureCollection);
		expect(result.features.length).toBe(1);
		expect(result.features[0].geometry.type).toBe('Polygon');
		expect(result.features[0].geometry.coordinates).toEqual([
			[
				[0, 0],
				[2, 0],
				[2, 1],
				[1.5, 1],
				[1.5, 1.5],
				[0.5, 1.5],
				[0.5, 1],
				[0, 1],
				[0, 0]
			]
		]);
	});
});
