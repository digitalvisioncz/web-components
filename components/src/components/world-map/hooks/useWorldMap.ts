import {
    Ref,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'atomico';
import {
    geoNaturalEarth1,
    geoPath,
    GeoProjection,
} from 'd3-geo';
import {FeatureCollection} from 'geojson';
import {Topology} from 'topojson-specification';
import {feature} from 'topojson-client';
import mapCountriesData from '../data/countries-110m.json';
import styles from '../world-map.module.css';

export enum ActiveCountryModeEnum {
    CLICK = 'click',
    HOVER = 'hover',
    NONE = 'none',
}

interface OnCountryCallbackProps {
    countryId: string | number,
    path: SVGPathElement,
}

interface OnCountryClickProps extends OnCountryCallbackProps {
}

interface OnCountryHoverProps extends OnCountryCallbackProps {
}

type UseWorldMap = (props: {
    countriesToHighlight?: string[],
    countryGroups?: string[][],
    activeCountryMode?: ActiveCountryModeEnum,
    onCountryClick?: (props: OnCountryClickProps) => void,
    onCountryMouseHover?: (props: OnCountryHoverProps) => void,
    onCountryMouseOut?: (props: OnCountryHoverProps) => void,
}) => [
    Ref<SVGElement>, {
        dimensions: {
            width: number,
            height: number,
        },
        activeCountry: string | null,
        hoveringCountry: string | null,
    }];

const useWorldMap: UseWorldMap = ({
    onCountryClick,
    countryGroups = [],
    onCountryMouseHover,
    onCountryMouseOut,
    countriesToHighlight,
    activeCountryMode = ActiveCountryModeEnum.HOVER,
}) => {
    const svgRef = useRef<SVGElement>();
    const [countriesData, setCountriesData] = useState<FeatureCollection | null>(null);
    const [countriesActiveState, setCountriesActiveState] = useState<Record<string, boolean>>({});
    const [countriesHoveringState, setCountriesHoveringState] = useState<Record<string, boolean>>({});
    const [landData, setLandData] = useState<FeatureCollection | null>(null);
    const [dimensions, setDimensions] = useState({width: 800, height: 450});

    const findGroupForCountry = useCallback((countryId: string): string[] => countryGroups.find(group => group.includes(countryId)) || [], [countryGroups]);
    const activeCountry = useMemo(() => {
        const activeCountry = Object.keys(countriesActiveState).find(key => countriesActiveState[key]);

        return activeCountry || null;
    }, [countriesActiveState, countriesHoveringState]);

    const hoveringCountry = useMemo(() => {
        const hoveringCountry = Object.keys(countriesHoveringState).find(key => countriesHoveringState[key]);

        return hoveringCountry || null;
    }, [countriesHoveringState, countriesActiveState]);

    useEffect(() => {
        const updateDimensions = () => {
            if (!svgRef.current?.parentElement) {
                return;
            }

            const parentWidth = svgRef.current.parentElement.clientWidth;
            const newWidth = parentWidth;
            const newHeight = (newWidth * 7) / 16;

            setDimensions({width: newWidth, height: newHeight});
        };

        updateDimensions();

        window.addEventListener('resize', updateDimensions);

        const data = mapCountriesData as unknown as Topology;

        setCountriesData(() => {
            const features = feature(data, data.objects.countries) as unknown as FeatureCollection;

            features.features = features.features.filter(feature => {
                if (feature.id !== '010') {
                    return true;
                }

                return false;
            });

            return features;
        });
        setLandData(() => {
            const features = feature(data, data.objects.land) as FeatureCollection;

            features.features = features.features.filter(feature => {
                if (feature.id !== '010') {
                    return true;
                }

                return false;
            });

            return features;
        });

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!countriesData || !landData || !countryGroups || !dimensions) {
            return;
        }

        const {width, height} = dimensions;

        const projection: GeoProjection = geoNaturalEarth1().fitSize([width, height], countriesData).rotate([-11, 0]);
        const pathGenerator = geoPath(projection);

        const svg = svgRef.current;

        svg.innerHTML = '';

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        landData.features.forEach(feature => {
            const d = pathGenerator(feature);

            if (!d) {
                return;
            }

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            path.setAttribute('d', d);
            path.classList.add(styles.land);

            group.appendChild(path);
        });

        const countryPaths: Record<string, SVGPathElement> = {};

        const toggleCountry = (countryId: string, forcedState?: boolean) => {
            setCountriesActiveState(prevState => ({
                ...prevState,
                [countryId]: forcedState !== undefined ? forcedState : !prevState[countryId],
            }));

            const group = findGroupForCountry(countryId);

            group.forEach(id => {
                const groupPath = countryPaths[id];

                if (groupPath) {
                    groupPath.classList.toggle(styles.highlightedRegion, forcedState);
                }
            });
        };

        const setHoveringOverCountry = (countryId: string, hovering: boolean) => {
            setCountriesHoveringState(prevState => ({
                ...prevState,
                [countryId]: hovering,
            }));

            if (activeCountryMode === ActiveCountryModeEnum.HOVER && countriesToHighlight.includes(countryId)) {
                toggleCountry(countryId, hovering);
            } else {
                const group = findGroupForCountry(countryId);

                group.forEach(id => {
                    const groupPath = countryPaths[id];

                    if (groupPath) {
                        groupPath.classList.toggle(styles.highlightedRegionHovered, hovering);
                    }
                });
            }
        };

        countriesData.features.forEach(feature => {
            if (!feature.id) {
                return;
            }

            const d = pathGenerator(feature);

            if (!d) {
                return;
            }

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            path.setAttribute('d', d);
            path.classList.add(styles.landRegion);

            if (countriesToHighlight && countriesToHighlight.includes(feature.id as string)) {
                path.dataset.testid = `region-${feature.id}`;
                if (activeCountryMode === ActiveCountryModeEnum.NONE) {
                    path.classList.add(styles.highlightedRegion);
                }

                countryPaths[feature.id as string] = path;
            }

            path.addEventListener('click', () => {
                if (onCountryClick) {
                    onCountryClick({
                        countryId: feature.id,
                        path,
                    });
                }

                if (activeCountryMode === ActiveCountryModeEnum.CLICK && countriesToHighlight.includes(feature.id as string)) {
                    toggleCountry(feature.id as string);
                }
            });

            path.addEventListener('mouseover', () => {
                if (onCountryMouseHover) {
                    onCountryMouseHover({
                        countryId: feature.id,
                        path,
                    });
                }

                setHoveringOverCountry(feature.id as string, true);
            });

            path.addEventListener('mouseout', () => {
                if (onCountryMouseOut) {
                    onCountryMouseOut({
                        countryId: feature.id,
                        path,
                    });
                }

                setHoveringOverCountry(feature.id as string, false);
            });

            group.appendChild(path);
        });

        svg.appendChild(group);
    }, [
        countriesData,
        landData,
        countriesToHighlight,
        dimensions,
        countryGroups,
        activeCountryMode,
    ]);

    return [
        svgRef, {
            dimensions,
            activeCountry,
            hoveringCountry,
        },
    ];
};

export default useWorldMap;
