<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-21 16:07:15
 * @LastEditTime: 2019-08-14 14:08:43
 * @LastEditors: Please set LastEditors
 -->
<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    ficon: {
      type: String,
      default: ''
    },
    aicon: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title, ficon, aicon } = context.props
    const vnodes = []
    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (ficon) {
      vnodes.push(<i class={ficon}></i>)
    }

    if (aicon) {
      vnodes.push(<i class={'icon iconfont' + ' ' + aicon} ></i>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
