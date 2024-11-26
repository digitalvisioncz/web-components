import {
    Ref,
    useEffect,
    useRef,
    useState,
} from 'atomico';
import {
    geoEquirectangular,
    geoPath,
    GeoProjection,
} from 'd3-geo';
import {FeatureCollection} from 'geojson';
import {Topology} from 'topojson-specification';
import {feature} from 'topojson-client';
import mapCountriesData from '../data/countries-110m.json';

interface OnCountryCallbackProps {
    countryId: string | number,
    path: SVGPathElement,
}

interface OnCountryClickProps extends OnCountryCallbackProps {
}

interface OnCountryHoverProps extends OnCountryCallbackProps {
}

type UseWorldMap = (props: {
    showAntarctica: boolean,
    countriesToHighlight?: string[],
    onCountryClick?: (props: OnCountryClickProps) => void,
    onCountryMouseHover?: (props: OnCountryHoverProps) => void,
    onCountryMouseOut?: (props: OnCountryHoverProps) => void,
}) => [
    Ref<SVGElement>, {
        dimensions: {
            width: number,
            height: number,
        },
    }];

const useWorldMap: UseWorldMap = ({
    showAntarctica,
    onCountryClick,
    onCountryMouseHover,
    onCountryMouseOut,
    countriesToHighlight,
}) => {
    const svgRef = useRef<SVGElement>();
    const [countriesData, setCountriesData] = useState<FeatureCollection | null>(null);
    const [landData, setLandData] = useState<FeatureCollection | null>(null);
    const [dimensions, setDimensions] = useState({width: 800, height: 450});

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

                if (showAntarctica) {
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

                if (showAntarctica) {
                    return true;
                }

                return false;
            });

            return features;
        });

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!countriesData || !landData || !dimensions) {
            return;
        }

        const {width, height} = dimensions;

        const projection: GeoProjection = geoEquirectangular().fitSize([width, height], countriesData);
        const pathGenerator = geoPath(projection);

        const svg = svgRef.current;

        svg.innerHTML = '';

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        group.setAttribute('transform', 'translate(0, 0)');

        landData.features.forEach(feature => {
            const d = pathGenerator(feature);

            if (!d) {
                return;
            }

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            path.setAttribute('d', d);
            path.setAttribute('fill', 'transparent');
            path.setAttribute('stroke', '#333');
            path.setAttribute('stroke-width', '0.1');

            group.appendChild(path);
        });

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

            path.setAttribute('fill', 'transparent');

            if (countriesToHighlight && countriesToHighlight.includes(feature.id as string)) {
                path.setAttribute('fill', 'red');
            }

            path.addEventListener('click', () => {
                if (onCountryClick) {
                    onCountryClick({
                        countryId: feature.id,
                        path,
                    });
                }
            });

            path.addEventListener('mouseover', () => {
                if (onCountryMouseHover) {
                    onCountryMouseHover({
                        countryId: feature.id,
                        path,
                    });
                }
            });

            path.addEventListener('mouseout', () => {
                if (onCountryMouseOut) {
                    onCountryMouseOut({
                        countryId: feature.id,
                        path,
                    });
                }
            });

            group.appendChild(path);
        });

        svg.appendChild(group);
    }, [
        countriesData,
        landData,
        countriesToHighlight,
        dimensions,
    ]);

    return [
        svgRef, {
            dimensions,
        },
    ];
};

export default useWorldMap;
