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
import Tooltip from '../tooltip';

import styles from './world-map.module.css';
import stylesInline from './world-map.module.css?inline';

const WorldMap = c(
    ({
        activeCountryMode,
        regions,
    }) => {
        const childNodes = useChildNodes();
        const [showTooltip, setShowTooltip] = useState(false);
        const {
            countriesToHighlight,
            tooltipData,
            countryGroups,
        } = useMapData({
            childNodes,
            regions,
        });
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

        const activeRegionData = useMemo(() => {
            if (!activeCountry) {
                return null;
            }

            const regionData = tooltipData.find(item => item.countryCode.includes(activeCountry));

            return regionData;
        }, [activeCountry, tooltipData]);

        const activeRegionDataHasTooltip = useMemo(() => {
            if (!activeRegionData) {
                return false;
            }

            return activeRegionData.title || activeRegionData.description;
        }, [activeRegionData]);

        useEffect(() => {
            if (activeCountry && activeRegionDataHasTooltip) {
                setShowTooltip(true);

                return;
            }

            setShowTooltip(false);
        }, [activeCountry, activeRegionDataHasTooltip]);

        return (
            <host
                shadowDom
                data-testid="world-map"
            >
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
                        data-testid="tooltip-wrapper"
                    >
                        {activeRegionData && (
                            <>
                                {activeRegionData.title && (
                                    <h5
                                        className={styles.tooltipTitle}
                                        data-testid="tooltip-title"
                                    >
                                        {activeRegionData.title}
                                    </h5>
                                )}
                                {activeRegionData.description && (
                                    <div
                                        className={styles.tooltipDescription}
                                        data-testid="tooltip-description"
                                    >
                                        {(
                                            Array.isArray(activeRegionData.description)
                                                ? activeRegionData.description
                                                : [activeRegionData.description]
                                        ).map((description, index) => (
                                            <span key={index}>
                                                {description}
                                            </span>
                                        ))}
                                    </div>
                                )}
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
            regions: {
                type: Array,
                reflect: true,
            },
            children: {
                type: Element,
            },
        },
    },
);

export default WorldMap;
