/* eslint-disable no-new */
<template>
  <div id="container" class="map" tabindex="0"></div>
</template>

<script>
import Vue from 'vue'
import { getGalleryAll } from '~/api/upload'
import BigImage from '~/components/gallery/big-image.vue'

const BigImageConstruct = Vue.extend(BigImage)
const ImageConstructor = Vue.extend({
  props: ['src', 'onPreview', 'index'],
  data () {
    return {
      loaded: false
    }
  },
  render (h) {
    const self = this
    return h('div', {
      class: {
        'album-location-img-wrapper': true
      }
    }, [
      h('img', {
        domProps: {
          src: self.src
        },
        style: {
          display: self.loaded ? 'block' : 'none'
        },
        on: {
          load () {
            self.loaded = true
          },
          click () {
            self.onPreview(self.index)
          }
        }
      }),
      h('span', {
        class: 'icofont-image',
        style: {
          display: self.loaded ? 'none' : 'block'
        }
      }, [h('i', '加载中...')])
    ])
  }
})

export default {
  name: 'place',
  data () {
    return {
      bigImageComponent: '',
      markers: [],
      imageList: []
    }
  },
  methods: {
    initMap () {
      getGalleryAll().then(res => res.data.data)
        .then(data => {
          this.imageList = data
          const markers = []
          for (var i = 0; i < data.length; i += 1) {
            const image = new ImageConstructor({
              propsData: {
                src: data[i].url,
                index: i,
                onPreview: this.showPreImage
              },
              el: document.createElement('div')
            })

            // eslint-disable-next-line no-undef
            markers.push(new AMap.Marker({
              position: data[i].lng_lat.split(','),
              icon: '//vdata.amap.com/icons/b18/1/2.png',
              content: image.$el,
              // eslint-disable-next-line no-undef
              offset: new AMap.Pixel(-15, -15)
            }))
          }
          return markers
        })
        .then(markers => {
          // eslint-disable-next-line no-undef
          const map = new AMap.Map('container', {
            resizeEnable: true,
            center: [105, 34],
            zoom: 4
          })
          // eslint-disable-next-line no-undef
          new AMap.MarkerClusterer(map, markers, { // eslint-disable-line no-new
            gridSize: 80
          })
        })
    },
    showPreImage (index) {
      if (!this.bigImageComponent) {
        this.bigImageComponent = new BigImageConstruct({
          propsData: {
            imageList: this.imageList
          },
          el: document.createElement('div')
        })
        document.body.appendChild(this.bigImageComponent.$el)
      }
      this.bigImageComponent.currentIndex = index
      this.bigImageComponent.handleVisible()
    }
  },
  mounted () {
    this.initMap()
  },
  destroyed () {
    if (this.bigImageComponent) {
      this.bigImageComponent.$destroy()
    }
  }
}
</script>

<style lang="scss">
.album-location-img-wrapper{
  position: relative;
  $size: 4.5rem;
  width: $size;
  height: $size;
  border-radius: $size;
  img{
    $size: 4.5rem;
    width: $size;
    height: $size;
    object-fit: cover;
    border-radius: $size;
    box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;
  }
  span {
    top: 50%;
    left: 50%;
    font-size: 3rem;
    color: #909399;
    position: absolute;
    transform: translate(-50%, -50%);
  }
  i {
    font-size: 1.4rem;
    font-style: normal;
  }
}
</style>
