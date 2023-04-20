import loadJson from './modules/loadJson.js';

export default async () => {

    try {

        let storage = window.localStorage;
        let token = storage.getItem('token');
        let config = await loadJson(`/public/json/config.json`);
        let latest = await loadJson(`${config?.backend_url}/latest`);
        let topic = document.getElementById("topic");
        let topic_div = document.getElementById("topic_div");
        let head_back = document.getElementById("head_back");
        let alert = document.getElementById("alert");
        let alert_content = document.getElementById("alert_content");
        let loding = document.getElementById("loding");

        for (let item of latest) {

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
            // let topic_reply_li = document.createElement("li");
            // let topic_reply_p = document.createElement("p");
            // let topic_reply_img = document.createElement("img");

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
            // reply
            // topic_info.appendChild(topic_reply_li);
            // topic_reply_li.appendChild(topic_reply_p);
            // topic_reply_p.innerText = item?.reply_count;
            // topic_reply_li.appendChild(topic_reply_img);
            // topic_reply_img.src = "./public/image/reply.png";

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

                let topic_content = document.createElement("ul");
                topic_div.appendChild(topic_content);
                topic_content.id = "topic_content";
                let getPosts = await loadJson(`${config?.backend_url}/getPosts?id=${item?.id}`);
                let topic_content_li = document.createElement("li");
                let topic_content_header = document.createElement("ul");
                let topic_content_header_username = document.createElement("li");
                let topic_content_header_avatar = document.createElement("li");
                let topic_content_header_avatar_img = document.createElement("img");
                let topic_content_text = document.createElement("div");
                let topic_content_footer = document.createElement("ul");
                let topic_content_footer_like = document.createElement("li");
                let topic_content_footer_like_p = document.createElement("p");
                let topic_content_footer_like_img = document.createElement("img");
                let topic_content_footer_reply = document.createElement("li");
                // let topic_content_footer_reply_p = document.createElement("p");
                let topic_content_footer_reply_img = document.createElement("img");
                let body = fixd_text(getPosts?.post?.cooked);

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
                // topic_content_footer_reply.appendChild(topic_content_footer_reply_p);
                // topic_content_footer_reply_p.innerText = getPosts?.reply_count;
                topic_content_footer_reply.appendChild(topic_content_footer_reply_img);
                topic_content_footer_reply_img.src = "./public/image/reply.png";

                // like | Event click

                topic_content_footer_like_img.addEventListener("click", async e => {

                    if (token) {

                        let checkLogin = await loadJson(`${config?.backend_url}/session/${encodeURIComponent(token)}`);

                        if (checkLogin?.username) {

                            let like = await loadJson(`${config?.backend_url}/like/${encodeURIComponent(token)}?id=${getPosts?.post?.id}`);

                            if (like?.id) {
                                showAlert(alert, alert_content, "تم تسجيل الإعجاب بهذا المنشور");
                                topic_content_footer_like_p.innerText = getPosts?.post?.reaction_users_count + 1;
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

                topic_content_footer_reply_img.addEventListener("click", async e => {

                    if (token) {

                        let checkLogin = await loadJson(`${config?.backend_url}/session/${encodeURIComponent(token)}`);

                        if (checkLogin?.username) {

                            topic_reply_box.scrollIntoView();

                            button_reply.addEventListener("click", async e => {

                                let SendComment = await loadJson(`${config?.backend_url}/SendComment/${encodeURIComponent(token)}?raw=${encodeURIComponent(textarea?.value)}&topic_id=${getPosts?.post?.topic_id}`);

                                if (SendComment?.id) {

                                    topic_content_footer_like_p.innerText = getPosts?.post?.reaction_users_count + 1
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

                // comments

                for (let iterator of getPosts?.replies) {

                    let topic_content_li = document.createElement("li");
                    let topic_content_header = document.createElement("ul");
                    let topic_content_header_username = document.createElement("li");
                    let topic_content_header_avatar = document.createElement("li");
                    let topic_content_header_avatar_img = document.createElement("img");
                    let topic_content_text = document.createElement("div");
                    let topic_content_footer = document.createElement("ul");
                    let topic_content_footer_like = document.createElement("li");
                    let topic_content_footer_like_p = document.createElement("p");
                    let topic_content_footer_like_img = document.createElement("img");
                    let topic_content_footer_reply = document.createElement("li");
                    // let topic_content_footer_reply_p = document.createElement("p");
                    let topic_content_footer_reply_img = document.createElement("img");
                    let body = fixd_text(iterator?.cooked);

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
                    // topic_content_footer_reply.appendChild(topic_content_footer_reply_p);
                    // topic_content_footer_reply_p.innerText = iterator?.reply_count;
                    topic_content_footer_reply.appendChild(topic_content_footer_reply_img);
                    topic_content_footer_reply_img.src = "./public/image/reply.png";


                    // like | Event click

                    topic_content_footer_like_img.addEventListener("click", async e => {

                        if (token) {

                            let checkLogin = await loadJson(`${config?.backend_url}/session/${encodeURIComponent(token)}`);

                            if (checkLogin?.username) {

                                let like = await loadJson(`${config?.backend_url}/like/${encodeURIComponent(token)}?id=${iterator?.id}`);

                                if (like?.id) {
                                    showAlert(alert, alert_content, "تم تسجيل الإعجاب بهذا المنشور");
                                    topic_content_footer_like_p.innerText = iterator?.reaction_users_count + 1
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

                    topic_content_footer_reply_img.addEventListener("click", async e => {

                        if (token) {

                            let checkLogin = await loadJson(`${config?.backend_url}/session/${encodeURIComponent(token)}`);

                            if (checkLogin?.username) {

                                topic_reply_box.scrollIntoView();

                                let quote = `[quote="${iterator?.username ? iterator?.username : iterator?.name}, post:${iterator?.post_number}, topic:${iterator?.topic_id}"]\n\n${fixd_text(iterator?.cooked)}\n\n[/quote]\n\n`
                                textarea.value = quote;

                                button_reply.addEventListener("click", async e => {

                                    let SendComment = await loadJson(`${config?.backend_url}/SendComment/${encodeURIComponent(token)}?raw=${encodeURIComponent(quote + textarea?.value)}&topic_id=${iterator?.topic_id}`);

                                    if (SendComment?.id) {

                                        topic_content_footer_like_p.innerText = iterator?.reaction_users_count + 1
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

                /**
                    تحقق من وجود عناصر a التي تحتوي على الخاصية target="_blank" وإضافتها في حالة عدم وجودها
                */

                let links = document.querySelectorAll('a');

                links.forEach(link => {
                    if (!link.getAttribute('target') || link.getAttribute('target') !== '_blank') {
                        link.setAttribute('target', '_blank');
                    }
                });

                // reply box

                let topic_reply_box = document.createElement("div");
                let textarea = document.createElement("textarea");
                let button_reply = document.createElement("button");

                topic_div.appendChild(topic_reply_box);
                topic_reply_box.id = "topic_reply_box";
                topic_reply_box.appendChild(textarea);
                textarea.id = "textarea_reply";
                textarea.placeholder = "استخدم Markdown أو BBCode أو HTML للتنسيق";
                topic_reply_box.appendChild(button_reply);
                button_reply.id = "button_reply";
                button_reply.innerText = "الرد";

                button_reply.addEventListener("click", async e => {

                    if (token) {

                        let checkLogin = await loadJson(`${config?.backend_url}/session/${encodeURIComponent(token)}`);

                        if (checkLogin?.username) {

                            let SendComment = await loadJson(`${config?.backend_url}/SendComment/${encodeURIComponent(token)}?raw=${encodeURIComponent(textarea?.value)}&topic_id=${getPosts?.post?.topic_id}`);

                            if (SendComment?.id) {

                                topic_content_footer_like_p.innerText = getPosts?.post?.reaction_users_count + 1
                                showAlert(alert, alert_content, "تم نشر الرد");
                                window.location.reload();

                            }

                            else {
                                showAlert(alert, alert_content, SendComment?.errors?.join("\n"));
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