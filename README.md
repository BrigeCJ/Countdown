效果如下图一：  

![图一](https://upload-images.jianshu.io/upload_images/11189478-0749f239e48b744c.gif?imageMogr2/auto-orient/strip)
## Canvas环形倒计时组件  
Canvas环形倒计时是基于Canvas实现的倒计时，建议于移动端使用  
[Canvas环形倒计时 下载地址](https://github.com/BrigeCJ/Countdown.git)  

### 一、如何使用  
#### 1. html代码  
ID属性可随意取名
```
<canvas id="canvas"></canvas>
```


#### 2. 引入process.js文件  
页面引用  

```
<script src="js/process.js"></script>
```
#### 3. 初始化参数  
实例化即可
```
<script>
    window.onload = function () {
        let ctd = new Countdown();
        ctd.init();
    };

</script>
```
### 二、settings参数说明  
以下参数非必选项，可根据具体需求配置
```
window.onload = function () {
        let ctd = new Countdown();
        ctd.init({
            id: "canvas",         // ID，canvas一定要有ID属性
            size: 130,            // 绘制圆形的最大尺寸，宽=高
            borderWidth: 4,       // 边框宽度
            borderColor:"#fff",   // 边框颜色
            outerColor:"#fff",    // 最外层底圆颜色
            scheduleColor:"#fff", // 进度条动画颜色
            fontColor: "#fff",    // 字体颜色
            ringColor: "#ffc720", // 进度条环形颜色
            innerColor: "#4e84e5",// 最内圆底色
            fontSize: 50,
            time: 5
        });
    };
```

### 三、示例代码  
html

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        body {
            background: #c2c1ce;
        }
        .container {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 130px;
            height: 130px;
            text-align: center;
        }
    </style>
</head>
<body>
<div class="container">
    <canvas class="canvas" id="canvas"></canvas>
</div>
<script src="js/process.js"></script>
<script>
    window.onload = function () {
        let ctd = new Countdown();
        ctd.init();
    };
</script>
</body>
</html>
```

js

```
/**
 * Created by 谭瞎 on 2018/3/15.
 */

function Countdown() {
    // 设置默认参数
    this.settings = {
        id: "canvas",         // ID，canvas一定要有ID属性
        size: 130,            // 绘制圆形的最大尺寸，宽=高
        borderWidth: 4,       // 边框宽度
        borderColor:"#fff",   // 边框颜色
        outerColor:"#fff",    // 最外层底圆颜色
        scheduleColor:"#fff", // 进度条动画颜色
        fontColor: "#fff",    // 字体颜色
        ringColor: "#ffc720", // 进度条环形颜色
        innerColor: "#4e84e5",// 最内圆底色
        fontSize: 50,
        time: 5
    }
}

Countdown.prototype.init = function (opt) {
    this.obj = document.getElementById(this.settings.id);
    this.obj.width = this.settings.size;
    this.obj.height = this.settings.size;
    this.ctx = this.obj.getContext("2d");
    extend(this.settings, opt);
    this.countdown();
};

// 绘制底色
Countdown.prototype.drawBackground = function () {
    this.drawCircle(0, 360, 0, this.settings.outerColor);
};
// 绘制进度条动画背景
Countdown.prototype.drawProcess = function () {
    this.drawCircle(0, 360, 4, this.settings.ringColor);
};

// 绘制倒计时
Countdown.prototype.drawInner = function () {
    this.drawCircle(0, 360, 23, this.settings.innerColor);
    this.strokeBorder(this.settings.borderWidth);
};

// 绘制进度条动画
Countdown.prototype.drawAnimate = function () {
    // 旋转的角度
    let deg = Math.PI / 180;
    let v = schedule * 360,
        startAng = -90,
        endAng = -90 + v;

    this.ctx.beginPath();
    this.ctx.moveTo(this.settings.size / 2, this.settings.size / 2);
    this.ctx.arc(this.settings.size / 2, this.settings.size / 2, this.settings.size / 2 -3, startAng * deg, endAng * deg, false);
    this.ctx.fillStyle = this.settings.scheduleColor;
    this.ctx.fill();
    this.ctx.closePath();

};
// 绘制边框
Countdown.prototype.strokeBorder = function (borderWidth) {
    this.ctx.lineWidth = borderWidth;
    this.ctx.strokeStyle = this.settings.borderColor;
    this.ctx.stroke();
};
// 绘制文字
Countdown.prototype.strokeText = function (text) {
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = this.settings.fontSize+"px"+ " microsoft yahei";
    this.ctx.fillStyle = this.settings.fontColor;
    this.ctx.fillText(text, this.settings.size / 2, this.settings.size / 2);
};
// 绘制圆
Countdown.prototype.drawCircle = function (startAng, endAng, border, fillColor) {
    let deg = Math.PI / 180;
    this.ctx.beginPath();
    this.ctx.arc(this.settings.size / 2, this.settings.size / 2, this.settings.size / 2 -border, startAng * deg, endAng * deg, false);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
    this.ctx.closePath();
};
// 进度条动画
Countdown.prototype.countdown = function () {
    let oldTime = +new Date();
    timer = setInterval(() => {
        let allMs = this.settings.time * 1000,// 如30*1000=30 000ms
            currentTime = +new Date();
        // 步长=（当前的时间-过去的时间）/总秒数
        schedule = (currentTime - oldTime) / allMs;
        this.schedule = schedule;

        this.drawAll(schedule);
        if (currentTime - oldTime >= allMs) {
            // 重绘
            this.drawBackground();
            this.drawProcess();
            this.drawAnimate();
            this.drawInner();
            this.strokeText(0);
            clearInterval(timer);
        }
    }, 100);
};

// 绘制所有
Countdown.prototype.drawAll = function (schedule) {
    schedule = schedule >= 1 ? 1 : schedule;
    let text = parseInt(this.settings.time * (1 - schedule)) + 1;
    // 清除画布
    this.ctx.clearRect(0, 0, this.settings.size, this.settings.size);
    this.drawBackground();
    this.drawProcess();
    this.drawAnimate();
    this.drawInner();
    this.strokeText(text);
};

// 对象拷贝
function extend(obj1,obj2){
    for(let attr in obj2){
        obj1[attr] = obj2[attr];
    }
}
```


