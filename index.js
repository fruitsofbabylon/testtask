import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { randomInt } from 'd3-random';

import { addLogo } from "./utils/logo";
import { addHeader } from "./utils/labels";

const padding = 30;
const W = 960;
const H = 660;

const $root = select('.mz-chart');
addLogo($root, 150, W - 150 - padding, 30);
addHeader($root, padding, 50, 'Тут находится заголовок вашего\nтестового задания')


const randomValue = randomInt(0, 100);
const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const data = months.map(m => ({
    label: m,
    value: randomValue()
}))

const $chartContainer = $root.append('g')
    .classed('mz-chart__container', true)
    .attr('transform', `translate(${padding}, ${100})`);

const height = 500;
const width = W - padding * 2;
const yScale = scaleLinear().domain([0, 100]).range([0, height]);
const xScale = scaleBand().domain(months).range([0, width]).paddingInner(0.2);
const colorScale = scaleLinear().domain([0, 100]).range(['#d22626', '#086cdc']);

const $tooltip = select('.mz-chart__tooltip')

const svgToPx = (x, y) => {
    const svgWidth = $root.node().getBoundingClientRect().width;
    const svgHeight = $root.node().getBoundingClientRect().height;
    
    const widthCoeff = svgWidth / W;
    const heightCoeff = svgHeight / H;

    return [x * widthCoeff, Math.max(y, 50) * heightCoeff]
}

const mouseover = (event, d) => {
    const [x, y] = svgToPx(padding + xScale(d.label), height + 100 - yScale(d.value))
    $tooltip
        .style('display', 'block')
        .style('left', x + 'px')
        .style('top', y + 'px')
        .style('transform', 'translate(0, -105%)');
}
const mouseleave = (d) => $tooltip.style('display', 'none')
const mousemove = (event, d) => {
    const $tooltipHeader = select('.mz-chart__tooltip-header');
    $tooltipHeader.text(d.label);

    const $tooltipValue = select('.mz-chart__tooltip-value');
    $tooltipValue.text(d.value);
};

$chartContainer.selectAll('.mz-chart__bar').data(data).enter()
    .append('g')
    .classed('mz-chart__bar', true)
    .append('rect')
    .attr('x', (d, i) => xScale(d.label))
    .attr('y', (d, i) => height - yScale(d.value))
    .attr('height', (d, i) => yScale(d.value))
    .attr('width', (d, i) => xScale.bandwidth())
    .attr('fill', d => colorScale(d.value))
    .on('mouseover', mouseover)
    .on("mouseleave", mouseleave)
    .on("mousemove", mousemove);

const $chartLabels = $root.append('g')
    .classed('mz-chart__labels', true)
    .attr('transform', `translate(${padding}, ${height + 100 + padding / 2})`)
    .attr('text-anchor', 'middle')

$chartLabels.selectAll('.mz-chart__label').data(data).enter()
    .append('g')
    .classed('mz-chart__label', true)
    .attr('transform', d => `translate(${xScale(d.label) + xScale.bandwidth() / 2}, 0)`)
    .append('text')
    .text(d => d.label)

const updateData = () => {
    const data = months.map(m => ({
        label: m,
        value: randomValue()
    }))
    $chartContainer.selectAll('.mz-chart__bar rect').data(data)
        .style('transition', 'all .5s ease-in')
        .attr('y', (d, i) => height - yScale(d.value))
        .attr('height', (d, i) => yScale(d.value))
        .attr('fill', d => colorScale(d.value));
    
    $chartContainer.select('.mz-chart__med')
        .datum(calcMed(data))
        .attr('y1', d => height - yScale(d))
        .attr('y2', d => height - yScale(d));
    $chartContainer.select('.mz-chart__med-num')
        .datum(calcMed(data))
        .attr('transform', d => `translate(${width}, ${height - yScale(d) - 10})`)
        .html(d => d);
}

const $btn = $root.append('g')
    .classed('mz-chart__btn', true)
    .attr('transform', `translate(${W - 130 - padding}, ${height + 110 + padding / 2})`)
    .on('click', updateData)

$btn
    .append('rect')
    .classed('mz-chart__btn-bg', true)
    .attr('height', '25')
    .attr('width', '130')
    .attr('fill', 'black');

$btn
    .append('g')
    .style('cursor', 'pointer')
    .attr('transform', 'translate(27, 17)')
    .append('text')
    .text('Обновить')
    .attr('fill', '#ffffff');

const calcMed = (data) => {
    const values = data.map(d => d.value);
    values.sort();
    return (values[5] + values[6]) / 2;
};

$chartContainer.append('line')
    .datum(calcMed(data))
    .attr('class', 'mz-chart__med')
    .attr('x1', - 15)
    .attr('y1', d => height - yScale(d))
    .attr('x2', width + 15)
    .attr('y2', d => height - yScale(d));

$chartContainer.append('text')
    .datum(calcMed(data))
    .attr('class', 'mz-chart__med-num')
    .attr('transform', d => `translate(${width}, ${height - yScale(d) - 10})`)
    .attr('text-anchor', 'end')
    .style('fill', 'red')
    .html(d => d);