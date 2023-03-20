import React, { useState } from 'react';
import { extent, max } from 'd3-array';
import * as allCurves from '@visx/curve';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { scaleTime, scaleLinear } from '@visx/scale';
import { MarkerCircle } from '@visx/marker';
import generateDateValue, { DateValue } from '@visx/mock-data/lib/generators/genDateValue';
import { Text } from '@visx/text';
import { ave } from './ave';


const width = 400;
const height = 300;

type CurveType = keyof typeof allCurves;

const lineCount = 1;
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

let data = JSON.parse(JSON.stringify(allData).replace(/value/g, 'y'))

export default function SparkGraph() {
  const [curveType] = useState<CurveType>('curveLinear');
  const svgHeight = height;
  const lineHeight = svgHeight / lineCount;

  xScale.range([180, width - 50]);
  yScale.range([10, height - 160]);


  return (
    <svg width={width} height={svgHeight}>
      <MarkerCircle id="marker-circle-even" fill="black" size={1} refX={2} />
      <MarkerCircle id="marker-circle-odd" fill="skyblue" size={1} refX={2} />
      <rect width={width} height={svgHeight} fill="#efefef" rx={14} ry={14} />
      {width > 8 &&
        series.map((lineData, i) => {
          const even = i % 2 === 0;
          return (
            <Group key={`lines-${i}`} top={i * lineHeight} left={13}>
              <LinePath<DateValue>
                curve={allCurves[curveType]}
                data={lineData}
                x={(d) => xScale(getX(d)) ?? 0}
                y={(d) => yScale(getY(d)) ?? 0}
                stroke={even ? "black" : "skyblue"}
                strokeWidth={2}
                strokeOpacity={even ? 0.6 : 1}
                shapeRendering="geometricPrecision"
              />
              <svg>
                <Text
                  verticalAnchor="start"
                  dx={20}
                  dy={100}
                  fill={"#444"}
                  fontFamily={"Monaco"}
                  fontSize={62}
                >
                  {ave(data)}
                </Text>
              </svg>
              <svg>
                <Text
                  verticalAnchor="start"
                  dx={20}
                  dy={180}
                  fill={"#444"}
                  fontFamily={"Monaco"}
                  fontSize={56}
                >
                  Ave Data
                </Text>
              </svg>

            </Group>


          );
        })}
    </svg>
  );
}

