import React, { Component } from 'react';
import LineGraph from './component/Visx_line.tsx';
import SparkGraph from './component/Visx_sparkline.tsx';
import PieGraph from './component/Visx_pie.tsx';
import TreeGraph from './component/Visx_tree.tsx';

export default class App extends Component {
  render() {
    return (
      <div>     
        <LineGraph/>
        <br/>
        <PieGraph/>
        <br/>
        <SparkGraph/>
        <br/>
        <TreeGraph/>
      </div>
    )
  }
}




