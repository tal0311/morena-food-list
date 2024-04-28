<template>
  <section class="dashboard-container grid">


    <PieChart class="grid-item pie1" :chartData="data" :options="options" />

    <PieChart class="grid-item pie2" :chartData="data" :options="options" />

    <BarChart :width="500" :height="500" class="grid-item bar-chart" :chartData="data" :options="options" />

  </section>

  <pre>{{ }}</pre>
</template>

<script>
import {
  PolarAreaChart,
  BubbleChart,
  BarChart,
  PieChart,
  LineChart,
  ScatterChart,
} from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'awesome-chart',

  components: {
    BarChart,
    PieChart,
    LineChart,
    PolarAreaChart,
    BubbleChart,
    ScatterChart,
  },

  props: {
    chartData: {
      type: Array,
      required: true,
    },
    labels: {
      type: Array,
      required: false,
      default: () => ['Vegetables', 'Dairy', 'Meat And Poultry', 'Grains', 'Fruits'],
    },
   
  },
  data() {
    return {
      data: {
        labels: [...this.labels],
        datasets: [
          {
            data: [...this.chartData],
            backgroundColor: [
              '#FF6633',
              '#77CEFF',
              '#0079AF',
              '#123E6B',
              '#97B0C4',
              '#A5C8ED',
            ],
          },
        ],
      },

      isLine: false,
      isRadar: false,
      isBubble: false,
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    }
  },
  

}



</script>
<style>
.dashboard-container.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;

  grid-template-areas:
    'pie1 pie2'
    'bar-chart bar-chart';
}

.bar-chart {
  grid-area: bar-chart;
}

.bar-chart #bar-chart,
.bar-chart #line-chart {
  /* width: 400px; */
  aspect-ratio: 2/1;
}

.pie1 {
  grid-area: pie1;
}

.pie2 {
  grid-area: pie2;
}

.stats {
  grid-area: stats;
}

.stat {
  height: 100%;
  font-size: 1.15rem;
}

.stat h2 {
  font-size: 72px;
}
</style>
