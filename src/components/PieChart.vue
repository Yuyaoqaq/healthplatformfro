<template>
  <div>
    <!-- DOM 容器，需设置宽高 -->
    <div ref="pieChart" style="width: 500px; height: 300px;"></div>
  </div>
</template>

<script>
// 引入 ECharts(局部引入更灵活)
import * as echarts from "echarts";

export default {
  name: "PieChart",
  props: {
    // 接收父组件传递的饼图数据
    chartData: []
  },
  methods: {
    initPieChart() {
      // 获取 DOM 容器
      const pieDom = this.$refs.pieChart;
      // 初始化 ECharts 实例
      const myChart = echarts.init(pieDom);
      // 配置饼图选项
      var option;
      setTimeout(() => {
        option = {
          backgroundColor: "#B5CE98",
          title: {
            text: "Role Analyse",
            left: "center",
            top: 20,
            textStyle: {
              color: "#FCD910"
            }
          },
          tooltip: {
            trigger: "item"
          },
          visualMap: {
            show: false,
            min: -5,
            max: 15,
            inRange: {
              colorLightness: [0.4, 1]
            }
          },
          series: [
            {
              name: "Role & Num",
              type: "pie",
              radius: "70%",
              center: ["50%", "50%"],
              data: this.chartData.sort(function(a, b) {
                return a.value - b.value;
              }),
              roseType: "radius",
              label: {
                color: "rgba(255, 255, 255)"
              },
              labelLine: {
                lineStyle: {
                  color: "rgba(255, 255, 255)"
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              },
              itemStyle: {
                color: "#c23531",
                shadowBlur: 200,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              animationType: "scale",
              animationEasing: "elasticOut",
              animationDelay: function(idx) {
                return Math.random() * 200;
              }
            }
          ]
        };
        // 渲染饼图
        myChart.setOption(option);
      }, 500);
    }
  },
  mounted() {
    // 组件挂载后初始化饼图
    this.initPieChart();
  }
};
</script>