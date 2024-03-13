import loadJson from './modules/loadJson.js';

export default async () => {

    try {

        const storage = window.localStorage;
        const token = storage.getItem('token');
        const configLoad = await loadJson(`https://raw.githubusercontent.com/rn0x/aosus_android/main/www/public/json/config.json`);
        const config = JSON.parse(configLoad);
        const categoriesLoad = await loadJson(`${config?.proxyUrl}${config?.url}/categories.json`);
        const categoriesJson = JSON.parse(categoriesLoad?.contents);
        const categories = []
        for (let item of categoriesJson?.category_list?.categories) {
            if (item?.read_restricted === false) {
                const opj = {

                    id: item?.id,
                    name: item?.name,
                    slug: item?.slug,
                    description: item?.description,
                    topics_day: item?.topics_day,
                    topics_week: item?.topics_week,
                    topics_month: item?.topics_month,
                    topics_all_time: item?.topics_all_time,

                }
                categories.push(opj)
            }
        }
        const categories_box = document.getElementById("categories_box");
        const categories_posts = document.getElementById("categories_posts");
        const posts_div = document.getElementById("posts_div");
        const posts_content = document.getElementById("posts_content");
        const head_back = document.getElementById("head_back");
        const loding = document.getElementById("loding");

        for (let item of categories) {

            const li = document.createElement("li");
            const category = document.createElement("div");
            const topics_all_time = document.createElement("h3");
            const category_name = document.createElement("h2");
            const category_description = document.createElement("p");

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
                window.location.href = "/posts.html";
            });

        }

        loding.style.display = "none";

        /**
        * تعديل نص الـ html
        * @param {string} text
        * @returns
        */

        function fixd_text(text) {

            const toHtml = document.createElement("div");
            toHtml.innerHTML = text;
            const aside_article_p = toHtml.querySelectorAll("aside > article > p");
            aside_article_p.forEach(el => el.remove());
            const aside_header = toHtml.querySelectorAll("aside > header");
            aside_header.forEach(el => el.remove());
            const meta = toHtml.querySelectorAll("div.meta");
            meta.forEach(el => el.remove());

            const fixd = toHtml.innerHTML?.replace(/(\s*<br\s*\/?>){3}/g, '')
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