function startBroadcast() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('يرجى إدخال اسم المستخدم');
        return;
    }
    alert(`${username}، أنت الآن تقوم ببث مباشر!`);

    // هنا يجب استخدام WebRTC أو تقنية بث أخرى لتمكين البث المباشر
    const video = document.getElementById('video');
    // طلب إذن الوصول إلى كاميرا الويب
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            video.srcObject = stream;
            // إضافة كود لإرسال الفيديو إلى السيرفر
        })
        .catch(err => {
            console.error('خطأ في الوصول إلى كاميرا الويب: ', err);
        });
}

function joinBroadcast() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert('يرجى إدخال اسم المستخدم');
        return;
    }
    alert(`${username}، أنت الآن تشاهد البث المباشر!`);

    // هنا يجب استخدام WebRTC أو تقنية بث أخرى لتمكين الانضمام إلى البث المباشر
    const video = document.getElementById('video');
    // إضافة كود لاستقبال الفيديو من السيرفر وعرضه
}
