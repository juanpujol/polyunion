import polyunion from './index';
import * as turf from '@turf/turf';
import { describe, expect, it } from 'vitest';

describe('polyunion function', () => {
	it('handles an empty feature collection', () => {
		const featureCollection: turf.FeatureCollection<turf.Polygon> = {
			type: 'FeatureCollection',
			features: []
		};

		const result = polyunion(featureCollection);
		expect(result.features.length).toBe(0);
	});

	it('handles a single feature', () => {
		const featureCollection: turf.FeatureCollection<turf.Polygon> = {
			type: 'FeatureCollection',
			features: [
				turf.polygon([
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
		const featureCollection: turf.FeatureCollection<turf.Polygon> = {
			type: 'FeatureCollection',
			features: [
				turf.polygon([
					[
						[0, 0],
						[0, 1],
						[1, 1],
						[1, 0],
						[0, 0]
					]
				]),
				turf.polygon([
					[
						[2, 0],
						[2, 1],
						[3, 1],
						[3, 0],
						[2, 0]
					]
				]),
				turf.polygon([
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
		const featureCollection: turf.FeatureCollection<turf.Polygon> = {
			type: 'FeatureCollection',
			features: [
				turf.polygon([
					[
						[0, 0],
						[0, 1],
						[1, 1],
						[1, 0],
						[0, 0]
					]
				]),
				turf.polygon([
					[
						[0.5, 0.5],
						[0.5, 1.5],
						[1.5, 1.5],
						[1.5, 0.5],
						[0.5, 0.5]
					]
				]),
				turf.polygon([
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
