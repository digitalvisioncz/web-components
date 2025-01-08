import {define} from '@atomico/storybook';
import {Meta, StoryObj} from '@storybook/react';
import {
    within,
    expect,
} from '@storybook/test';
import {Props} from 'atomico';
import Tooltip from './index';
import {TooltipPositionModeEnum} from './tooltip';

export type TooltipProps = Props<typeof Tooltip>;
type TooltipStoryObj = StoryObj<typeof Tooltip>;

const meta: Meta<TooltipStoryObj> = {
    title: 'Components/Tooltip',
    ...define(Tooltip),
    render: args => (
        <div data-testid="wrapper">
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

        const tooltipElement = within(canvasElement).getByTestId('tooltip-content');

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

        const tooltipElement = within(canvasElement).getByTestId('tooltip-content');

        await expect(tooltipElement).toBeInTheDocument();
    },
};

