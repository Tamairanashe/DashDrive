// src/modules/roads-insights-export/services/roads-insights-chart-image.service.ts
import { Injectable } from '@nestjs/common';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

@Injectable()
export class RoadsInsightsChartImageService {
  private readonly lineChart = new ChartJSNodeCanvas({
    width: 1200,
    height: 500,
    backgroundColour: 'white',
  });

  async renderTravelTimeTrend(labels: string[], values: number[]): Promise<Buffer> {
    return this.lineChart.renderToBuffer({
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Travel Time',
            data: values,
            borderColor: '#1677ff',
            backgroundColor: 'rgba(22,119,255,0.15)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: false,
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: 'Travel Time Trend',
          },
        },
      },
    });
  }
}
