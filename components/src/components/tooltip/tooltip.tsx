import {
    c,
    useRef,
    useState,
    useEffect,
    useCallback,
    css,
} from 'atomico';
import clsx from 'clsx';

import style from './tooltip.module.css';
import stylesInline from './tooltip.module.css?inline';

const Tooltip = c(
    ({
        isActive,
    }) => {
        const tooltipRef = useRef<HTMLDivElement>(null);
        const [position, setPosition] = useState({x: 0, y: 0});

        const updatePosition = useCallback((event: MouseEvent) => {
            const tooltip = tooltipRef.current;

            if (!tooltip) {
                return;
            }

            const {clientX, clientY} = event;
            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let x = clientX + 10;
            let y = clientY + 10;

            if (x + tooltipRect.width > viewportWidth) {
                x = clientX - tooltipRect.width - 10;
            }

            if (y + tooltipRect.height > viewportHeight) {
                y = clientY - tooltipRect.height - 10;
            }

            setPosition({x, y});
        }, [setPosition, tooltipRef]);

        useEffect(() => {
            const handleMouseMove = (event: MouseEvent) => updatePosition(event);

            window.addEventListener('mousemove', handleMouseMove);

            return () => window.removeEventListener('mousemove', handleMouseMove);
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
                        isActive && style.visible,
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
        },
        styles: css`${stylesInline}`,
    },
);

export default Tooltip;
