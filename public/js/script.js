//Aplayer
const aplayer = document.querySelector('#aplayer');
if(aplayer){
    const dataSong = JSON.parse(aplayer.getAttribute("data-song"));
    // dataSong = JSON.parse(dataSong)
    const dataSinger = JSON.parse(aplayer.getAttribute("data-singer"));
    // dataSinger = JSON.parse(dataSinger)
    const ap = new APlayer({
        container: aplayer,
        audio: [{
            name: dataSong.title,
            artist: dataSinger.fullName,
            url: dataSong.audio,
            cover: dataSong.avatar
        }],
        autoplay: true
    });

    const avatar = document.querySelector(".singer-detail .inner-avatar");
    
    ap.on('pause', function () {
        avatar.style.animationPlayState = "paused";
    });

    ap.on('play', function () {
        avatar.style.animationPlayState = "running";
    });
}
