import {test} from "../utils/fixtures";
import {expect} from "../utils/customExpect";
import {createToken} from "../helpers/createToken";
import {validateSchema} from "../utils/schemaValidatior";
// @ts-ignore
import articleRequestPayload from "../requestObjects/POST-article.json";
import {fa, faker} from '@faker-js/faker';
import {getNewRandomArticle} from "../utils/dataGenerator";

// test.use({});

// let authToken: string;

// test.beforeAll("Run BEFORE all", async ({api, config}) => {
// const tokenResponse = await api
//     .path("/users/login")
//     .body({
//         "user": {
//             "email": config.userEmail,
//             "password": config.userPassword
//         }
//     })
//     .postRequest(200);
// authToken = await createToken(api, config?.userEmail, config?.userPassword);
// authToken = await createToken(config.userEmail, config.userPassword);
// });

test("Get Articles", async ({api}) => {

    const response = await api
        // .url("https://random-api.babos.com/api")
        .path("/articles")
        .params({
            "limit": "10",
            "offset": 0,
        })
        .clearAuth()
        // .headers({
        //     "Authorization": "Token "
        // })
        // .body({});
        .getRequest(200);

    await expect(response).shouldMatchSchema('articles', 'GET_articles');
    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);
});

test("Get Tags", async ({api}) => {
    const response = await api
        .path("/tags")
        .getRequest(200);

    // await validateSchema('tags', 'GET_tags', response);
    await expect(response).shouldMatchSchema('tags', 'GET_tags');
    expect(response.tags[0]).shouldEqual("Test");
    expect(response.tags.length).shouldBeLessThanOrEqual(10);
});


test("Create Article OOP", async ({api}) => {
    const articlePayload = getNewRandomArticle();
    const response = await api
        .path("/articles")
        // .headers({"Authorization": `Token ${authToken}`})
        // .body({
        //     "article": {
        //         "title": "Testing APIs with Postman from Code",
        //         "description": "Amazing features",
        //         "body": "Come use Postman for the API testing with us!",
        //         "tagList": [
        //             "API"
        //         ]
        //     }
        // })
        .body(articlePayload)
        .postRequest(201)

    await expect(response).shouldMatchSchema('articles', 'POST_articles');
    expect(response.article.title).shouldEqual(articlePayload.article.title);
    expect(response.article.tagList).shouldEqual(["API"]);

    const articlesResponse = await api
        .path("/articles")
        // .headers({"Authorization": `Token ${authToken}`})
        .params({
            "limit": "10",
            "offset": 0,
        })
        .getRequest(200);

    await expect(articlesResponse).shouldMatchSchema('articles', 'GET_articles');
    const articleToDelete = articlesResponse.articles[0].slug;
    expect(articlesResponse.articles[0].title).shouldEqual(articlePayload.article.title);

    await api
        .path(`/articles/${articleToDelete}`)
        // .headers({"Authorization": `Token ${authToken}`})
        .deleteRequest(204)
});

test("CRUD for the Article", async ({api}) => {
    const articleTitle = faker.lorem.sentence(3);
    const newArticleData = JSON.parse(JSON.stringify(articleRequestPayload));
    newArticleData.article.title = articleTitle;
    const response = await api
        .path("/articles")
        .headers({
            // "Authorization": `Token ${authToken}`
        })
        // .body({
        //     "article": {
        //         "title": "Testing Update Delete",
        //         "description": "Amazing features",
        //         "body": "Come use Postman for the API testing with us!",
        //         "tagList": []
        //     }
        // })
        .body(newArticleData)
        .postRequest(201);

    await expect(response).shouldMatchSchema('articles', 'POST_articles');
    expect(response.article.title).shouldEqual(articleTitle);

    const articlesResponse = await api
        .path("/articles")
        .params({
            "limit": "10",
            "offset": 0,
        })
        // .headers({"Authorization": `Token ${authToken}`})
        .getRequest(200);

    await expect(articlesResponse).shouldMatchSchema('articles', 'GET_articles');
    const articleToDelete = articlesResponse.articles[0].slug;

    const modifiedTitle = faker.lorem.sentence(3);
    const updateArticleResponse = await api
        .path(`/articles/${articleToDelete}`)
        // .headers({"Authorization": `Token ${authToken}`})
        .body({
            "article": {
                "title": modifiedTitle,
                "description": "Amazing features",
                "body": "Come use Postman for the API testing with us!",
                "tagList": []
            }
        })
        .putRequest(200);

    await expect(updateArticleResponse).shouldMatchSchema('articles', 'PUT_articles');
    const newSlug = updateArticleResponse.article.slug;

    await api
        .path(`/articles/${newSlug}`)
        // .headers({"Authorization": `Token ${authToken}`})
        .deleteRequest(204);

    const finalResponse = await api
        .path("/tags")
        .getRequest(200);

    expect(finalResponse.tags[0]).not.shouldEqual(modifiedTitle);
    expect(finalResponse.tags.length).shouldBeLessThanOrEqual(10);
});