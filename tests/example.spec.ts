import {test, expect} from '@playwright/test';

let authToken: string;

test.beforeAll("Run BEFORE all", async ({request}) => {
    const tokenResponse = await request.post("https://conduit-api.bondaracademy.com/api/users/login", {
        data: {
            "user": {
                "email": "pythonqa5@gmail.com",
                "password": "@$4ca*aGV$"
            }
        }
    });
    const tokenResponseJson = await tokenResponse.json();
    authToken = tokenResponseJson.user.token;
});


test('Get Test Tags', async ({request}) => {
    const tagsResponse = await request.get("https://conduit-api.bondaracademy.com/api/tags");
    const tagsResponseJson = await tagsResponse.json();

    expect(tagsResponse.status()).toEqual(200);
    expect(tagsResponseJson.tags[0]).toEqual("Test");
    expect(tagsResponseJson.tags.length).toBeLessThanOrEqual(10);
});

test("Get Articles List", async ({request}) => {
    const response = await request.get("https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0");
    const responseJson = await response.json();

    expect(response.status()).toEqual(200);
    expect(responseJson.articles.length).toBeLessThanOrEqual(10);
    expect(responseJson.articles[0].title).toEqual("Discover Bondar Academy: Your Gateway to Efficient Learning");
});

test("Create Article", async ({request}) => {

    const response = await request.post("https://conduit-api.bondaracademy.com/api/articles/", {
        headers: {
            "Authorization": `Token ${authToken}`
        },
        data: {
            "article": {
                "title": "Testing APIs with Postman from Code",
                "description": "Amazing features",
                "body": "Come use Postman for the API testing with us!",
                "tagList": [
                    "API"
                ]
            }
        }
    });

    const responseJson = await response.json();

    expect(response.status()).toEqual(201);
    expect(responseJson.article.title).toEqual("Testing APIs with Postman from Code");
    expect(responseJson.article.tagList).toEqual(["API"]);

    const articlesResponse = await request.get("https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0", {
        headers: {
            "Authorization": `Token ${authToken}`
        }
    });
    const articlesResponseJson = await articlesResponse.json();
    const articleToDelete = articlesResponseJson.articles[0].slug;

    expect(articlesResponseJson.articles[0].title).toEqual("Testing APIs with Postman from Code");

    const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleToDelete}`, {
        headers: {
            "Authorization": `Token ${authToken}`
        }
    });

    expect(deleteResponse.status()).toEqual(204);
});

test("Create, Update and Delete Article", async ({request}) => {

    const response = await request.post("https://conduit-api.bondaracademy.com/api/articles/", {
        headers: {
            "Authorization": `Token ${authToken}`
        },
        data: {
            "article": {
                "title": "Testing Update Delete",
                "description": "Amazing features",
                "body": "Come use Postman for the API testing with us!",
                "tagList": []
            }
        }
    });

    const responseJson = await response.json();

    expect(response.status()).toEqual(201);
    expect(responseJson.article.title).toEqual("Testing Update Delete");

    const articlesResponse = await request.get("https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0", {
        headers: {
            "Authorization": `Token ${authToken}`
        }
    });
    const articlesResponseJson = await articlesResponse.json();
    const articleToDelete = articlesResponseJson.articles[0].slug;

    const modifiedTitle = "Testing Update Delete From Code";
    const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${articleToDelete}`, {
        headers: {
            "Authorization": `Token ${authToken}`
        },
        data: {
            "article": {
                "title": modifiedTitle,
                "description": "Amazing features",
                "body": "Come use Postman for the API testing with us!",
                "tagList": []
            }
        }
    });
    const updateArticleResponseJson = await updateArticleResponse.json();
    const newSlug = updateArticleResponseJson.article.slug;

    expect(updateArticleResponse.status()).toEqual(200);

    const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${newSlug}`, {
        headers: {
            "Authorization": `Token ${authToken}`
        }
    });

    expect(deleteResponse.status()).toEqual(204);
});