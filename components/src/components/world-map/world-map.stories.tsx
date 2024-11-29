import {define} from '@atomico/storybook';
import {Props} from 'atomico';
import WorldMap from './index';
import {ActiveCountryModeEnum} from './hooks/useWorldMap';

export type WorldMapProps = Props<typeof WorldMap>;

export default {
    title: 'Components/WorldMap',
    ...define(WorldMap),
};

export const Default = (props: WorldMapProps) => <WorldMap {...props} />;

export const WithRegionsHighlighted = (props: WorldMapProps) => (
    <WorldMap
        {...props}
        activeCountryMode={ActiveCountryModeEnum.NONE}
        regions={[
            {
                countries: ['840'],
            },
            {
                countries: ['203', '703'],
            },
            {
                countries: ['076'],
            },
        ]}
    />
);

export const WithRegionTooltip = (props: WorldMapProps) => (
    <WorldMap
        {...props}
        activeCountryMode={ActiveCountryModeEnum.HOVER}
        regions={[
            {
                countries: ['840'],
                title: 'United States',
                description: 'United States of America',
            },
            {
                countries: ['203', '703'],
                title: 'Czech Republic',
                description: 'Czechia',
            },
            {
                countries: ['076'],
                title: 'Brazil',
                description: ['Federative Republic of Brazil', 'Brasil'],
            },
        ]}
    />
);

export const WithTooltipTitleOnly = (props: WorldMapProps) => (
    <WorldMap
        {...props}
        activeCountryMode={ActiveCountryModeEnum.HOVER}
        regions={[
            {
                countries: ['840'],
                title: 'United States',
            },
            {
                countries: ['203', '703'],
                title: 'Czech Republic',
            },
            {
                countries: ['076'],
                title: 'Brazil',
            },
        ]}
    />
);

export const WithTooltipDescriptionOnly = (props: WorldMapProps) => (
    <WorldMap
        {...props}
        activeCountryMode={ActiveCountryModeEnum.HOVER}
        regions={[
            {
                countries: ['840'],
                description: 'United States of America',
            },
            {
                countries: ['203', '703'],
                description: 'Czechia',
            },
            {
                countries: ['076'],
                description: ['Federative Republic of Brazil', 'Brasil'],
            },
        ]}
    />
);
