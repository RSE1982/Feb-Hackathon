import { useEffect, useRef, useState } from 'react';

export function useContainerWidth() {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!ref.current) return;

        const ro = new ResizeObserver((entries) => {
            setWidth(entries[0].contentRect.width);
        });

        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);

    return { ref, width };
}