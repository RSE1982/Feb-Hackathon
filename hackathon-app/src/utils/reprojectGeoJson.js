import proj4 from 'proj4';

// Define BNG (EPSG:27700). WGS84 is built-in as 'WGS84'
proj4.defs(
    'EPSG:27700',
    '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
    '+x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,' +
    '0.15,0.247,0.842,-20.489 +units=m +no_defs'
);

function mapCoords(coords, fn) {
    if (typeof coords[0] === 'number') return fn(coords); // [x,y]
    return coords.map((c) => mapCoords(c, fn));
}

// Quick heuristic: BNG eastings/northings are large metre values.
function looksLikeBNG(featureCollection) {
    const f = featureCollection?.features?.[0];
    const c = f?.geometry?.coordinates;
    if (!c) return false;

    // drill down to the first coordinate pair
    let cur = c;
    while (Array.isArray(cur) && Array.isArray(cur[0])) cur = cur[0];
    if (!Array.isArray(cur) || cur.length < 2) return false;

    const [x, y] = cur;
    return Math.abs(x) > 1000 && Math.abs(y) > 1000; // metres-ish, not lon/lat
}

export function reprojectFeatureCollectionToWGS84(fc, src = 'EPSG:27700') {
    if (!looksLikeBNG(fc)) return fc; // already lon/lat

    const out = structuredClone(fc); // modern browsers; fine in Vite
    out.features = out.features.map((f) => {
        const geom = f.geometry;
        if (!geom) return f;

        const convert = ([x, y]) => {
            const [lon, lat] = proj4(src, 'WGS84', [x, y]);
            return [lon, lat];
        };

        return {
            ...f,
            geometry: {
                ...geom,
                coordinates: mapCoords(geom.coordinates, convert),
            },
        };
    });

    return out;
}