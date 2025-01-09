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

type TooltipProps = {
    isActive: boolean,
    tooltipMode?: TooltipPositionModeEnum,
    position?: {
        x: number,
        y: number,
    },
};

const Tooltip = c(
    ({
        isActive,
        tooltipMode = TooltipPositionModeEnum.FOLLOW_MOUSE,
        position: positionFromProps,
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

            let x = newX + 10;
            let y = newY + 10;

            if (x + tooltipRect.width > viewportWidth) {
                x = newX - tooltipRect.width - 10;
            }

            if (y + tooltipRect.height > viewportHeight) {
                y = newY - tooltipRect.height - 10;
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
        },
        styles: css`${stylesInline}`,
    },
);

export default Tooltip;
