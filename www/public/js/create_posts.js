import loadJson from "./modules/loadJson.js";

export default async () => {

    try {

        let storage = window.localStorage;
        let token = storage.getItem('token');
        let config = await loadJson(`/public/json/config.json`);
        let alert = document.getElementById("alert");
        let alert_content = document.getElementById("alert_content");
        let input_file = document.getElementById("input_file");
        let post_title = document.getElementById("post_title");
        let textarea_post = document.getElementById("textarea_post");
        let button_create = document.getElementById("button_create");
        let categories_select = document.getElementById("categories_select");
        let categories = await loadJson(`${config?.backend_url}/categories`);

        for (let item of categories) {
            let option = document.createElement("option");
            categories_select.appendChild(option);
            option.value = item?.id;
            option.innerText = item?.name;
        }

        // Event listener for when the file is selected
        input_file.addEventListener("change", async e => {

            if (token) {

                let checkLogin = await loadJson(`${config?.backend_url}/session/${encodeURIComponent(token)}`);

                if (checkLogin?.username) {

                    // Get the selected file
                    let file = e.target.files[0];
                    let filename = file.name;
                    let arrBuffer = await arrayBuffer(file);
                    let uint8Array = new Uint8Array(arrBuffer);
                    let jsonArray = [...uint8Array];
                    let response = await fetch(`${config?.backend_url}/upload`, {
                        method: 'POST',
                        body: JSON.stringify({
                            token: token,
                            uint8Array: jsonArray,
                            filename: filename
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    });
                    let upload = await response?.json()
                    let body = textarea_post.value;

                    if (upload?.errors) {
                        showAlert(alert, alert_content, upload?.errors?.join("\n"));
                    }

                    else {
                        let url = isImageFile(filename) ? `![${filename}](${upload?.url})` : upload?.url;
                        textarea_post.value = `${body}\n${url}\n`;
                    }
                }

                else {
                    storage.removeItem('token');
                    showAlert(alert, alert_content, "قم بتسجيل الدخول اولاً");
                }
            }

            else {
                showAlert(alert, alert_content, "قم بتسجيل الدخول اولاً");
            }

        });

        button_create.addEventListener("click", async e => {

            if (token) {

                let checkLogin = await loadJson(`${config?.backend_url}/session/${encodeURIComponent(token)}`);

                if (checkLogin?.username) {

                    if (textarea_post?.value?.length !== 0 && post_title?.value?.length !== 0) {

                        let response = await fetch(`${config?.backend_url}/CreatePosts`, {
                            method: 'POST',
                            body: JSON.stringify({
                                title: post_title?.value,
                                raw: textarea_post?.value,
                                token: token,
                                category: Number(categories_select?.value)
                            }),
                            headers: { 'Content-Type': 'application/json' }
                        });
                        let CreatePosts = await response?.json()


                        if (CreatePosts?.errors) {
                            showAlert(alert, alert_content, CreatePosts?.errors?.join("\n"));
                        }

                        else {
                            showAlert(alert, alert_content, "نُشِر الموضوع");
                            window.location.href = "/index.html";
                        }

                    }

                    else {
                        let text = textarea_post?.value?.length === 0 && post_title?.value?.length === 0 ? "لم تقم بإضافة عنوان أو محتوى لهذا الموضوع بعد" : textarea_post?.value?.length === 0 ? "لم تقم بإضافة أي محتوى بعد !" : "لم تقم بكتابة عنوان لهذا الموضوع !"
                        showAlert(alert, alert_content, text);
                    }
                }

                else {
                    storage.removeItem('token');
                    showAlert(alert, alert_content, "قم بتسجيل الدخول اولاً");
                }
            }

            else {
                showAlert(alert, alert_content, "قم بتسجيل الدخول اولاً");
            }
        });

        async function arrayBuffer(file) {
            return new Promise((resolve, reject) => {
                let fileReader = new FileReader();
                // When FileReader has finished loading the file
                fileReader.onload = async (e) => {
                    // return the array buffer
                    resolve(e.target.result);
                };
                // Read the file as an array buffer
                fileReader.readAsArrayBuffer(file);
            });
        }

        /**
         * نافذة التنبيهات
         * 
         * @param {HTMLElement} alert 
         * @param {HTMLElement} alert_content
         * @param {String} text نص رسالة التنبيه
         */
        function showAlert(alert, alert_content, text) {
            alert.style.display = "block";
            alert_content.innerText = text;
            setTimeout(() => {
                alert.style.display = "none";
            }, 2000);
        }

        /**
         * 
         * @param {String} fileName 
         * @returns 
         */
        function isImageFile(fileName) {
            let imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"];
            return imageExtensions.some(ext => fileName?.toLowerCase()?.endsWith(ext));
        }

    } catch (error) {

        console.log(error);

    }

}