import loadHtml from "./modules/loadHtml.js";

export default async () => {
    try {

        const header = document.getElementById('header');
        const fileHtml = "/header.html";
        const load = await loadHtml(fileHtml);
        header.innerHTML = load;
        const storage = window.localStorage;
        // const token = storage.getItem('token');

    } catch (error) {
        console.log(error);
    }
}