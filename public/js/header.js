import loadHtml from "./modules/loadHtml.js";
import loadJson from "./modules/loadJson.js";
import './modules/jsencrypt.js';

export default async () => {
    try {

        let header = document.getElementById('header');
        let fileHtml = "/header.html";
        let load = await loadHtml(fileHtml);
        header.innerHTML = load;

        let config = await loadJson(`/public/json/config.json`);
        let storage = window.localStorage;
        let token = storage.getItem('token');
        let avatar = storage.getItem('avatar');
        let loginDiv = document.querySelector('#login');
        let headUserDiv = document.querySelector('#head_user');

        // add a click event listener to the document object
        document.addEventListener('click', async (event) => {

            // check if the clicked element is the head_user div or any of its child elements
            let isClickedOnHeadUser = headUserDiv.contains(event.target);

            // if the click is outside of the head_user div, hide the login div
            if (!isClickedOnHeadUser) {
                loginDiv.style.display = 'none';
            }

            else if (isClickedOnHeadUser) {
                loginDiv.style.display = "block"
                if (token) {
                    let checkLogin = await loadJson(`${config?.backend_url}/session/${encodeURIComponent(token)}`);
                    if (checkLogin?.username) {
                        loginDiv.textContent = "تسجيل خروج";
                    } else {
                        loginDiv.textContent = "تسجيل دخول";
                    }
                } else {
                    loginDiv.textContent = "تسجيل دخول";
                }
            }

            loginDiv.addEventListener("click", async e => {

                let crypt = new JSEncrypt();
                let PublicKey = crypt.getPublicKey();
                let PrivateKey = crypt.getPrivateKey();

                if (token) {

                    let checkLogin = await loadJson(`${config?.backend_url}/session/${encodeURIComponent(token)}`);

                    // تسجيل خروج
                    if (checkLogin?.username) {
                        storage.removeItem("token");
                        storage.removeItem("PublicKey");
                        storage.removeItem("PrivateKey");
                        storage.removeItem("avatar");
                        window.location.href = window.location.href
                    }

                    // تسجيل دخول
                    else {
                        storage.setItem("PublicKey", PublicKey);
                        storage.setItem("PrivateKey", PrivateKey);
                        window.open(buildUrl(PublicKey), "_blank");
                        window.location.href = "/aosus_android/login.html"
                    }
                }

                // تسجيل دخول
                else {
                    storage.setItem("PublicKey", PublicKey);
                    storage.setItem("PrivateKey", PrivateKey);
                    window.open(buildUrl(PublicKey), "_blank");
                    window.location.href = "/aosus_android/login.html"
                }
            });

            function buildUrl(PublicKey) {

                let url = new URL(`${config?.url}/user-api-key/new`)
                url.searchParams.append('application_name', 'App Adroid')
                url.searchParams.append('client_id', 'adroid')
                url.searchParams.append('scopes', ["write", "read"])
                url.searchParams.append('public_key', PublicKey)
                url.searchParams.append('nonce', '1')
                return url.href

            }
        });

        if (!avatar) {

            if (token) {

                let checkLogin = await loadJson(`${config?.backend_url}/session/${encodeURIComponent(token)}`);

                if (checkLogin?.username) {

                    storage.setItem("avatar", checkLogin?.avatar_template);
                    headUserDiv.src = checkLogin?.avatar_template;

                }

                else {
                    headUserDiv.src = "/public/image/user.png";
                }
            }

            else {
                headUserDiv.src = "/public/image/user.png";
            }
        }

        if (avatar) {

            headUserDiv.src = avatar
        }

    } catch (error) {
        console.log(error);
    }
}