/**
 * Created by 谭瞎 on 2018/3/15.
 */

function Countdown() {
    // 设置默认参数
    this.settings = {
        id: "canvas",
        size: 130,
        borderWidth: 4,
        color_1: "#fff",
        color_2: "#ffc720",
        color_3: "#4e84e5",
        fontSize: 50,
        time: 5
    }
}

Countdown.prototype.init = function (opt) {
    this.obj = document.getElementById(opt.id);
    this.obj.width = this.settings.size;
    this.obj.height = this.settings.size;
    this.ctx = this.obj.getContext("2d");
    extend(this.settings, opt);
    this.countdown();
};

// 绘制底色
Countdown.prototype.drawBackground = function () {
    this.drawCircle(0, 360, 0, this.settings.color_1);
};
// 绘制进度条动画背景
Countdown.prototype.drawProcess = function () {
    this.drawCircle(0, 360, 4, this.settings.color_2);
};

// 绘制倒计时
Countdown.prototype.drawInner = function () {
    this.drawCircle(0, 360, 23, this.settings.color_3);
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
    this.ctx.fillStyle = this.settings.color_1;
    this.ctx.fill();
    this.ctx.closePath();

};
// 绘制边框
Countdown.prototype.strokeBorder = function (borderWidth) {
    this.ctx.lineWidth = borderWidth;
    this.ctx.strokeStyle = this.settings.color_1;
    this.ctx.stroke();
};
// 绘制文字
Countdown.prototype.strokeText = function (text) {
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = this.settings.fontSize+"px"+ " microsoft yahei";
    this.ctx.fillStyle = this.settings.color_1;
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


