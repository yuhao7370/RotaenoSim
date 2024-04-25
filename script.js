// 获取canvas元素和其上下文
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// 获取显示alpha、beta、gamma和angle的元素
var alphaElement = document.getElementById('alpha');
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
// 获取canvas元素和其上下文
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// 获取显示alpha、beta、gamma和angle的元素
var alphaElement = document.getElementById('alpha');
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
// 当用户点击开始按钮时，开始监听设备方向的变化
startButton.addEventListener('click', function() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
            // 获取新的方向角度
            var alpha = event.alpha;
            var beta = event.beta;
            var gamma = event.gamma;

            // 将角度转换为弧度
            alpha = alpha * Math.PI / 180;
            beta = beta * Math.PI / 180;
            gamma = gamma * Math.PI / 180;

            // 计算单位法向量
            var vector = {
                x: Math.cos(alpha) * Math.cos(beta),
                y: Math.sin(alpha) * Math.cos(beta),
                z: Math.sin(beta)
            };

            // 更新alpha、beta、gamma和vector的显示值，并保留两位小数
            alphaElement.textContent = 'Alpha: ' + (alpha * 180 / Math.PI).toFixed(2);  // 将弧度转换为角度
            betaElement.textContent = 'Beta: ' + (beta * 180 / Math.PI).toFixed(2);  // 将弧度转换为角度
            gammaElement.textContent = 'Gamma: ' + (gamma * 180 / Math.PI).toFixed(2);  // 将弧度转换为角度
            vectorElement.textContent = 'Vector: (' + vector.x.toFixed(2) + ', ' + vector.y.toFixed(2) + ', ' + vector.z.toFixed(2) + ')';
        });
    } else {
        alphaElement.textContent = 'Alpha: Not supported';
        betaElement.textContent = 'Beta: Not supported';
        gammaElement.textContent = 'Gamma: Not supported';
        vectorElement.textContent = 'Vector: Not supported';
    }
});