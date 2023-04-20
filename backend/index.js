import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import fs from 'fs-extra';
import path from 'path';
import cors from 'cors';
import FormData from 'form-data';

const __dirname = path.resolve();
const config = fs.readJsonSync(path.join(__dirname, "config.json"));
const port = config?.port || 4000;
const app = express();
app.use(cors());


// Configuring body parser middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.raw({ limit: "50mb", type: 'application/octet-stream' }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));


// home

app.get('/', async (req, res) => {
  res.send('Hello World, from express');
});

app.get('/latest', async (req, res) => {

  try {

    let response = await fetch(`${config?.url}/latest.json?order=created`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data = await response?.json();

    if (data?.error_type || data?.errors) {

      res.status(404).send(data);
    }

    else {

      res.status(200).send(data?.topic_list?.topics);
    }

  } catch (error) {

    console.log(error);
    res.status(403).send(error?.toString());

  }

});

app.get('/session/:key', async (req, res) => {

  try {

    let key = req.params.key;
    let response = await fetch(`${config?.url}/session/current.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'User-Api-Key': key?.trim() // مفتاح API المستخدم للمصادقة
      },
    });

    let status = response.status;

    if (status === 200) {

      let data = await response?.json();
      res.status(200).send({
        id: data?.current_user?.id,
        username: data?.current_user?.username,
        name: data?.current_user?.name,
        admin: data?.current_user?.admin,
        title: data?.current_user?.title,
        avatar_template: `${config?.url}${data?.current_user?.avatar_template?.split("{size}")?.join("60")}`,

      });

    }

    else if (status === 403) {

      let data = await response?.json();
      res.status(403).send(data);

    }

    else {
      res.status(404).send("تأكد من كتابة User-Api-Key");
    }

  } catch (error) {

    console.log(error);
    res.status(404).send(error?.toString());

  }

});

app.get('/SendComment/:key', async (req, res) => {

  try {

    // User_Api_Key
    let key = req.params.key;

    // https://localhost:4000/SendComment/(User-Api-Key)?raw=aosus app&topic_id=344556
    let query = req?.query;
    let raw = query?.raw;
    let topic_id = Number(query?.topic_id);
    let body = {
      "raw": raw,
      "topic_id": topic_id,
    }
    let init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Api-Key': key?.trim() // مفتاح API المستخدم للمصادقة
      },
      body: JSON.stringify(body),
    }
    let response = await fetch(config?.url + '/posts.json ', init);
    let data = await response?.json();

    if (data?.action || data?.errors) {

      res.status(404).send(data);

    }

    else {

      res.status(200).send({

        id: data?.id,
        username: data?.username,
        created_at: data?.created_at,
        cooked: data?.cooked,
        raw: data?.raw,
        post_number: data?.post_number,
        post_type: data?.post_type,
        reply_count: data?.reply_count,
        reply_to_post_number: data?.reply_to_post_number,
        topic_id: data?.topic_id,
        topic_slug: data?.topic_slug,

      });

    }

  } catch (error) {

    console.log(error);
    res.status(404).send(error?.toString());

  }

});

app.post('/CreatePosts', async (req, res) => {

  try {

    let body = req.body
    let token = body?.token;
    let title = body?.title;
    let raw = body?.raw;
    let category = body?.category;
    let bodyOpj = {
      "title": title,
      "raw": raw,
      "category": category
    }
    let init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Api-Key': token?.trim() // مفتاح API المستخدم للمصادقة
      },
      body: JSON.stringify(bodyOpj),
    }
    let response = await fetch(config?.url + '/posts.json ', init);
    let data = await response?.json();

    if (data?.action || data?.errors) {

      res.status(404).send(data);
    }

    else {

      res.status(200).send({
        id: data?.id,
        username: data?.username,
        created_at: data?.created_at,
        cooked: data?.cooked,
        raw: data?.raw,
        post_number: data?.post_number,
        post_type: data?.post_type,
        reply_count: data?.reply_count,
        reply_to_post_number: data?.reply_to_post_number,
        topic_id: data?.topic_id,
        topic_slug: data?.topic_slug
      });
    }

  } catch (error) {

    console.log(error);
    res.status(404).send(error?.toString());

  }

});

app.get('/Categories', async (req, res) => {

  try {

    let response = await fetch(config?.url + `/categories.json`, { method: 'GET' });
    let data = await response?.json();

    if (data?.action || data?.errors) {

      res.status(404).send(data);

    }

    else {

      let array = []

      for (let item of data?.category_list?.categories) {

        if (item?.read_restricted === false) {

          let opj = {

            id: item?.id,
            name: item?.name,
            slug: item?.slug,
            description: item?.description,
            topics_day: item?.topics_day,
            topics_week: item?.topics_week,
            topics_month: item?.topics_month,
            topics_all_time: item?.topics_all_time,

          }

          array.push(opj)

        }
      }

      res.status(200).send(array);

    }

  } catch (error) {

    console.log(error);
    res.status(404).send(error?.toString());

  }

});

app.get('/PostCategory', async (req, res) => {

  try {

    // http://localhost:4000/PostCategory?slug=apps
    let query = req?.query;
    let slug = query?.slug;
    let PostCategory = [];


    for (let index = 1; index < 100; index++) {

      let response = await fetch(config?.url + `/search.json?q=category:${slug ? slug : null}&page=${index}`, { method: 'GET' });
      let data = await response?.json();

      if (data?.action || data?.errors) {

        res.status(404).send(data);

      }

      else {

        // let more_full_page_results = data?.grouped_search_result?.more_full_page_results;

        if (data?.topics) {

          for (let item of data?.topics) {

            PostCategory.push(item);

          }

        }

        else {
          break
        }

      }

    }

    res.status(200).send(PostCategory);

  } catch (error) {

    console.log(error);
    res.status(404).send(error?.toString());

  }

});

app.get('/getPosts', async (req, res) => {

  try {

    // https://localhost:4000/getPosts?id=2779
    let query = req?.query;
    let id = Number(query?.id);

    let response = await fetch(config?.url + `/t/${id}.json`, { method: 'GET' });


    let data = await response?.json();

    if (data?.extras || data?.errors) {

      res.status(404).send(data);

    }

    else {

      let replies = [];
      for (let index = 1; index < data?.post_stream?.posts.length; index++) {
        let element = data?.post_stream?.posts[index];
        replies.push(element);

      }

      res.status(200).send({
        id: data?.id,
        title: data?.title,
        views: data?.views,
        like_count: data?.like_count,
        reply_count: data?.like_count,
        closed: data?.closed,
        image_url: data?.image_url,
        post: data?.post_stream?.posts?.[0],
        replies: replies
      });
    }

  } catch (error) {

    console.log(error);
    res.status(404).send(error?.toString());

  }

});

app.get("/like/:key", async (req, res) => {

  try {

    // User_Api_Key
    let key = req.params.key;

    // https://localhost:4000/like/(User-Api-Key)?id=7898
    let query = req?.query
    let postsId = Number(query?.id);
    let body = {
      id: postsId, // رقم المنشور الذي تريد تسجيل إعجاب له
      post_action_type_id: 2,
      flag_topic: false,
    };
    let response = await fetch(`${config?.url}/post_actions.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'User-Api-Key': key?.trim()  // مفتاح API المستخدم للمصادقة
      },
      body: JSON.stringify(body),
    });

    let data = await response?.json();

    if (data?.errors) {

      res.status(404).send(data);
    }

    else {

      res.status(200).send(data);
    }

  } catch (error) {

    console.log(error);
    console.log('حدث خطأ في تسجيل الإعجاب.');
    res.status(403).send(error?.toString());

  }

});

app.post('/upload', async (req, res) => {

  try {
    // User_Api_Key
    let body = req?.body;
    let jsonArray = body?.uint8Array;
    let filename = body?.filename;
    let token = body?.token;
    let uint8Array = new Uint8Array(jsonArray);
    let arrayBuffer = uint8Array?.buffer;
    let buffer = Buffer.from(arrayBuffer);

    let form = new FormData();
    form.append('type', 'composer');
    form.append('synchronous', 'true');
    form.append('file', buffer, { filename: filename });

    let response = await fetch(`${config?.url}/uploads.json`, {
      method: "POST",
      headers: {
        ...form.getHeaders(),
        "Content-Type": "application/json",
        'User-Api-Key': token?.trim()  // مفتاح API المستخدم للمصادقة
      },
      body: form,
    });

    let data = await response?.json();

    if (data?.errors) {

      res.status(404).send(data);
    }

    else {

      res.status(200).send(data);
    }

  } catch (error) {

    console.log(error);
    res.status(404).send(error?.toString());

  }

});

app.listen(port, () => console.log(`Server ready at: http://localhost:${port}!`))