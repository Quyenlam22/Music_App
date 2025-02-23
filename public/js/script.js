//Aplayer
const aplayer = document.querySelector('#aplayer');
if (aplayer) {
    const dataSong = JSON.parse(aplayer.getAttribute("data-song"));
    // dataSong = JSON.parse(dataSong)
    const dataSinger = JSON.parse(aplayer.getAttribute("data-singer"));
    // dataSinger = JSON.parse(dataSinger)
    const ap = new APlayer({
        container: aplayer,
        lrcType: 1,
        audio: [{
            name: dataSong.title,
            artist: dataSinger.fullName,
            url: dataSong.audio,
            cover: dataSong.avatar,
            lrc: dataSong.lyrics
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

    ap.on('ended', function () {
        const link = `/songs/listen/${dataSong._id}`;

        const option = {
            method: "PATCH"
        };

        fetch(link, option)
            .then(res => res.json())
            .then(data => {
                if (data.code == 200) {
                    const listenSpan = document.querySelector(".singer-detail .inner-listen span");
                    listenSpan.innerHTML = `${data.listen} lượt nghe`;
                }
            })
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
const buttonFavorites = document.querySelectorAll('[button-favorite');
if (buttonFavorites.length > 0) {
    buttonFavorites.forEach((buttonFavorite) => {
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
    })
}

// Search Suggest
const boxSearch = document.querySelector(".box-search");
if (boxSearch) {
    const input = boxSearch.querySelector("input[name='keyword']");
    const boxSuggest = boxSearch.querySelector(".inner-suggest");

    input.addEventListener("keyup", () => {
        const keyword = input.value;

        const link = `/search/suggest/?keyword=${keyword}`;

        fetch(link)
            .then(res => res.json())
            .then(data => {
                if (data.code == 200) {
                    const songs = data.songs;
                    if (songs.length > 0) {
                        boxSuggest.classList.add("show");
                        const htmls = songs.map(song => {
                            return `
                                <a class="inner-item" href="/songs/detail/${song.slug}">
                                    <div class="inner-image">
                                        <img src="${song.avatar}">
                                    </div>
                                    <div class="inner-info">
                                        <div class="inner-title">${song.title}</div>
                                        <div class="inner-singer">
                                        <i class="fa-solid fa-microphone-lines"></i> ${song.infoSinger.fullName}
                                        </div>
                                    </div>
                                </a>
                            `;
                        })

                        const boxList = boxSearch.querySelector(".inner-list")
                        boxList.innerHTML = htmls.join("");
                    } else {
                        boxSuggest.classList.remove("show");
                    }
                }
            })
    })
}