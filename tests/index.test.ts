import { polyunion } from '../src/index';
import { describe, expect, it } from 'vitest';
import { buildPolyCircle } from './helpers';
import { featureCollection, polygon } from '@turf/helpers';
import { data } from './fixtures/data.json';

import type { FeatureCollection, Polygon } from '@turf/helpers';

describe('polyunion: function', () => {
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

describe('polyunion: test cases', () => {
	it.each([
		0.1, 0.2, 0.3, 0.5, 0.8, 0.9, 1, 1.4, 1.5, 2, 2.2, 2.5, 3, 4,
		5, 6, 7, 8
	])('it should merge polygons with radius: %d and 24 steps', (radius) => {
		const list = buildPolyCircle(radius, 24)(data);
		const collection = featureCollection(list);
		const result = polyunion(collection, 4);

		expect(result.features).not.toHaveLength(list.length);
	});
});