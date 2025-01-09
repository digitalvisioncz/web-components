import {define} from '@atomico/storybook';
import {Meta, StoryObj} from '@storybook/react';
import {
    within,
    expect,
} from '@storybook/test';
import {Props} from 'atomico';
import Tooltip from './index';
import {TooltipPositionModeEnum} from './tooltip';
import {within as shadowWithin} from 'shadow-dom-testing-library';

export type TooltipProps = Props<typeof Tooltip>;
type TooltipStoryObj = StoryObj<typeof Tooltip>;

const meta: Meta<TooltipStoryObj> = {
    title: 'Components/Tooltip',
    ...define(Tooltip),
    render: args => (
        <div data-testid="wrapper" style={{width: '200px', height: '200px'}}>
            <Tooltip {...args}>
                <div slot="tooltip" data-testid="tooltip-content">
                    Tooltip
                </div>
            </Tooltip>
        </div>
    ),
};

export default meta;

export const Default: TooltipStoryObj = {
    args: {
        isActive: true,
        tooltipMode: TooltipPositionModeEnum.FOLLOW_MOUSE,
    },
    play: async ({canvasElement}) => {
        const tooltipWrapper = within(canvasElement).getByTestId('wrapper');

        await expect(tooltipWrapper).toBeInTheDocument();

        const canvasShadow = shadowWithin(tooltipWrapper);

        const tooltipElement = await canvasShadow.findByShadowTestId('tooltip');

        await expect(tooltipElement).toBeInTheDocument();
    },
};

export const TooltipPositionClick: TooltipStoryObj = {
    args: {
        isActive: true,
        tooltipMode: TooltipPositionModeEnum.CLICK,
    },
    play: async ({canvasElement}) => {
        const tooltipWrapper = within(canvasElement).getByTestId('wrapper');

        await expect(tooltipWrapper).toBeInTheDocument();

        const canvasShadow = shadowWithin(tooltipWrapper);

        const tooltipElement = await canvasShadow.findByShadowTestId('tooltip');

        await expect(tooltipElement).toBeInTheDocument();
    },
};

export const TooltipPositionStatic: TooltipStoryObj = {
    args: {
        isActive: true,
        tooltipMode: TooltipPositionModeEnum.STATIC,
        position: {
            x: 100,
            y: 100,
        },
    },
    play: async ({canvasElement}) => {
        const tooltipWrapper = within(canvasElement).getByTestId('wrapper');

        await expect(tooltipWrapper).toBeInTheDocument();

        const canvasShadow = shadowWithin(tooltipWrapper);

        const tooltipElement = await canvasShadow.findByShadowTestId('tooltip');

        await expect(tooltipElement).toBeInTheDocument();
    },
};