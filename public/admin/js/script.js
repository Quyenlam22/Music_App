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
//         const id = deleteButton.getAttribute("data-id");
//         deleteButton.addEventListener("click", () => {

//             const link = `/admin/songs/deleted/${id}`;
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

//Show alert
const showAlert = document.querySelector("[show-alert]")
const showMessage = () => {
    if (showAlert) {
        const time = parseInt(showAlert.getAttribute("data-time"))
        const closeAlert = showAlert.querySelector("[close-alert]")
        closeAlert.addEventListener("click", () => {
            showAlert.classList.add("alert-hidden");
        })

        setTimeout(() => {
            showAlert.classList.add("alert-hidden");
        }, time)
    }
}


showMessage();

// Change status
// const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");

// if(buttonsChangeStatus) {
//     buttonsChangeStatus.forEach(button => {
//         const id = button.getAttribute("data-id");
//         const status = button.getAttribute("data-status") == "active" ? "inactive" : "active";
//         button.addEventListener("click", () => {

//             const link = `/admin/change-status/${id}/${status}`;
//             const option = {
//                 method: "PATCH"
//             };

//             fetch(link, option)
//                 .then(res => res.json())
//                 .then(data => {
//                     if(data.code == 200) {
//                         console.log(data.status)
//                         if(data.status == "active"){
//                             button.innerHTML = "Hoạt động";
//                             button.classList.add("badge-success");
//                             button.classList.remove("badge-danger");
//                         }
//                         else{
//                             button.innerHTML = "Dừng hoạt động";
//                             button.classList.add("badge-danger");
//                             button.classList.remove("badge-success");
//                         }
//                     }
//                 });
//         });
//     })
// }

// Change status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");

if (buttonsChangeStatus) {
    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const type = button.getAttribute("button-change-status");
            const id = button.getAttribute("data-id");
            const currentStatus = button.getAttribute("data-status");
            console.log(type)
            const status = currentStatus === "active" ? "inactive" : "active";
            const link = `/admin/change-status/${type}/${id}/${status}`;
            const option = {
                method: "PATCH"
            };

            // Cập nhật giao diện ngay lập tức
            button.innerHTML = status === "active" ? "Hoạt động" : "Dừng hoạt động";
            button.classList.toggle("badge-success", status === "active");
            button.classList.toggle("badge-danger", status === "inactive");
            button.setAttribute("data-status", status);

            fetch(link, option)
                .then(res => res.json())
                .then(data => {
                    if (data.code !== 200) {
                        // Nếu có lỗi, khôi phục lại trạng thái ban đầu
                        button.innerHTML = currentStatus === "active" ? "Hoạt động" : "Dừng hoạt động";
                        button.classList.toggle("badge-success", currentStatus === "active");
                        button.classList.toggle("badge-danger", currentStatus === "inactive");
                        button.setAttribute("data-status", currentStatus); // Khôi phục trạng thái
                        alert("Đã xảy ra lỗi, vui lòng thử lại."); // Thông báo lỗi
                    }
                    if (data.code == 200) {
                        showAlert.classList.remove("alert-hidden");
                        showAlert.classList.remove("d-none");
                        showMessage();
                    }
                })
        });
    });
}