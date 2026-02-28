/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { reprojectFeatureCollectionToWGS84 } from '../utils/reprojectGeoJson';

export function useGeoJson(level) {
    const [geojson, setGeojson] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (level !== 'country' && level !== 'region') return;

        setLoading(true); // start loading state immediately when level changes
        setError('');   // reset previous errors when level changes

        const file =
            level === 'country'
                ? `${import.meta.env.BASE_URL}data/countries.geojson`
                : `${import.meta.env.BASE_URL}data/eer.geojson`;

        fetch(file)
            .then((r) => {
                if (!r.ok) throw new Error(`Failed to load geojson (HTTP ${r.status})`);
                return r.json();
            })
            .then((json) => {
                const fixed = level === 'country' ? reprojectFeatureCollectionToWGS84(json) : json;
                setGeojson(fixed);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [level]);

    return { geojson, error, loading };
}