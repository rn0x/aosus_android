import footer from './footer.js';
import header from './header.js';
import index from './index.js';
import login from './login.js';
import categories from './categories.js';
import posts from './posts.js';
import posts_content from './posts_content.js';
import create_posts from './create_posts.js';


await main();

async function main() {

    await footer();
    await header();

    switch (window.location.pathname) {

        case "/aosus_android/index.html":

            await index();

            break;

        case "/aosus_android/login.html":

            await login();

            break;

        case "/aosus_android/categories.html":

            await categories();

            break;

        case "/aosus_android/posts.html":

            await posts();

            break;

        case "/aosus_android/posts_content.html":

            await posts_content();

            break;

        case "/aosus_android/create_posts.html":

            await create_posts();

            break;

        default:
            window.location.href = "/aosus_android/index.html";
            break;
    }
}