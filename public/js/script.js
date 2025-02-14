//Aplayer
const aplayer = document.querySelector('#aplayer');
if (aplayer) {
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

// Button Like
const buttonLike = document.querySelector('[button-like');
if (buttonLike) {
    buttonLike.addEventListener("click", () => {
        const idSong = buttonLike.getAttribute("button-like");

        const isAcitve = buttonLike.classList.contains("active");

        let typeLike = isAcitve ? "dislike" : "like";

        const link = `/songs/like/${typeLike}/${idSong}`;

        const option = {
            method: "PATCH"
        };

        fetch(link, option)
            .then(res => res.json())
            .then(data => {
                if (data.code == 200) {
                    const span = buttonLike.querySelector("span");
                    span.innerHTML = `${data.like} thích`;
                    buttonLike.classList.toggle("active");
                }
            })
    })
}

// Button Favorite
const buttonFavorite = document.querySelector('[button-favorite');
if (buttonFavorite) {
    buttonFavorite.addEventListener("click", () => {
        const idSong = buttonFavorite.getAttribute("button-favorite");

        const isAcitve = buttonFavorite.classList.contains("active");

        let typeFavorite = isAcitve ? "unfavorite" : "favorite";

        const link = `/songs/favorite/${typeFavorite}/${idSong}`;

        const option = {
            method: "PATCH"
        };

        fetch(link, option)
            .then(res => res.json())
            .then(data => {
                if (data.code == 200) {
                    buttonFavorite.classList.toggle("active");
                }
            })
    })
}