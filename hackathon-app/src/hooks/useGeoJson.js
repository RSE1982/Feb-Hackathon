import { useEffect, useState } from "react";

export function useGeoJson(level) {
    const [geojson, setGeojson] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (level !== "country" && level !== "region") return;

        const file =
            level === "country"
                ? "/data/countries.geojson"
                : "/data/eer.geojson";

        fetch(file)
            .then((r) => {
                if (!r.ok) throw new Error("Failed to load geojson");
                return r.json();
            })
            .then(setGeojson)
            .catch((e) => setError(e.message));
    }, [level]);

    return { geojson, error };
}