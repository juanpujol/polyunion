import turfCircle from '@turf/circle';
import { featureCollection } from '@turf/helpers';
import { describe, expect, it } from 'vitest';

import { polyunion } from './index';
import { data } from './fixtures/data1.json';

describe('polyunion for circles ', () => {
	it.each([
		0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 2, 2.2, 2.3, 2.5, 3, 4,
		5, 6, 7, 8, 9, 10
	])('with radius: %d and 20 steps', (radius) => {
		const list = latlogToCircles(radius, 16)(data);
		const collection = featureCollection(list);

		const result = polyunion(collection);

		expect(result.features).not.toHaveLength(list.length);
	});

	it.todo('with radius: 0.6 and 20 steps');
	it.todo('with radius: 1 and 20 steps');
	it.todo('with radius: 1.4 and 20 steps');
});

function latlogToCircles(radioMiles: number, steps: number) {
	const val = (n: string | number) => (typeof n === 'number' ? n : +n);

	return <T extends { Latitude: string | number; Longitude: string | number }>(list: T[]) => {
		const radiusInKm = radioMiles * 1.609344;

		return list.map(({ Latitude: lat, Longitude: lon }) =>
			turfCircle([val(lon), val(lat)], radiusInKm, {
				steps,
				properties: {
					shape: 'Circle',
					isCircle: true,
					center: [val(lon), val(lat)],
					radiusInKm: radiusInKm,
					dragTypesDisabled: ['fill']
				}
			})
		);
	};
}
