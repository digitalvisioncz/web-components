import {useEffect, useState} from 'atomico';
import {parse} from 'valibot';
import {WorldMapData, WorldMapDataArray} from '../helpers/validation';

interface TooltipData {
    countryCode: string,
    title: string,
    value?: string | number,
}

const useMapData = (childNodes: ChildNode[]) => {
    const [data, setData] = useState<WorldMapData | null>(null);
    const [countriesToHighlight, setCountriesToHighlight] = useState<string[]>([]);
    const [tooltipData, setTooltipData] = useState<TooltipData[] | null>(null);

    useEffect(() => {
        if (!childNodes || childNodes.length === 0) {
            return;
        }

        if (childNodes[1] && childNodes[1] instanceof HTMLScriptElement) {
            const script = childNodes[1];

            const parsedData = parse(WorldMapDataArray, JSON.parse(script.textContent));

            setData(parsedData);
        }
    }, [childNodes]);

    useEffect(() => {
        if (!data) {
            return;
        }

        const countries = data.map(item => item.countries).flat();

        setCountriesToHighlight(countries);

        const tooltipData = countries.map(item => ({
            countryCode: item,
            title: data.find(d => d.countries.includes(item))?.title || '',
            value: data.find(d => d.countries.includes(item))?.value || '',
        }));

        setTooltipData(tooltipData);
    }, [data]);

    return {
        countriesToHighlight: countriesToHighlight,
        tooltipData: tooltipData,
    };
};

export default useMapData;
