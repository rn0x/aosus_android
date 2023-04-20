import loadHtml from "./modules/loadHtml.js";


export default async () => {
    try {

        let footer = document.getElementById('footer');
        let fileHtml = "/footer.html";
        let load = await loadHtml(fileHtml);
        footer.innerHTML = load;

        let index = document.getElementById("index");
        let categories = document.getElementById("categories");
        let create_posts = document.getElementById("create_posts");

        index.addEventListener("click", e => { 
            window.location.href = "/index.html"
        });

        categories.addEventListener("click", e => { 
            window.location.href = "/categories.html"
        });

        create_posts.addEventListener("click", e => { 
            window.location.href = "/create_posts.html"
        });

    } catch (error) {
        console.log(error);
    }
}