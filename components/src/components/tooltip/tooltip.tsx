import {
    c,
    useRef,
    useState,
    useEffect,
} from 'atomico';

const Tooltip = c(
    () => {
        const tooltipRef = useRef<HTMLDivElement>(null);
        const [position, setPosition] = useState({x: 0, y: 0});

        const updatePosition = (event: MouseEvent) => {
            const tooltip = tooltipRef.current;

            if (!tooltip) return;

            const {clientX, clientY} = event;
            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let x = clientX + 10; // Offset from the mouse position
            let y = clientY + 10;

            // Prevent overflow on the right side
            if (x + tooltipRect.width > viewportWidth) {
                x = clientX - tooltipRect.width - 10;
            }

            // Prevent overflow on the bottom side
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
                    }}
                >
                    <slot name="tooltip" />
                </div>
            </host>
        );
    },
    {
        props: {
        },
    },
);

export default Tooltip;

customElements.define('dv-tooltip', Tooltip);
