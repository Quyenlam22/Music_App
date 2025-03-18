//Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    })
}

//Upload Audio
const uploadAudio = document.querySelector("[upload-audio]");
if (uploadAudio) {
    const uploadAudioInput = uploadAudio.querySelector("[upload-audio-input]");
    const uploadAudioPlay = uploadAudio.querySelector("[upload-audio-play]");
    const source = uploadAudio.querySelector("source");
    uploadAudioInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            source.src = URL.createObjectURL(file);
            uploadAudioPlay.load();
        }
    })
}

//Delete button
const deleteButtons = document.querySelectorAll("[button-deleted]");

// if(deleteButtons) {
//     deleteButtons.forEach(deleteButton => {
//         const idSong = deleteButton.getAttribute("data-id");
//         deleteButton.addEventListener("click", () => {

//             const link = `${prefixAdmin}/songs/deleted/${idSong}`;
//             const option = {
//                 method: "PATCH"
//             };

//             fetch(link, option)
//                 .then(res => res.json())
//                 .then(data => {
//                     console.log("ok")
//                     if(data.code == 200) {
//                         console.log(data.message);
//                     }
//                 });
//         });
//     })
// }

//Delete Item
if (deleteButtons.length > 0) {
    const formDeleted = document.querySelector("#form-deleted")
    const path = formDeleted.getAttribute("data-path")

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc chắn xóa mục này?")

            if (isConfirm) {
                const id = button.getAttribute("data-id")
                const action = `${path}/${id}?_method=PATCH`
                formDeleted.action = action

                formDeleted.submit()
            }
        })
    })
}