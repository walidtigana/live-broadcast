<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بث مباشر</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            direction: rtl;
            text-align: center;
            margin-top: 50px;
        }
        input, button, select {
            margin: 10px;
            padding: 10px;
            font-size: 16px;
        }
        #video-container {
            margin-top: 20px;
        }
        video {
            width: 80%;
            height: auto;
        }
    </style>
</head>
<body>
    <h1>مرحباً بكم في منصة البث المباشر</h1>
    <div>
        <input type="text" id="username" placeholder="أدخل اسم المستخدم">
        <br>
        <button onclick="startBroadcast()">بدء البث المباشر</button>
        <select id="broadcastList">
            <option value="" disabled selected>اختر بث مباشر للانضمام</option>
        </select>
        <button onclick="joinSelectedBroadcast()">الانضمام إلى البث المختار</button>
    </div>
    <div id="video-container">
        <video id="video" controls autoplay></video>
    </div>
    <script src="https://cdn.socket.io/4.0.0/socket.io.min.js"></script>
    <script>
        const peerConnections = {};
        const config = {
            iceServers: [{
                urls: 'stun:stun.stunprotocol.org'
            }]
        };

        const socket = io.connect('http://localhost:3000');

        function startBroadcast() {
            const username = document.getElementById('username').value;
            if (!username) {
                alert('يرجى إدخال اسم المستخدم');
                return;
            }
            alert(`${username}، أنت الآن تقوم ببث مباشر!`);
            // إرسال اسم المستخدم للسيرفر
            socket.emit('broadcaster', { name: username });

            // طلب إذن الوصول إلى كاميرا الويب
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    document.getElementById('video').srcObject = stream;
                    // إضافة كود لإرسال الفيديو إلى السيرفر
                })
                .catch(err => {
                    console.error('خطأ في الوصول إلى كاميرا الويب: ', err);
                });
        }

        function joinSelectedBroadcast() {
            const broadcastList = document.getElementById('broadcastList');
            const selectedBroadcastId = broadcastList.value;
            if (!selectedBroadcastId) {
                alert('يرجى اختيار بث مباشر للانضمام');
                return;
            }
            alert(`أنت الآن تشاهد البث المباشر مع ID: ${selectedBroadcastId}`);
            // إضافة كود لاستقبال الفيديو من السيرفر وعرضه
        }

        socket.on('broadcasterList', broadcasters => {
            const broadcastList = document.getElementById('broadcastList');
            broadcastList.innerHTML = '<option value="" disabled selected>اختر بث مباشر للانضمام</option>';
            broadcasters.forEach(broadcaster => {
                const option = document.createElement('option');
                option.value = broadcaster.id;
                option.textContent = broadcaster.name;
                broadcastList.appendChild(option);
            });
        });

        socket.emit('watcher');
    </script>
</body>
</html>
