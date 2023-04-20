import loadJson from './modules/loadJson.js';

export default async () => {

    try {

        let storage = window.localStorage;
        let slug = storage.getItem('slug');
        let config = await loadJson(`/aosus_android/public/json/config.json`);
        let head_back = document.getElementById("head_back");
        let more = document.getElementById("more");
        let loding = document.getElementById("loding");

        head_back.style = "display:block !important;";
        head_back.addEventListener("click", e => {

            storage.removeItem("slug");
            window.location.href = "/aosus_android/categories.html";

        });

        let posts = await loadJson(`${config?.backend_url}/PostCategory?slug=${slug}`);

        let from = 4;
        let to = 7;

        for (let iterator of posts?.slice(0, 4)) {

            let getPosts = await loadJson(`${config?.backend_url}/getPosts?id=${iterator?.id}`);
            let posts = document.createElement("li");
            let posts_img = document.createElement("img");
            let posts_title = document.createElement("h2");
            let topic_info = document.createElement("ul");
            let topic_views_li = document.createElement("li");
            let topic_views_p = document.createElement("p");
            let topic_views_img = document.createElement("img");
            let topic_like_li = document.createElement("li");
            let topic_like_p = document.createElement("p");
            let topic_like_img = document.createElement("img");

            categories_posts.appendChild(posts);
            posts.id = `posts_id_${getPosts?.id}`
            posts.appendChild(posts_img);
            posts_img.src = getPosts?.image_url ? getPosts?.image_url : "./public/image/aosus_posts.jpeg";
            posts.appendChild(posts_title);
            posts_title.innerText = getPosts?.title;
            posts.appendChild(topic_info);
            topic_info.className = "topic_info"
            // views
            topic_info.appendChild(topic_views_li);
            topic_views_li.appendChild(topic_views_p);
            topic_views_p.innerText = getPosts?.views;
            topic_views_li.appendChild(topic_views_img);
            topic_views_img.src = "./public/image/views.png";
            // like
            topic_info.appendChild(topic_like_li);
            topic_like_li.appendChild(topic_like_p);
            topic_like_p.innerText = getPosts?.like_count;
            topic_like_li.appendChild(topic_like_img);
            topic_like_img.src = "./public/image/like.png";

            posts.addEventListener("click", e => { 
                storage.setItem("posts_id", getPosts?.id);
                window.location.href = "/aosus_android/posts_content.html";
            });
        }

        if (posts?.length > 4) {
            more.style.display = "block"
        }

        more.addEventListener("click", async e => {

            loding.style.display = "block";

            let GetArray = getFromTo(posts, from, to);

            for (let iterator of GetArray) {

                let getPosts = await loadJson(`${config?.backend_url}/getPosts?id=${iterator?.id}`);
                let posts = document.createElement("li");
                let posts_img = document.createElement("img");
                let posts_title = document.createElement("h2");
                let topic_info = document.createElement("ul");
                let topic_views_li = document.createElement("li");
                let topic_views_p = document.createElement("p");
                let topic_views_img = document.createElement("img");
                let topic_like_li = document.createElement("li");
                let topic_like_p = document.createElement("p");
                let topic_like_img = document.createElement("img");

                categories_posts.appendChild(posts);
                posts.id = `posts_id_${getPosts?.id}`
                posts.appendChild(posts_img);
                posts_img.src = getPosts?.image_url ? getPosts?.image_url : "./public/image/aosus_posts.jpeg";
                posts.appendChild(posts_title);
                posts_title.innerText = getPosts?.title;
                posts.appendChild(topic_info);
                topic_info.className = "topic_info"
                // views
                topic_info.appendChild(topic_views_li);
                topic_views_li.appendChild(topic_views_p);
                topic_views_p.innerText = getPosts?.views;
                topic_views_li.appendChild(topic_views_img);
                topic_views_img.src = "./public/image/views.png";
                // like
                topic_info.appendChild(topic_like_li);
                topic_like_li.appendChild(topic_like_p);
                topic_like_p.innerText = getPosts?.like_count;
                topic_like_li.appendChild(topic_like_img);
                topic_like_img.src = "./public/image/like.png";

                posts.addEventListener("click", e => { 
                    storage.setItem("posts_id", getPosts?.id);
                    window.location.href = "/aosus_android/posts_content.html";
                });
            }

            if (to >= posts.length) {
                more.style.display = 'none'
            }

            from += 4
            to += 4

            loding.style.display = "none";

        });

        loding.style.display = "none";

        /**
         * 
         * @param {Array} arr 
         * @param {Number} from 
         * @param {Number} to 
         * @returns
         */

        function getFromTo(arr, from, to) {

            let result = [];
            if (to >= (arr.length - 1)) to = arr.length - 1;
            for (let index = from; index <= to; index++) {
                result.push(arr[index])
            }

            return result;
        }

    } catch (error) {

        console.log(error);

    }

}