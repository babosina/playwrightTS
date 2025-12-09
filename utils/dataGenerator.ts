import {faker} from '@faker-js/faker';
// @ts-ignore
import articleRequestPayload from "../requestObjects/POST-article.json";


export function getNewRandomArticle() {
    // const newArticleData = JSON.parse(JSON.stringify(articleRequestPayload));
    const newArticleData = structuredClone(articleRequestPayload);
    newArticleData.article.title = faker.lorem.sentence(3);
    newArticleData.article.description = faker.lorem.sentence(5);
    newArticleData.article.body = faker.lorem.paragraphs(2);
    return newArticleData;
}
