import React, { useState } from 'react';
import { extent, max } from 'd3-array';
import * as allCurves from '@visx/curve';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { scaleTime, scaleLinear } from '@visx/scale';
import { MarkerCircle } from '@visx/marker';
import generateDateValue, { DateValue } from '@visx/mock-data/lib/generators/genDateValue';
import { AxisBottom, AxisLeft } from '@visx/axis';

const width = 400;
const height = 300;

type CurveType = keyof typeof allCurves;

const lineCount = 2;
const series = new Array(lineCount).fill(null).map((_, i) =>

  generateDateValue(12, /* seed= */ i / 72).sort(
    (a: DateValue, b: DateValue) => a.date.getTime() - b.date.getTime(),
  ),
);
const allData = series.reduce((rec, d) => rec.concat(d), []);

const getX = (d: DateValue) => d.date;
const getY = (d: DateValue) => d.value;

const xScale = scaleTime<number>({
  domain: extent(allData, getX) as [Date, Date],
});
const yScale = scaleLinear<number>({
  domain: [0, max(allData, getY) as number],
});

export default function LineGraph() {
  const [curveType] = useState<CurveType>('curveMonotoneX');
  const svgHeight = height;

  xScale.range([40, width-30]);
  yScale.range([height-40, 40]);
  return (
    <svg width={width} height={svgHeight}>
      <MarkerCircle id="marker-circle-even" fill="black" size={1} refX={2} />
      <MarkerCircle id="marker-circle-odd" fill="skyblue" size={1} refX={2} />
      <rect width={width} height={svgHeight} fill="#efefef" rx={14} ry={14} />
      {width > 8 &&
        series.map((lineData, i) => {
          const even = i % 2 === 0;
          return (
            <svg width={width} height={height} key={`lines-${i}`} >
              <Group top={0} left={0}>
                <LinePath<DateValue>
                  curve={allCurves[curveType]}
                  data={lineData}
                  x={(d) => xScale(getX(d)) ?? 0}
                  y={(d) => yScale(getY(d)) ?? 0}
                  stroke={even ? "black" : "skyblue"}
                  strokeWidth={2}
                  strokeOpacity={even ? 0.6 : 1}
                  shapeRendering="geometricPrecision"
                  markerMid={even ? "url(#marker-circle-even)" : "url(#marker-circle-odd)"}
                />
              </Group>
              <AxisBottom top={260} scale={xScale} numTicks={5}/>
              <AxisLeft scale={yScale} left={40} />
            </svg>
          );
        })}
    </svg>
  );
}

