import {
    c,
    css,
    useEffect,
    useMemo,
    useState,
} from 'atomico';
import {useChildNodes} from '@atomico/hooks/use-child-nodes';

import useMapData from './hooks/useMapData';
import useWorldMap, {ActiveCountryModeEnum} from './hooks/useWorldMap';
import Tooltip from '../tooltip/tooltip';

import styles from './world-map.module.css';
import stylesInline from './world-map.module.css?inline';

const WorldMap = c(
    ({
        activeCountryMode,
    }) => {
        const childNodes = useChildNodes();
        const [showTooltip, setShowTooltip] = useState(false);
        const {
            countriesToHighlight,
            tooltipData,
            countryGroups,
        } = useMapData(childNodes);
        const [
            svgRef, {
                dimensions,
                activeCountry,
            },
        ] = useWorldMap({
            countriesToHighlight,
            activeCountryMode,
            countryGroups,
        });

        useEffect(() => {
            if (activeCountry) {
                setShowTooltip(true);

                return;
            }

            setShowTooltip(false);
        }, [activeCountry]);

        const activeRegionData = useMemo(() => {
            if (!activeCountry) {
                return null;
            }

            const regionData = tooltipData.find(item => item.countryCode.includes(activeCountry));

            return regionData;
        }, [activeCountry, tooltipData]);

        return (
            <host shadowDom>
                <div
                    className={styles.mapContainer}
                >
                    <svg
                        ref={svgRef}
                        width="100%"
                        height="100%"
                        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                        preserveAspectRatio="xMidYMid meet"
                    >
                    </svg>
                </div>
                <Tooltip isActive={showTooltip}>
                    <div
                        slot="tooltip"
                        className={styles.tooltipWrapper}
                    >
                        {activeRegionData && (
                            <>
                                <h5
                                    className={styles.tooltipTitle}
                                >
                                    {activeRegionData.title}
                                </h5>
                                <span
                                    className={styles.tooltipDescription}
                                >
                                    {activeRegionData.description}
                                </span>
                            </>
                        )}
                    </div>
                </Tooltip>
            </host>
        );
    },
    {
        styles: css`${stylesInline}`,
        props: {
            activeCountryMode: {
                type: String,
                reflect: true,
                value: ActiveCountryModeEnum.HOVER,
            },
            children: {
                type: Element,
            },
        },
    },
);

export default WorldMap;

customElements.define('dv-world-map', WorldMap);
