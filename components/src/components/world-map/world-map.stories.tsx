import {define} from '@atomico/storybook';
import {Meta, StoryObj} from '@storybook/react';
import {
    userEvent,
    within,
    expect,
} from '@storybook/test';
import {Props} from 'atomico';
import WorldMap from './index';
import {ActiveCountryModeEnum} from './hooks/useWorldMap';
import {within as shadowWithin} from 'shadow-dom-testing-library';

import styles from './world-map.module.css';
import tooltipStyles from '../tooltip/tooltip.module.css';

export type WorldMapProps = Props<typeof WorldMap>;
type WorldMapStoryObj = StoryObj<typeof WorldMap>;

const meta: Meta<WorldMapProps> = {
    title: 'Components/WorldMap',
    ...define(WorldMap),
    render: args => <WorldMap {...args} />,
};

export default meta;

export const Default: WorldMapStoryObj = {
    args: {},
    play: async ({canvasElement}) => {
        const mapElement = within(canvasElement).getByTestId('world-map');

        await expect(mapElement).toBeInTheDocument();
    },
};

export const WithRegionsHighlighted: WorldMapStoryObj = {
    args: {
        activeCountryMode: ActiveCountryModeEnum.NONE,
        regions: [
            {
                countries: ['840'],
            },
        ],
    },
    play: async ({canvasElement}) => {
        const mapElement = within(canvasElement).getByTestId('world-map');

        await expect(mapElement).toBeInTheDocument();

        const mapShadow = shadowWithin(mapElement);

        const unitedStates = await mapShadow.findByShadowTestId('region-840');

        await userEvent.hover(unitedStates);

        await expect(unitedStates).toHaveClass(styles.highlightedRegion);

        const tooltip = mapShadow.queryAllByShadowTestId('tooltip')[0];

        await expect(tooltip).toHaveStyle('display: none');

        await userEvent.unhover(unitedStates);
    },
};

export const WithRegionsTooltip: WorldMapStoryObj = {
    args: {
        activeCountryMode: ActiveCountryModeEnum.HOVER,
        regions: [
            {
                countries: ['840'],
                title: 'United States',
                description: 'United States of America',
            },
        ],
    },
    play: async ({canvasElement}) => {
        const mapElement = within(canvasElement).getByTestId('world-map');

        await expect(mapElement).toBeInTheDocument();

        const mapShadow = shadowWithin(mapElement);

        const unitedStates = await mapShadow.findByShadowTestId('region-840');

        await userEvent.hover(unitedStates);

        const tooltip = await mapShadow.findByShadowTestId('tooltip');

        await expect(tooltip).toBeInTheDocument();
        await expect(tooltip).toHaveClass(tooltipStyles.visible);

        const tooltipTitle = await mapShadow.findByShadowTestId('tooltip-title');

        await expect(tooltipTitle).toHaveTextContent('United States');

        const tooltipDescription = await mapShadow.findByShadowTestId('tooltip-description');

        await expect(tooltipDescription).toHaveTextContent('United States of America');

        await userEvent.unhover(unitedStates);
    },
};

export const WithTooltipTitleOnly: WorldMapStoryObj = {
    args: {
        activeCountryMode: ActiveCountryModeEnum.HOVER,
        regions: [
            {
                countries: ['840'],
                title: 'United States',
            },
        ],
    },
    play: async ({canvasElement}) => {
        const mapElement = within(canvasElement).getByTestId('world-map');

        await expect(mapElement).toBeInTheDocument();

        const mapShadow = shadowWithin(mapElement);

        const unitedStates = await mapShadow.findByShadowTestId('region-840');

        await userEvent.hover(unitedStates);

        const tooltip = await mapShadow.findByShadowTestId('tooltip');

        await expect(tooltip).toBeInTheDocument();

        const tooltipTitle = await mapShadow.findByShadowTestId('tooltip-title');

        await expect(tooltipTitle).toHaveTextContent('United States');

        const description = mapShadow.queryAllByShadowTestId('tooltip-description');

        await expect(description).toHaveLength(0);

        await userEvent.unhover(unitedStates);
    },
};

export const WithTooltipDescriptionOnly: WorldMapStoryObj = {
    args: {
        activeCountryMode: ActiveCountryModeEnum.HOVER,
        regions: [
            {
                countries: ['840'],
                description: 'United States of America',
            },
        ],
    },
    play: async ({canvasElement}) => {
        const mapElement = within(canvasElement).getByTestId('world-map');

        await expect(mapElement).toBeInTheDocument();

        const mapShadow = shadowWithin(mapElement);

        const unitedStates = await mapShadow.findByShadowTestId('region-840');

        await userEvent.hover(unitedStates);

        const tooltip = await mapShadow.findByShadowTestId('tooltip');

        await expect(tooltip).toBeInTheDocument();

        const tooltipTitle = mapShadow.queryAllByShadowTestId('tooltip-title');

        await expect(tooltipTitle).toHaveLength(0);

        const tooltipDescription = await mapShadow.findByShadowTestId('tooltip-description');

        await expect(tooltipDescription).toHaveTextContent('United States of America');

        await userEvent.unhover(unitedStates);
    },
};

export const WithCSSVariables: WorldMapStoryObj = {
    args: {
        activeCountryMode: ActiveCountryModeEnum.HOVER,
        regions: [
            {
                countries: ['840'],
                title: 'United States',
                description: 'United States of America',
            },
        ],
    },
    render: args => {
        return (
            <div
                style={{
                    '--dv-world-map-background': '#fff',
                    '--dv-world-map-land-background': '#f0f0f0',
                    '--dv-world-map-land-border-color': '#ffc107',
                    '--dv-world-map-land-border-width': '1',
                    '--dv-world-map-region-background': '#96c21c',
                    '--dv-world-map-region-background-hover': '#688b06',
                    '--dv-world-map-tooltip-border-color': 'red',
                    '--dv-world-map-tooltip-border-width': '1px',
                    '--dv-world-map-tooltip-title-color': '#333',
                    '--dv-world-map-tooltip-description-color': '#666',
                }}
            >
                <WorldMap {...args} />
            </div>
        );
    },
    play: async ({canvasElement}) => {
        const mapElement = within(canvasElement).getByTestId('world-map');

        await expect(mapElement).toBeInTheDocument();

        const mapShadow = shadowWithin(mapElement);

        const unitedStates = await mapShadow.findByShadowTestId('region-840');

        await userEvent.hover(unitedStates);

        const tooltipTitle = await mapShadow.findByShadowTestId('tooltip-title');

        await expect(tooltipTitle).toHaveStyle('color: #333');

        const tooltipDescription = await mapShadow.findByShadowTestId('tooltip-description');

        await expect(tooltipDescription).toHaveStyle('color: #666');

        await userEvent.unhover(unitedStates);
    },
};
