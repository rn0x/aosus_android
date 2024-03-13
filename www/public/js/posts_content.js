import loadJson from './modules/loadJson.js';

export default async () => {

    try {

        const storage = window.localStorage;
        const posts_id = storage.getItem('posts_id');
        const token = storage.getItem('token');
        const configLoad = await fetch(`https://raw.githubusercontent.com/rn0x/aosus_android/main/www/public/json/config.json`);
        const configData = await configLoad.text();
        const config = JSON.parse(configData);
        const head_back = document.getElementById("head_back");
        const content = document.getElementById("content");
        const posts_content = document.getElementById("posts_content");
        const alert = document.getElementById("alert");
        const alert_content = document.getElementById("alert_content");
        const loding = document.getElementById("loding");

        head_back.style = "display:block !important;";
        head_back.addEventListener("click", e => {
            storage.removeItem("posts_id");
            window.location.href = "/posts.html";
        });

        const getPostsLoad = await loadJson(`${config?.proxyUrl}${config?.url}/t/${posts_id}.json`);
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
        const posts_content_li = document.createElement("li");
        const posts_content_header = document.createElement("ul");
        const posts_content_header_username = document.createElement("li");
        const posts_content_header_avatar = document.createElement("li");
        const posts_content_header_avatar_img = document.createElement("img");
        const posts_content_text = document.createElement("div");
        const posts_content_footer = document.createElement("ul");
        const posts_content_footer_like = document.createElement("li");
        const posts_content_footer_like_p = document.createElement("p");
        const posts_content_footer_like_img = document.createElement("img");
        const posts_content_footer_reply = document.createElement("li");
        const posts_content_footer_reply_img = document.createElement("img");
        const body = fixd_text(getPosts?.post?.cooked);

        posts_content.appendChild(posts_content_li);
        posts_content_li.appendChild(posts_content_header);
        posts_content_header.className = "posts_content_header"
        posts_content_header.appendChild(posts_content_header_username);
        posts_content_header_username.innerText = getPosts?.post?.name ? getPosts?.post?.name : getPosts?.post?.username;
        posts_content_header.appendChild(posts_content_header_avatar);
        posts_content_header_avatar.appendChild(posts_content_header_avatar_img);
        posts_content_header_avatar_img.src = `${config?.url}${getPosts?.post?.avatar_template?.split("{size}")?.join("60")}`;

        posts_content_li.appendChild(posts_content_text);
        posts_content_text.className = "posts_content_text";
        posts_content_text.innerHTML = body;

        posts_content_li.appendChild(posts_content_footer);
        posts_content_footer.className = "posts_content_footer";

        posts_content_footer.appendChild(posts_content_footer_like);
        posts_content_footer_like.appendChild(posts_content_footer_like_img);
        posts_content_footer_like_img.src = "./public/image/like.png";
        posts_content_footer_like.appendChild(posts_content_footer_like_p);
        posts_content_footer_like_p.innerText = getPosts?.post?.reaction_users_count;

        posts_content_footer.appendChild(posts_content_footer_reply);

        for (let iterator of getPosts?.replies) {

            let posts_content_li = document.createElement("li");
            let posts_content_header = document.createElement("ul");
            let posts_content_header_username = document.createElement("li");
            let posts_content_header_avatar = document.createElement("li");
            let posts_content_header_avatar_img = document.createElement("img");
            let posts_content_text = document.createElement("div");
            let posts_content_footer = document.createElement("ul");
            let posts_content_footer_like = document.createElement("li");
            let posts_content_footer_like_p = document.createElement("p");
            let posts_content_footer_like_img = document.createElement("img");
            let posts_content_footer_reply = document.createElement("li");
            let posts_content_footer_reply_img = document.createElement("img");
            let body = fixd_text(iterator?.cooked);

            posts_content.appendChild(posts_content_li);
            posts_content_li.appendChild(posts_content_header);
            posts_content_header.className = "posts_content_header"
            posts_content_header.appendChild(posts_content_header_username);
            posts_content_header_username.innerText = iterator?.name ? iterator?.name : iterator?.username;
            posts_content_header.appendChild(posts_content_header_avatar);
            posts_content_header_avatar.appendChild(posts_content_header_avatar_img);
            posts_content_header_avatar_img.src = `${config?.url}${iterator?.avatar_template?.split("{size}")?.join("60")}`;

            posts_content_li.appendChild(posts_content_text);
            posts_content_text.className = "posts_content_text";
            posts_content_text.innerHTML = body;

            posts_content_li.appendChild(posts_content_footer);
            posts_content_footer.className = "posts_content_footer";

            posts_content_footer.appendChild(posts_content_footer_like);
            posts_content_footer_like.appendChild(posts_content_footer_like_img);
            posts_content_footer_like_img.src = "./public/image/like.png";
            posts_content_footer_like.appendChild(posts_content_footer_like_p);
            posts_content_footer_like_p.innerText = iterator?.reaction_users_count;

        }

        const links = document.querySelectorAll('a');

        links.forEach(link => {
            if (!link.getAttribute('target') || link.getAttribute('target') !== '_blank') {
                link.setAttribute('target', '_blank');
            }
        });

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

    } catch (error) {

        console.log(error);

    }

}