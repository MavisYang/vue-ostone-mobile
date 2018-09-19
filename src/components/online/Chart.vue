<template>
  <div class="chart-container" v-el:chart style="height: 220px;width: 290px;">
  </div>
</template>
<script>
import api from '../../api'
export default {
  props: {
    // historyData: Array
  },
  ready () {
    var me = this
    window.alert(0)
    api.require(['echarts.all.min.js'], function () {
      var myChart = window.echarts.init(me.$els.chart)
      var date = []
      var data = []
      var historyData = api.get('historyData')
      for (var i in historyData) {
        var proDate = historyData[i].profitDate
        // console.log(proDate)
        // proDate.substring(0, 4) + '/' + proDate.substring(4, 6) + '/' + proDate.substring(6, 8)
        date.push(proDate)
        data.push(historyData[i].unitProfit)
      }
      date.sort(-1)
      data.sort(-1)
      console.log(date)
      console.log(data)
      var option = {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%']
          }
        },
        title: {
          left: 'left',
          text: '净值走势'
        },
        legend: {
          top: 'bottom',
          data: ['意向']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [{
          type: 'inside',
          start: 90,
          end: 100
        }, {
          start: 0,
          end: 10,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }],
        series: [
          {
            name: '单位净值',
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
              normal: {
                color: 'rgb(255, 70, 131)'
              }
            },
            areaStyle: {
              normal: {
                color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgb(255, 158, 68)'
                }, {
                  offset: 1,
                  color: 'rgb(255, 70, 131)'
                }])
              }
            },
            data: data
          }
        ]
      }
      myChart.setOption(option)
    })
  },
  methods: {
  },
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  width: 300px!important;
}
</style>
