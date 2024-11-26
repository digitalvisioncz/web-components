import {
    c,
    useRef,
    useState,
    useEffect,
} from 'atomico';

const Tooltip = c(
    ({
        isActive,
    }) => {
        const tooltipRef = useRef<HTMLDivElement>(null);
        const [position, setPosition] = useState({x: 0, y: 0});

        const updatePosition = (event: MouseEvent) => {
            const tooltip = tooltipRef.current;

            if (!tooltip) return;

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
        };

        useEffect(() => {
            const handleMouseMove = (event: MouseEvent) => updatePosition(event);

            window.addEventListener('mousemove', handleMouseMove);

            return () => window.removeEventListener('mousemove', handleMouseMove);
        }, []);

        return (
            <host shadowDom>
                <div
                    ref={tooltipRef}
                    style={{
                        position: 'fixed',
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                        zIndex: 1000,
                        display: isActive ? 'block' : 'none',
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
    },
);

export default Tooltip;

customElements.define('dv-tooltip', Tooltip);
