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
            window.location.href = "/aosus_android/index.html"
        });

        categories.addEventListener("click", e => { 
            window.location.href = "/aosus_android/categories.html"
        });

        create_posts.addEventListener("click", e => { 
            window.location.href = "/aosus_android/create_posts.html"
        });

    } catch (error) {
        console.log(error);
    }
}