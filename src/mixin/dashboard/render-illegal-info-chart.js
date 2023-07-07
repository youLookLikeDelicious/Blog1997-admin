import {
  Chart
} from '@antv/g2'

const IllegalType = {
  article: '举报文章',
  comment: '举报评论'
}
export default {
  methods: {
    renderIllegalInfoChart (data) {
      if (!data.length) {
        this.setMessage('illegal-chart', 'Safe and sound~')
        return
      }

      data = this.convertIllegalData(data)

      const chart = new Chart({
        container: 'illegal-chart',
        autoFit: true,
        width: '100%',
        height: 230
      })

      chart.coordinate('theta')

      // 载入数据源
      chart.data(data)

      chart.scale('count', {
        formatter: (val) => {
          return val
        }
      })

      chart.legend('type')
      chart
        .interval()
        .position('count')
        .color('type')
        .label('count', {
          content: (data) => `${data.type}:  ${data.count}`
        })
        .adjust('stack')

      chart.render()
    },
    convertIllegalData (data) {
      return data.map((item) => ({
        count: item.count,
        type: IllegalType[item.type]
      }))
    }
  }
}
