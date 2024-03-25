import turfCircle from '@turf/circle';

export function buildPolyCircle(radioMiles: number, steps: number) {
	const val = (n: string | number) => (typeof n === 'number' ? n : +n);

	return <T extends { lat: string | number; lng: string | number }>(list: T[]) => {
		const radiusInKm = radioMiles * 1.609344;

		return list.map(({ lat: lat, lng: lon }) =>
			turfCircle([val(lon), val(lat)], radiusInKm, {
				steps,
				properties: {
					center: [val(lon), val(lat)],
				}
			})
		);
	};
}