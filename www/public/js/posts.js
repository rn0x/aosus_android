import loadJson from './modules/loadJson.js';

export default async () => {

    try {

        const storage = window.localStorage;
        const slug = storage.getItem('slug');
        const configLoad = await fetch(`https://raw.githubusercontent.com/rn0x/aosus_android/main/www/public/json/config.json`);
        const configData = await configLoad.text();
        const config = JSON.parse(configData);
        const head_back = document.getElementById("head_back");
        const more = document.getElementById("more");
        const loding = document.getElementById("loding");

        head_back.style = "display:block !important;";
        head_back.addEventListener("click", e => {

            storage.removeItem("slug");
            window.location.href = "/categories.html";

        });

        const posts = await getPosts(config, slug);

        let from = 4;
        let to = 7;

        for (let iterator of posts?.slice(0, 4)) {

            const getPostsLoad = await loadJson(`${config?.proxyUrl}${config?.url}/t/${iterator?.id}.json`);
            const getPostsJson = JSON.parse(getPostsLoad?.contents);
            const replies = [];
            for (let index = 1; index < getPostsJson?.post_stream?.posts.length; index++) {
                const element = getPostsJson?.post_stream?.posts[index];
                replies.push(element);

            }
            const getPosts = {
                id: getPostsJson?.id,
                title: getPostsJson?.title,
                views: getPostsJson?.views,
                like_count: getPostsJson?.like_count,
                reply_count: getPostsJson?.like_count,
                closed: getPostsJson?.closed,
                image_url: getPostsJson?.image_url,
                post: getPostsJson?.post_stream?.posts?.[0],
                replies: replies
            }
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
                window.location.href = "/posts_content.html";
            });
        }

        if (posts?.length > 4) {
            more.style.display = "block"
        }

        more.addEventListener("click", async e => {

            loding.style.display = "block";

            let GetArray = getFromTo(posts, from, to);

            for (let iterator of GetArray) {

                const getPostsLoad = await loadJson(`${config?.proxyUrl}${config?.url}/t/${iterator?.id}.json`);
                const getPostsJson = JSON.parse(getPostsLoad?.contents);
                const replies = [];
                for (let index = 1; index < getPostsJson?.post_stream?.posts.length; index++) {
                    const element = getPostsJson?.post_stream?.posts[index];
                    replies.push(element);

                }
                const getPosts = {
                    id: getPostsJson?.id,
                    title: getPostsJson?.title,
                    views: getPostsJson?.views,
                    like_count: getPostsJson?.like_count,
                    reply_count: getPostsJson?.like_count,
                    closed: getPostsJson?.closed,
                    image_url: getPostsJson?.image_url,
                    post: getPostsJson?.post_stream?.posts?.[0],
                    replies: replies
                }
                const posts = document.createElement("li");
                const posts_img = document.createElement("img");
                const posts_title = document.createElement("h2");
                const topic_info = document.createElement("ul");
                const topic_views_li = document.createElement("li");
                const topic_views_p = document.createElement("p");
                const topic_views_img = document.createElement("img");
                const topic_like_li = document.createElement("li");
                const topic_like_p = document.createElement("p");
                const topic_like_img = document.createElement("img");

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
                    window.location.href = "/posts_content.html";
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


async function getPosts(config, slug) {
    let posts = [];
    for (let index = 1; index < 100; index++) {
        try {
            const response = await loadJson(`${config?.proxyUrl}${config?.url}/c/${slug}/l/latest.json?page=${index}`);
            const data = JSON.parse(response?.contents);

            if (data?.topic_list?.topics?.length !== 0) {
                for (let item of data?.topic_list?.topics) {
                    posts.push(item);
                }
            } else {
                break;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    return posts;
}
