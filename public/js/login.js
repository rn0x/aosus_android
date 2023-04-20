import './modules/jsencrypt.js';

export default async () => {

    let storage = window.localStorage;
    let PrivateKey = storage.getItem('PrivateKey');
    let PublicKey = storage.getItem('PublicKey');
    let login_bt = document.getElementById("login_bt");
    let encrypted_key = document.getElementById("encrypted_key");
    let alert = document.getElementById("alert");
    let alert_content = document.getElementById("alert_content");
    let head_back = document.getElementById("head_back");
    let crypt = new JSEncrypt();
    head_back.style = "display:block !important;";

    head_back.addEventListener("click", e => {
        storage.removeItem("PublicKey");
        storage.removeItem("PrivateKey");
        window.location.href = "/index.html";
    });

    let decrypt = "";
    login_bt.addEventListener("click", async e => {

        if (encrypted_key?.value?.length !== 0) {

            crypt.setPublicKey(PublicKey);
            crypt.setPrivateKey(PrivateKey);
            decrypt = crypt.decrypt(encrypted_key?.value?.trim());


            if (decrypt) {
                storage.removeItem("PublicKey");
                storage.removeItem("PrivateKey");
                storage.setItem("token", JSON.parse(decrypt)?.key);
                window.location.href = "/index.html";
            }

            else {
                showAlert(alert, alert_content, "تحقق من إدخال المفتاح المشفر بشكل صحيح !");
            }
        }

        else {
            showAlert(alert, alert_content, "قم بلصق المفتاح المشفر المعروض على الموقع, ثم قم بالضغط على تسجيل الدخول");
        }
    });

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
}