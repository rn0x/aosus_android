import loadHtml from "./modules/loadHtml.js";


export default async () => {
    try {

        const footer = document.getElementById('footer');
        const fileHtml = "/footer.html";
        const load = await loadHtml(fileHtml);
        footer.innerHTML = load;

        const index = document.getElementById("index");
        const categories = document.getElementById("categories");
        index.addEventListener("click", e => { 
            window.location.href = "/index.html"
        });

        categories.addEventListener("click", e => { 
            window.location.href = "/categories.html"
        });


    } catch (error) {
        console.log(error);
    }
}