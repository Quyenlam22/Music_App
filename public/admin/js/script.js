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

//Form Search
const formSearch = document.querySelector("#form-search")
if(formSearch){
    let url = new URL(window.location.href)
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault()
        const keyword = e.target.elements.keyword.value
        if(keyword){
            url.searchParams.set("keyword", keyword)
        }
        else{
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href
    })
}

// Button Status
const buttonStatus = document.querySelectorAll("[button-status]")
if(buttonStatus.length > 0){
    let url = new URL(window.location.href)
    
    buttonStatus.forEach(button => {
        button.addEventListener("click", () =>{
            const status = button.getAttribute("button-status")
            
            if(status){
                url.searchParams.set("status", status)
            }
            else{
                 url.searchParams.delete("status")
            }

            window.location.href = url.href
        })
    })
}

//Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if(buttonsPagination){
    let url = new URL(window.location.href);
    buttonsPagination.forEach(item => {
        item.addEventListener("click", () => {
            const page = item.getAttribute("button-pagination");
            url.searchParams.set("page", page);

            window.location.href = url.href;
        })
    })
}

// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
console.log(checkboxMulti)
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            })
        } else {
            inputsId.forEach(input => {
                input.checked = false;
            })
        }
    })

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = document.querySelectorAll("input[name='id']:checked");
            if (countChecked.length == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        })
    })
}

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputsChecked = document.querySelectorAll("input[name='id']:checked");
        
        const typeChange = e.target.elements.type.value;
        if(typeChange == "delete-all"){
            const isConfirm = confirm("Đồng ý xóa?");
            if(!isConfirm){
                return;
            }
        }

        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;

                // if(typeChange == "change-position"){
                //     const position = input.closest("tr").querySelector("input[name='position']").value;
                //     ids.push(`${id}-${position}`);
                // }
                // else{
                    ids.push(id);
                // }
            })

            inputIds.value = (ids.join(", "));

            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất 1 bản ghi!");
        }
    })
}