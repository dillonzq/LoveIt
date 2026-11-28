import { forEach } from '../util.js';

// ECharts are drawn again in the other theme when it switches, and resized with the window.
export default function initEcharts(theme) {
    const echartsConfig = theme.config.echarts;
    echarts.registerTheme('light', echartsConfig.lightTheme);
    echarts.registerTheme('dark', echartsConfig.darkTheme);
    let charts = [];
    const render = () => {
        for (const chart of charts) chart.dispose();
        charts = [];
        forEach(document.getElementsByClassName('echarts'), $echarts => {
            const chart = echarts.init($echarts, theme.isDark ? 'dark' : 'light', { renderer: 'svg' });
            chart.setOption(JSON.parse(theme.data[$echarts.id]));
            charts.push(chart);
        });
    };
    theme.switchThemeEventSet.add(render);
    render();
    theme.resizeEventSet.add(() => {
        for (const chart of charts) chart.resize();
    });
}
