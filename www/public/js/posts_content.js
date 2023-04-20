import loadJson from './modules/loadJson.js';

export default async () => {

    try {

        let storage = window.localStorage;
        let posts_id = storage.getItem('posts_id');
        let token = storage.getItem('token');
        let config = await loadJson(`/public/json/config.json`);
        let head_back = document.getElementById("head_back");
        let content = document.getElementById("content");
        let posts_content = document.getElementById("posts_content");
        let alert = document.getElementById("alert");
        let alert_content = document.getElementById("alert_content");
        let loding = document.getElementById("loding");

        head_back.style = "display:block !important;";
        head_back.addEventListener("click", e => {
            storage.removeItem("posts_id");
            window.location.href = "/posts.html";
        });

        let getPosts = await loadJson(`${config?.backend_url}/getPosts?id=${posts_id}`);
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
        let body = fixd_text(getPosts?.post?.cooked);

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
        posts_content_footer_reply.appendChild(posts_content_footer_reply_img);
        posts_content_footer_reply_img.src = "./public/image/reply.png";

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

            posts_content_footer.appendChild(posts_content_footer_reply);
            posts_content_footer_reply.appendChild(posts_content_footer_reply_img);
            posts_content_footer_reply_img.src = "./public/image/reply.png";

            // like | Event click

            posts_content_footer_like_img.addEventListener("click", async e => {

                if (token) {

                    let checkLogin = await loadJson(`${config?.backend_url}/session/${encodeURIComponent(token)}`);

                    if (checkLogin?.username) {

                        let like = await loadJson(`${config?.backend_url}/like/${encodeURIComponent(token)}?id=${iterator?.id}`);

                        if (like?.id) {
                            showAlert(alert, alert_content, "تم تسجيل الإعجاب بهذا المنشور");
                            posts_content_footer_like_p.innerText = iterator?.reaction_users_count + 1
                        }

                        else {
                            showAlert(alert, alert_content, like?.errors?.join("\n"));
                        }
                    }

                    else {
                        storage.removeItem('token');
                        showAlert(alert, alert_content, "قم بتسجيل الدخول اولاً");
                    }

                }

                else {
                    showAlert(alert, alert_content, "قم بتسجيل الدخول اولاً");
                }

            });


            // reply | Event click

            posts_content_footer_reply_img.addEventListener("click", async e => {

                if (token) {

                    let checkLogin = await loadJson(`${config?.backend_url}/session/${encodeURIComponent(token)}`);

                    if (checkLogin?.username) {

                        posts_reply_box.scrollIntoView();

                        let quote = `[quote="${iterator?.username ? iterator?.username : iterator?.name}, post:${iterator?.post_number}, topic:${iterator?.topic_id}"]\n\n${fixd_text(iterator?.cooked)}\n\n[/quote]\n\n`
                        textarea.value = quote;

                        button_reply.addEventListener("click", async e => {

                            let SendComment = await loadJson(`${config?.backend_url}/SendComment/${encodeURIComponent(token)}?raw=${encodeURIComponent(quote + textarea?.value)}&topic_id=${iterator?.topic_id}`);

                            if (SendComment?.id) {

                                posts_content_footer_like_p.innerText = iterator?.reaction_users_count + 1
                                showAlert(alert, alert_content, "تم نشر الرد");
                                window.location.reload();
                            }

                            else {
                                showAlert(alert, alert_content, SendComment?.errors?.join("\n"));
                            }

                        });
                    }

                    else {
                        storage.removeItem('token');
                        showAlert(alert, alert_content, "قم بتسجيل الدخول اولاً");
                    }
                }

                else {
                    showAlert(alert, alert_content, "قم بتسجيل الدخول اولاً");
                }
            });

        }

        // reply box

        let posts_reply_box = document.createElement("div");
        let textarea = document.createElement("textarea");
        let button_reply = document.createElement("button");

        content.appendChild(posts_reply_box);
        posts_reply_box.id = "posts_reply_box";
        posts_reply_box.appendChild(textarea);
        textarea.id = "textarea_reply";
        textarea.placeholder = "استخدم Markdown أو BBCode أو HTML للتنسيق";
        posts_reply_box.appendChild(button_reply);
        button_reply.id = "button_reply";
        button_reply.innerText = "الرد";


        // like | Event click

        posts_content_footer_like_img.addEventListener("click", async e => {

            if (token) {

                let checkLogin = await loadJson(`${config?.backend_url}/session/${encodeURIComponent(token)}`);

                if (checkLogin?.username) {

                    let like = await loadJson(`${config?.backend_url}/like/${encodeURIComponent(token)}?id=${getPosts?.post?.id}`);

                    if (like?.id) {
                        showAlert(alert, alert_content, "تم تسجيل الإعجاب بهذا المنشور");
                        posts_content_footer_like_p.innerText = getPosts?.post?.reaction_users_count + 1;
                    }

                    else {
                        showAlert(alert, alert_content, like?.errors?.join("\n"));
                    }
                }

                else {
                    storage.removeItem('token');
                    showAlert(alert, alert_content, "قم بتسجيل الدخول اولاً");
                }

            }

            else {
                showAlert(alert, alert_content, "قم بتسجيل الدخول اولاً");
            }

        });

        // reply | Event click

        posts_content_footer_reply_img.addEventListener("click", async e => {

            if (token) {

                let checkLogin = await loadJson(`${config?.backend_url}/session/${encodeURIComponent(token)}`);

                if (checkLogin?.username) {

                    posts_reply_box.scrollIntoView();

                    button_reply.addEventListener("click", async e => {

                        let SendComment = await loadJson(`${config?.backend_url}/SendComment/${encodeURIComponent(token)}?raw=${encodeURIComponent(textarea?.value)}&topic_id=${getPosts?.post?.topic_id}`);

                        if (SendComment?.id) {

                            posts_content_footer_like_p.innerText = getPosts?.post?.reaction_users_count + 1
                            showAlert(alert, alert_content, "تم نشر الرد");
                            window.location.reload();
                        }

                        else {
                            showAlert(alert, alert_content, SendComment?.errors?.join("\n"));
                        }

                    });
                }

                else {

                    storage.removeItem('token');
                    showAlert(alert, alert_content, "قم بتسجيل الدخول اولاً");
                }
            }

            else {
                showAlert(alert, alert_content, "قم بتسجيل الدخول اولاً");
            }
        });

        let links = document.querySelectorAll('a');

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