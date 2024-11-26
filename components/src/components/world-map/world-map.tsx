import {c} from 'atomico';
import useWorldMap from './hooks/useWorldMap';
import {useChildNodes} from '@atomico/hooks/use-child-nodes';
import useMapData from './hooks/useMapData';
import Tooltip from '../tooltip/tooltip';

const WorldMap = c(
    ({
        showAntarctica,
    }) => {
        const childNodes = useChildNodes();
        const {countriesToHighlight} = useMapData(childNodes);
        const [
            svgRef, {
                dimensions,
            },
        ] = useWorldMap({
            showAntarctica,
            countriesToHighlight,
        });

        return (
            <host>
                <div
                    style={{
                        width: '100%',
                        height: 'auto',
                        position: 'relative',
                        aspectRatio: '16 / 7',
                    }}
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
                <Tooltip>
                    <span
                        slot="tooltip"
                        style={{
                            padding: '5px 10px',
                            backgroundColor: '#333',
                            color: '#fff',
                            borderRadius: '4px',
                        }}
                    >
                        Hello
                    </span>
                </Tooltip>
            </host>
        );
    },
    {
        props: {
            showAntarctica: {
                type: Boolean,
                reflect: true,
                value: false,
            },
            children: {
                type: Element,
            },
        },
    },
);

export default WorldMap;

customElements.define('dv-world-map', WorldMap);
