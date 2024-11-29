import {useEffect, useState} from 'atomico';
import {parse} from 'valibot';
import {WorldMapData, WorldMapDataArray} from '../helpers/validation';

interface TooltipData {
    countryCode: string,
    title?: string,
    description?: string | string[],
}

interface UseMapDataProps {
    childNodes: ChildNode[],
    regions: WorldMapData,
}

const useMapData = ({childNodes, regions}: UseMapDataProps) => {
    const [data, setData] = useState<WorldMapData | null>(null);
    const [countryGroups, setCountryGroups] = useState<string[][]>([]);
    const [countriesToHighlight, setCountriesToHighlight] = useState<string[]>([]);
    const [tooltipData, setTooltipData] = useState<TooltipData[] | null>(null);

    useEffect(() => {
        if (!childNodes || childNodes.length === 0 || regions) {
            return;
        }

        if (childNodes[1] && childNodes[1] instanceof HTMLScriptElement) {
            const script = childNodes[1];

            const parsedData = parse(WorldMapDataArray, JSON.parse(script.textContent));

            setData(parsedData);
        }
    }, [childNodes]);

    useEffect(() => {
        if (!regions || (childNodes && childNodes.length > 0)) {
            return;
        }

        setData(regions);
    }, [regions]);

    useEffect(() => {
        if (!data) {
            return;
        }

        const countries = data.map(item => item.countries).flat();

        setCountriesToHighlight(countries);

        const tooltipData = countries.map(item => ({
            countryCode: item,
            title: data.find(d => d.countries.includes(item))?.title || '',
            description: data.find(d => d.countries.includes(item))?.description || '',
        }));

        setTooltipData(tooltipData);

        const groups = data.map(item => item.countries);

        setCountryGroups(groups);
    }, [data]);

    return {
        countriesToHighlight: countriesToHighlight,
        tooltipData: tooltipData,
        countryGroups: countryGroups,
    };
};

export default useMapData;
