import loadJson from './modules/loadJson.js';

export default async () => {

    try {

        let storage = window.localStorage;
        let token = storage.getItem('token');
        let config = await loadJson(`/aosus_android/public/json/config.json`);
        let categories = await loadJson(`${config?.backend_url}/categories`);
        let categories_box = document.getElementById("categories_box");
        let categories_posts = document.getElementById("categories_posts");
        let posts_div = document.getElementById("posts_div");
        let posts_content = document.getElementById("posts_content");
        let head_back = document.getElementById("head_back");
        let loding = document.getElementById("loding");

        for (let item of categories) {

            let li = document.createElement("li");
            let category = document.createElement("div");
            let topics_all_time = document.createElement("h3");
            let category_name = document.createElement("h2");
            let category_description = document.createElement("p");

            categories_box.appendChild(li);
            li.appendChild(category);
            category.className = "category";
            li.appendChild(topics_all_time);
            topics_all_time.className = "topics_all_time";
            topics_all_time.innerText = item?.topics_all_time;
            category.appendChild(category_name);
            category_name.className = "category_name";
            category_name.innerText = item?.name;
            category.appendChild(category_description);
            category_description.className = "category_description";
            category_description.innerText = item?.description ? item?.description?.replace(/<br>|\n|<strong>|<\/strong>/g, '') : "";

            li.addEventListener("click", async e => {
                storage.setItem("slug", item?.slug);
                window.location.href = "/aosus_android/posts.html";
            });

        }

        loding.style.display = "none";

        /**
        * تعديل نص الـ html
        * @param {string} text
        * @returns
        */

        function fixd_text(text) {

            let toHtml = document.createElement("div");
            toHtml.innerHTML = text;
            let aside_article_p = toHtml.querySelectorAll("aside > article > p");
            aside_article_p.forEach(el => el.remove());
            let aside_header = toHtml.querySelectorAll("aside > header");
            aside_header.forEach(el => el.remove());
            let meta = toHtml.querySelectorAll("div.meta");
            meta.forEach(el => el.remove());

            let fixd = toHtml.innerHTML?.replace(/(\s*<br\s*\/?>){3}/g, '')
                ?.split(`<a class="mention" href="/`)?.join(`<a class="mention" href="${config?.url}/`) // إضافة رابط مجتمع أسس
                ?.split(`href="/`)?.join(`href="${config?.url}/`) // إضافة رابط مجتمع أسس
                ?.replace(/<svg.*?>|<\/svg>/g, '') // حذف التاق svg
                ?.replace(/<a[^>]*class="lightbox"[^>]*>([\s\S]*?)<\/a>/g, "$1") // حذف روابط معاينة الصور

            // ?.replace(/<yourtag>[\s\S]*<\/yourtag>/g, "$1")

            return fixd
        }

    } catch (error) {

        console.log(error);

    }

}