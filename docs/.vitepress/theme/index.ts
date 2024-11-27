import DefaultTheme from 'vitepress/theme';
import DVDEVLayout from './DVDEVLayout.vue';
import './custom.css';

export default {
    ...DefaultTheme,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    Layout: DVDEVLayout,
};
