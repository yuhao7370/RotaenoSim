// 获取canvas元素和其上下文
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// 画一条水平线
ctx.beginPath();
ctx.moveTo(50, canvas.height / 2);
ctx.lineTo(canvas.width - 50, canvas.height / 2);
ctx.stroke();

// 监听设备方向的变化
window.addEventListener('deviceorientation', function(event) {
    // 获取新的方向角度
    var alpha = event.alpha;

    // 清除canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 保存当前的绘图状态
    ctx.save();

    // 将坐标系移动到canvas的中心
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // 旋转坐标系
    ctx.rotate(-alpha * Math.PI / 180);

    // 将坐标系移回原位
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // 画一条水平线
    ctx.beginPath();
    ctx.moveTo(50, canvas.height / 2);
    ctx.lineTo(canvas.width - 50, canvas.height / 2);
    ctx.stroke();

    // 恢复之前保存的绘图状态
    ctx.restore();
});