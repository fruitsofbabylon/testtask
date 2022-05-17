import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { randomInt } from 'd3-random';

import { addLogo } from "./utils/logo";
import { addHeader } from "./utils/labels";

const padding = 30;
const W = 960;

const $root = select('.mz-chart');
addLogo($root, 150, W - 150 - padding, 30);
addHeader($root, padding, 50, 'Тут находится заголовок вашего\nтестового задания')


const randomValue = randomInt(0,100);
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
const colorScale = scaleLinear().domain([0,100]).range(['#d22626', '#086cdc']);

$chartContainer.selectAll('.mz-chart__bar').data(data).enter()
    .append('g')
    .classed('mz-chart__bar', true)
    .append('rect')
    .attr('x', (d, i) => xScale(d.label))
    .attr('y', (d, i) => height - yScale(d.value))
    .attr('height', (d, i) => yScale(d.value))
    .attr('width', (d, i) => xScale.bandwidth())
    .attr('fill', d => colorScale(d.value));

const $chartLabels = $root.append('g')
    .classed('mz-chart__labels', true)
    .attr('transform', `translate(${padding}, ${height + 100 + padding / 2})`)
    .attr('text-anchor','middle')

$chartLabels.selectAll('.mz-chart__label').data(data).enter()
    .append('g')
    .classed('mz-chart__label', true)
    .attr('transform', d => `translate(${xScale(d.label) + xScale.bandwidth() / 2}, 0)`)
    .append('text')
    .text(d => d.label)


