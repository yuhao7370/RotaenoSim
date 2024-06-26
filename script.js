 // 获取canvas元素和其上下文
 var canvas = document.getElementById('myCanvas');
 var ctx = canvas.getContext('2d');

 // 获取显示alpha、beta、gamma和angle的元素
 var alphaElement = document.getElementById('alpha');
 var betaElement = document.getElementById('beta');
 var gammaElement = document.getElementById('gamma');
 var vectorElement = document.getElementById('vector');
 var angleElement = document.getElementById('angle');

 // 获取开始按钮
 var startButton = document.getElementById('startButton');

 // 画一条水平线
 ctx.beginPath();
 ctx.moveTo(100, canvas.height / 2);
 ctx.lineTo(canvas.width - 100, canvas.height / 2);
 ctx.stroke();

 function calculateRotationMatrix(alpha, beta, gamma) {
     // 将角度转换为弧度
     alpha = alpha * Math.PI / 180;
     beta = beta * Math.PI / 180;
     gamma = gamma * Math.PI / 180;

     // 计算旋转矩阵
     var rotationMatrix = [
         [Math.cos(alpha) * Math.cos(beta), Math.cos(alpha) * Math.sin(beta) * Math.sin(gamma) - Math.sin(alpha) * Math.cos(gamma), Math.cos(alpha) * Math.sin(beta) * Math.cos(gamma) + Math.sin(alpha) * Math.sin(gamma)],
         [Math.sin(alpha) * Math.cos(beta), Math.sin(alpha) * Math.sin(beta) * Math.sin(gamma) + Math.cos(alpha) * Math.cos(gamma), Math.sin(alpha) * Math.sin(beta) * Math.cos(gamma) - Math.cos(alpha) * Math.sin(gamma)],
         [-Math.sin(beta), Math.cos(beta) * Math.sin(gamma), Math.cos(beta) * Math.cos(gamma)]
     ];

     return rotationMatrix;
 }

 function calculateUnitNormalVector(alpha, beta, gamma) {
     var rotationMatrix = calculateRotationMatrix(alpha, beta, gamma);

     // 原始单位法向量
     var originalUnitNormalVector = [0, 0, 1];

     // 计算旋转后的单位法向量
     var rotatedUnitNormalVector = [
         rotationMatrix[0][0] * originalUnitNormalVector[0] + rotationMatrix[0][1] * originalUnitNormalVector[1] + rotationMatrix[0][2] * originalUnitNormalVector[2],
         rotationMatrix[1][0] * originalUnitNormalVector[0] + rotationMatrix[1][1] * originalUnitNormalVector[1] + rotationMatrix[1][2] * originalUnitNormalVector[2],
         rotationMatrix[2][0] * originalUnitNormalVector[0] + rotationMatrix[2][1] * originalUnitNormalVector[1] + rotationMatrix[2][2] * originalUnitNormalVector[2]
     ];

     console.log('Rotated Unit Normal Vector:', rotatedUnitNormalVector);
     return rotatedUnitNormalVector;
 }

 function calculateScreenSplitLineVector(alpha, beta, gamma) {
     var rotationMatrix = calculateRotationMatrix(alpha, beta, gamma);

     // 分割线的向量在设备坐标系中的表示
     var screenSplitLineVectorDevice = [0, 1, 0];

     // 计算分割线的向量在世界坐标系中的表示
     var screenSplitLineVectorWorld = [
         rotationMatrix[0][0] * screenSplitLineVectorDevice[0] + rotationMatrix[0][1] * screenSplitLineVectorDevice[1] + rotationMatrix[0][2] * screenSplitLineVectorDevice[2],
         rotationMatrix[1][0] * screenSplitLineVectorDevice[0] + rotationMatrix[1][1] * screenSplitLineVectorDevice[1] + rotationMatrix[1][2] * screenSplitLineVectorDevice[2],
         rotationMatrix[2][0] * screenSplitLineVectorDevice[0] + rotationMatrix[2][1] * screenSplitLineVectorDevice[1] + rotationMatrix[2][2] * screenSplitLineVectorDevice[2]
     ];

     return screenSplitLineVectorWorld;
 }

 function calc_vector_angle(vector1, vector2) {
     var dotProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1] + vector1[2] * vector2[2];
     var magnitude1 = Math.sqrt(vector1[0] * vector1[0] + vector1[1] * vector1[1] + vector1[2] * vector1[2]);
     var magnitude2 = Math.sqrt(vector2[0] * vector2[0] + vector2[1] * vector2[1] + vector2[2] * vector2[2]);
     var angle = Math.acos(dotProduct / (magnitude1 * magnitude2));
     console.log('Angle:', angle);
     return angle; // 计算两个向量之间的夹角
 }

 function startDeviceOrientation() {
     if (window.DeviceOrientationEvent) {
         // 如果是ios则请求权限
         DeviceOrientationEvent.requestPermission()
         .then(response => {
             if (response == 'granted') {
                 console.log('Permission granted');

                 // 权限被授予，添加deviceorientation事件监听器
                 window.addEventListener('deviceorientation', handleDeviceOrientation);
             } else {
                 // 权限被拒绝，显示一个提示给用户
                 console.log('Permission denied');
             }
         })
         .catch(error => {
             // 处理可能出现的错误
             console.error('Error occurred while requesting permission', error);
         });
     } else {
         console.log('Device does not support DeviceOrientationEvent');
     }
 }

 function handleDeviceOrientation(event) {
     // 获取新的方向角度
     var alpha = event.alpha ? event.alpha : 0;
     var beta = event.beta ? event.beta : 0;
     var gamma = event.gamma ? event.gamma : 0;

     // 更新alpha、beta、gamma和angle的显示值，并保留两位小数
     alphaElement.textContent = 'Alpha: ' + alpha.toFixed(2);
     betaElement.textContent = 'Beta: ' + beta.toFixed(2);
     gammaElement.textContent = 'Gamma: ' + gamma.toFixed(2);

     var vector = calculateUnitNormalVector(alpha, beta, gamma); // 手机屏幕平面的法向量
     var coordinate = [-vector[0], -vector[1], -vector[2]]; // 手机屏幕平中心在单位坐标系中的坐标
     var z = [0, 0, 1];
     var anglez = calc_vector_angle(vector, z); // 计算手机屏幕平面与z轴的夹角 rad
     var anglezdeg = anglez * 180 / Math.PI; // rad to degree
     var zvector = [0, 0, 1 / Math.cos(anglez)]; // z轴在手机屏幕平面中的投影

     console.log('Z Vector:', zvector);

     var basevector = [zvector[0] - vector[0], zvector[1] - vector[1], zvector[2] - vector[2]]; // 游戏基准向量
     console.log('Base Vector:', basevector);
     var splitvector = calculateScreenSplitLineVector(alpha, beta, gamma); // 分割线的向量
     console.log('Split Vector:', splitvector);
     var gameangle = calc_vector_angle(basevector, splitvector); // 游戏基准向量与分割线的夹角
     var gameangledeg = gameangle * 180 / Math.PI; // rad to degree
     
     if ((180 - alpha) * beta * gamma > 0) {
         gameangledeg = (360 - gameangledeg);
     }

     vectorElement.textContent = 'Vector: [' + vector[0].toFixed(2) + ', ' + vector[1].toFixed(2) + ', ' + vector[2].toFixed(2) + ']';
     angleElement.textContent = 'Angle: ' + gameangledeg.toFixed(2) + '°';

     // 清除canvas
     ctx.clearRect(0, 0, canvas.width, canvas.height);

     // 保存当前的绘图状态
     ctx.save();

     // 将坐标系移动到canvas的中心
     ctx.translate(canvas.width / 2, canvas.height / 2);

     // 旋转坐标系
     gameangle = gameangledeg * Math.PI / 180; // degree to rad
     ctx.rotate(gameangle); // 旋转坐标系，使得手机屏幕平面与分割线平行

     // 将坐标系移回原位
     ctx.translate(-canvas.width / 2, -canvas.height / 2);

     // 画一条水平线
     ctx.beginPath();
     ctx.moveTo(100, canvas.height / 2);
     ctx.lineTo(canvas.width - 100, canvas.height / 2);
     ctx.stroke();

     // 恢复之前保存的绘图状态
     ctx.restore();
 }

 // 当用户点击开始按钮时，开始监听设备方向的变化
 startButton.addEventListener('click', startDeviceOrientation);