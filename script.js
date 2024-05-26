const peerConnections = {};
const config = {
    iceServers: [{
        urls: 'stun:stun.stunprotocol.org'
    }]
};

const socket = io.connect('http://your_server_address:3000'); // استبدل your_server_address بعنوان سيرفرك

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        document.getElementById('video').srcObject = stream;
        socket.emit('broadcaster');
    })
    .catch(error => console.error(error));

socket.on('watcher', id => {
    const peerConnection = new RTCPeerConnection(config);
    peerConnections[id] = peerConnection;

    let stream = document.getElementById('video').srcObject;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit('candidate', id, event.candidate);
        }
    };

    peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
            socket.emit('offer', id, peerConnection.localDescription);
        });
});

socket.on('answer', (id, description) => {
    peerConnections[id].setRemoteDescription(description);
});

socket.on('candidate', (id, candidate) => {
    peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
});

socket.on('disconnectPeer', id => {
    peerConnections[id].close();
    delete peerConnections[id];
});

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

function startBroadcast() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('يرجى إدخال اسم المستخدم');
        return;
    }
    alert(`${username}، أنت الآن تقوم ببث مباشر!`);
    // إرسال اسم المستخدم للسيرفر
    socket.emit('broadcaster', { name: username });
}

function joinSelectedBroadcast() {
    const broadcastList = document.getElementById('broadcastList');
    const selectedBroadcastId = broadcastList.value;
    if (!selectedBroadcastId) {
        alert('يرجى اختيار بث مباشر للانضمام');
        return;
    }
    // الانضمام إلى البث المحدد باستخدام ID الخاص به
    alert(`أنت الآن تشاهد البث المباشر مع ID: ${selectedBroadcastId}`);
    // إضافة كود لاستقبال الفيديو من السيرفر وعرضه
}
