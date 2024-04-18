// 获取canvas元素和其上下文
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// 获取显示beta、gamma和angle的元素
var betaElement = document.getElementById('beta');
var gammaElement = document.getElementById('gamma');
var angleElement = document.getElementById('angle');

// 获取开始按钮
var startButton = document.getElementById('startButton');

// 画一条水平线
ctx.beginPath();
ctx.moveTo(100, canvas.height / 2);
ctx.lineTo(canvas.width - 100, canvas.height / 2);
ctx.stroke();

// 当用户点击开始按钮时，开始监听设备方向的变化
startButton.addEventListener('click', function() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
            // 获取新的方向角度
            var alpha = event.alpha;
            var beta = event.beta;
            var gamma = event.gamma;

            // 将角度转换为弧度
            var betaRad = beta * Math.PI / 180;
            var gammaRad = gamma * Math.PI / 180;

            // 计算新的x轴与原x轴的夹角
            var angle = Math.atan2(betaRad, gammaRad);

            // 更新beta、gamma和angle的显示值，并保留两位小数
            alphaElement.textContent = 'Alpha: ' + alpha.toFixed(2);
            betaElement.textContent = 'Beta: ' + beta.toFixed(2);
            gammaElement.textContent = 'Gamma: ' + gamma.toFixed(2);
            angleElement.textContent = 'Angle: ' + (angle * 180 / Math.PI).toFixed(2);  // 将弧度转换为角度

            // 清除canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 保存当前的绘图状态
            ctx.save();

            // 将坐标系移动到canvas的中心
            ctx.translate(canvas.width / 2, canvas.height / 2);

            // 旋转坐标系
            ctx.rotate(-angle);

            // 将坐标系移回原位
            ctx.translate(-canvas.width / 2, -canvas.height / 2);

            // 画一条水平线
            ctx.beginPath();
            ctx.moveTo(100, canvas.height / 2);
            ctx.lineTo(canvas.width - 100, canvas.height / 2);
            ctx.stroke();

            // 恢复之前保存的绘图状态
            ctx.restore();
        });
    } else {
        alphaElement.textContent = 'Alpha: Not supported';
        betaElement.textContent = 'Beta: Not supported';
        gammaElement.textContent = 'Gamma: Not supported';
        angleElement.textContent = 'Angle: Not supported';
    }
});