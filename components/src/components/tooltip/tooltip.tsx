import {
    c,
    useRef,
    useState,
    useEffect,
    useCallback,
    css,
    useMemo,
} from 'atomico';
import clsx from 'clsx';

import style from './tooltip.module.css';
import stylesInline from './tooltip.module.css?inline';

export enum TooltipPositionModeEnum {
    CLICK = 'click',
    FOLLOW_MOUSE = 'follow_mouse',
    STATIC = 'static',
    NONE = 'none',
}

export enum TooltipAnchorX {
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right',
}

export enum TooltipAnchorY {
    TOP = 'top',
    CENTER = 'center',
    BOTTOM = 'bottom',
}

type TooltipAnchor = {
    x: TooltipAnchorX | number,
    y: TooltipAnchorY | number,
};

type TooltipPosition = {
    x: number,
    y: number,
};

type TooltipProps = {
    isActive: boolean,
    tooltipMode?: TooltipPositionModeEnum,
    position?: TooltipPosition,
    anchor?: TooltipAnchor,
};

const Tooltip = c(
    ({
        isActive,
        tooltipMode = TooltipPositionModeEnum.FOLLOW_MOUSE,
        position: positionFromProps,
        anchor = {x: TooltipAnchorX.LEFT, y: TooltipAnchorY.TOP},
    }: TooltipProps) => {
        const tooltipRef = useRef<HTMLDivElement>(null);
        const [position, setPosition] = useState(positionFromProps || {x: 0, y: 0});

        const isTooltipVisible = useMemo(() => {
            if (tooltipMode === TooltipPositionModeEnum.NONE) {
                return false;
            }

            if (tooltipMode === TooltipPositionModeEnum.CLICK) {
                return isActive;
            }

            return isActive;
        }, [
            isActive,
            position,
            tooltipMode,
        ]);

        useEffect(() => {
            if (positionFromProps?.x !== undefined && positionFromProps?.y !== undefined) {
                updatePosition(positionFromProps?.x, positionFromProps?.y);
            }
        }, [positionFromProps]);

        const handleUpdatePosition = useCallback((event: MouseEvent) => {
            const {clientX, clientY} = event;

            updatePosition(clientX, clientY);
        }, [setPosition, tooltipRef]);

        const updatePosition = useCallback((newX, newY) => {
            const tooltip = tooltipRef.current;

            if (!tooltip) {
                return;
            }

            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // new tooltip positioning solution with anchoring based on anchor props
            let x = newX;
            let y = newY;

            const anchorMargin = 10;

            if (anchor.x === TooltipAnchorX.LEFT) {
                x += anchorMargin;
            } else if (anchor.x === TooltipAnchorX.CENTER) {
                x -= tooltipRect.width / 2;
            } else if (anchor.x === TooltipAnchorX.RIGHT) {
                x -= tooltipRect.width + anchorMargin;
            }

            if (anchor.y === TooltipAnchorY.TOP) {
                y += anchorMargin;
            } else if (anchor.y === TooltipAnchorY.CENTER) {
                y -= tooltipRect.height / 2;
            } else if (anchor.y === TooltipAnchorY.BOTTOM) {
                y -= tooltipRect.height + anchorMargin;
            }

            if (x + tooltipRect.width + anchorMargin > viewportWidth) {
                x = viewportWidth - tooltipRect.width - anchorMargin;
            }

            if (y + tooltipRect.height + anchorMargin > viewportHeight) {
                y = viewportHeight - tooltipRect.height - anchorMargin;
            }

            if (x < 0) {
                x = anchorMargin;
            }

            if (y < 0) {
                y = anchorMargin;
            }

            setPosition({x, y});
        }, [setPosition, tooltipRef]);

        useEffect(() => {
            const handleMouseMove = (event: MouseEvent) => handleUpdatePosition(event);
            const handleClick = (event: MouseEvent) => {
                handleUpdatePosition(event);
            };

            if (tooltipMode === TooltipPositionModeEnum.FOLLOW_MOUSE) {
                window.addEventListener('mousemove', handleMouseMove);
            } else if (tooltipMode === TooltipPositionModeEnum.CLICK) {
                window.addEventListener('click', handleClick);
            }

            return () => {
                if (tooltipMode === TooltipPositionModeEnum.FOLLOW_MOUSE) {
                    window.removeEventListener('mousemove', handleMouseMove);
                } else if (tooltipMode === TooltipPositionModeEnum.CLICK) {
                    window.removeEventListener('click', handleClick);
                }
            };
        }, []);

        return (
            <host
                shadowDom
            >
                <div
                    ref={tooltipRef}
                    data-testid="tooltip"
                    className={clsx(
                        style.tooltip,
                        isTooltipVisible && style.visible,
                    )}
                    style={{
                        '--left': `${position.x}px`,
                        '--top': `${position.y}px`,
                    }}
                >
                    <slot name="tooltip" />
                </div>
            </host>
        );
    },
    {
        props: {
            isActive: {
                type: Boolean,
                reflect: true,
            },
            tooltipMode: {
                type: String,
                reflect: true,
            },
            position: {
                type: Object,
                reflect: true,
            },
            anchor: {
                type: Object,
                reflect: true,
            },
        },
        styles: css`${stylesInline}`,
    },
);

export default Tooltip;
