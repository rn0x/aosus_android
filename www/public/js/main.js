import footer from './footer.js';
import header from './header.js';
import index from './index.js';
import login from './login.js';
import categories from './categories.js';
import posts from './posts.js';
import posts_content from './posts_content.js';
import create_posts from './create_posts.js';

if (typeof cordova !== 'undefined') {

    document.addEventListener('deviceready', async (e) => {
        await main();
    });
}

else {
    await main();
}

async function main() {

    await footer();
    await header();

    switch (window.location.pathname) {

        case "/index.html":

            await index();

            break;

        case "/login.html":

            await login();

            break;

        case "/categories.html":

            await categories();

            break;

        case "/posts.html":

            await posts();

            break;

        case "/posts_content.html":

            await posts_content();

            break;

        case "/create_posts.html":

            await create_posts();

            break;

        default:
            window.location.href = "/index.html";
            break;
    }
}