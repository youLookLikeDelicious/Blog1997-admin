# blog1997-admin

Blog1997 Admin Part

### 项目管理员界面演示

这是由 cypress 测试工具，录制的 E2E 测试过程。作为演示素材
[![Watch the video](https://raw.github.com/GabLeRoux/WebMole/master/ressources/WebMole_Youtube_Video.png)](http://go.plvideo.cn/front/video/preview?vid=43876a053a5729ff357674c4390011c9_4)

### 开发

npm run dev

### 构建

npm run build

### e2e

npm run test:e2e

## 打包镜像

docker build -t chaosxy/blog1997-nginx:1.0.2 -f .\docker\DockerFile
