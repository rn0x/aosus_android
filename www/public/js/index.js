import loadJson from './modules/loadJson.js';

export default async () => {

    try {

        const configLoad = await fetch(`https://raw.githubusercontent.com/rn0x/aosus_android/main/www/public/json/config.json`);
        const configData = await configLoad.text();
        const config = JSON.parse(configData);
        // تكوين العنوان URL باستخدام البروكسي
        const apiUrl = `${config?.proxyUrl}${encodeURIComponent(`${config?.url}/latest.json?order=created`)}`;

        // إجراء الطلب باستخدام البروكسي
        const latest = await loadJson(apiUrl);
        const latestJson = JSON.parse(latest?.contents);

        const topic = document.getElementById("topic");
        const topic_div = document.getElementById("topic_div");
        const head_back = document.getElementById("head_back");
        const alert = document.getElementById("alert");
        const alert_content = document.getElementById("alert_content");
        const loding = document.getElementById("loding");

        for (let item of latestJson?.topic_list?.topics) {

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

            topic.appendChild(posts);
            posts.id = `posts_id_${item?.id}`
            posts.appendChild(posts_img);
            posts_img.src = item?.image_url ? item?.image_url : "./public/image/aosus_posts.jpeg";
            posts.appendChild(posts_title);
            posts_title.innerText = item?.title;
            posts.appendChild(topic_info);
            topic_info.className = "topic_info"
            // views
            topic_info.appendChild(topic_views_li);
            topic_views_li.appendChild(topic_views_p);
            topic_views_p.innerText = item?.views;
            topic_views_li.appendChild(topic_views_img);
            topic_views_img.src = "./public/image/views.png";
            // like
            topic_info.appendChild(topic_like_li);
            topic_like_li.appendChild(topic_like_p);
            topic_like_p.innerText = item?.like_count;
            topic_like_li.appendChild(topic_like_img);
            topic_like_img.src = "./public/image/like.png";

            posts.addEventListener("click", async e => {

                e.preventDefault();
                window.scrollTo(0, 0);
                loding.style.display = "block";
                topic.style.display = "none";
                topic_div.style.display = "block";
                head_back.style = "display:block !important;";
                head_back.addEventListener("click", e => {
                    window.location.href = window.location.href;
                });

                const topic_content = document.createElement("ul");
                topic_div.appendChild(topic_content);
                topic_content.id = "topic_content";
                const getPostsLoad = await loadJson(`${config?.proxyUrl}${config?.url}/t/${item?.id}.json`);
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

                const topic_content_li = document.createElement("li");
                const topic_content_header = document.createElement("ul");
                const topic_content_header_username = document.createElement("li");
                const topic_content_header_avatar = document.createElement("li");
                const topic_content_header_avatar_img = document.createElement("img");
                const topic_content_text = document.createElement("div");
                const topic_content_footer = document.createElement("ul");
                const topic_content_footer_like = document.createElement("li");
                const topic_content_footer_like_p = document.createElement("p");
                const topic_content_footer_like_img = document.createElement("img");
                const topic_content_footer_reply = document.createElement("li");
                // const topic_content_footer_reply_p = document.createElement("p");
                const topic_content_footer_reply_img = document.createElement("img");
                const body = fixd_text(getPosts?.post?.cooked);

                topic_content.appendChild(topic_content_li);
                topic_content_li.appendChild(topic_content_header);
                topic_content_header.className = "topic_content_header"
                topic_content_header.appendChild(topic_content_header_username);
                topic_content_header_username.innerText = getPosts?.post?.name ? getPosts?.post?.name : getPosts?.post?.username;
                topic_content_header.appendChild(topic_content_header_avatar);
                topic_content_header_avatar.appendChild(topic_content_header_avatar_img);
                topic_content_header_avatar_img.src = `${config?.url}${getPosts?.post?.avatar_template?.split("{size}")?.join("60")}`;

                topic_content_li.appendChild(topic_content_text);
                topic_content_text.className = "topic_content_text";
                topic_content_text.innerHTML = body;

                topic_content_li.appendChild(topic_content_footer);
                topic_content_footer.className = "topic_content_footer";

                topic_content_footer.appendChild(topic_content_footer_like);
                topic_content_footer_like.appendChild(topic_content_footer_like_img);
                topic_content_footer_like_img.src = "./public/image/like.png";
                topic_content_footer_like.appendChild(topic_content_footer_like_p);
                topic_content_footer_like_p.innerText = getPosts?.post?.reaction_users_count;

                topic_content_footer.appendChild(topic_content_footer_reply);

                // comments

                for (let iterator of getPosts?.replies) {

                    const topic_content_li = document.createElement("li");
                    const topic_content_header = document.createElement("ul");
                    const topic_content_header_username = document.createElement("li");
                    const topic_content_header_avatar = document.createElement("li");
                    const topic_content_header_avatar_img = document.createElement("img");
                    const topic_content_text = document.createElement("div");
                    const topic_content_footer = document.createElement("ul");
                    const topic_content_footer_like = document.createElement("li");
                    const topic_content_footer_like_p = document.createElement("p");
                    const topic_content_footer_like_img = document.createElement("img");
                    const topic_content_footer_reply = document.createElement("li");
                    const topic_content_footer_reply_img = document.createElement("img");
                    const body = fixd_text(iterator?.cooked);

                    topic_content.appendChild(topic_content_li);
                    topic_content_li.appendChild(topic_content_header);
                    topic_content_header.className = "topic_content_header"
                    topic_content_header.appendChild(topic_content_header_username);
                    topic_content_header_username.innerText = iterator?.name ? iterator?.name : iterator?.username;
                    topic_content_header.appendChild(topic_content_header_avatar);
                    topic_content_header_avatar.appendChild(topic_content_header_avatar_img);
                    topic_content_header_avatar_img.src = `${config?.url}${iterator?.avatar_template?.split("{size}")?.join("60")}`;

                    topic_content_li.appendChild(topic_content_text);
                    topic_content_text.className = "topic_content_text";
                    topic_content_text.innerHTML = body;

                    topic_content_li.appendChild(topic_content_footer);
                    topic_content_footer.className = "topic_content_footer";

                    topic_content_footer.appendChild(topic_content_footer_like);
                    topic_content_footer_like.appendChild(topic_content_footer_like_img);
                    topic_content_footer_like_img.src = "./public/image/like.png";
                    topic_content_footer_like.appendChild(topic_content_footer_like_p);
                    topic_content_footer_like_p.innerText = iterator?.reaction_users_count;

                    topic_content_footer.appendChild(topic_content_footer_reply);
                }

                /**
                    تحقق من وجود عناصر a التي تحتوي على الخاصية target="_blank" وإضافتها في حالة عدم وجودها
                */

                const links = document.querySelectorAll('a');

                links.forEach(link => {
                    if (!link.getAttribute('target') || link.getAttribute('target') !== '_blank') {
                        link.setAttribute('target', '_blank');
                    }
                });

                loding.style.display = "none";

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