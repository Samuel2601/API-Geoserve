/*
https://docs.nestjs.com/providers#services
*/

import {Injectable} from '@nestjs/common';
import * as proj4 from 'proj4';

@Injectable()
export class CoordinateService {
	constructor() {
		// Define la proyección UTM utilizada (EPSG:32617 en este caso)
		proj4.defs('EPSG:32617', '+proj=utm +zone=17 +datum=WGS84 +units=m +no_defs');
	}

	convertCoordinates(data: any[], key: string = 'geom'): any[] {
		return data.map((item) => {
			if (item[key]) {
				const {type, coordinates, crs} = item[key];

				// Usa la proyección específica si está definida
				const sourceCrs = crs?.properties?.name || 'EPSG:32617';

				if (type === 'MultiPolygon') {
					item[key].coordinates = coordinates.map((polygon) => polygon.map((ring) => ring.map(([x, y]) => proj4(sourceCrs, proj4.WGS84, [x, y]))));
				} else if (type === 'Polygon') {
					item[key].coordinates = coordinates.map((ring) => ring.map(([x, y]) => proj4(sourceCrs, proj4.WGS84, [x, y])));
				} else if (type === 'Point') {
					item[key].coordinates = proj4(sourceCrs, proj4.WGS84, coordinates);
				}
			}
			return item;
		});
	}
}
