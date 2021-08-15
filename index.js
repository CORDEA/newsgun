const fetch = require('node-fetch');

const newsApiToken = process.env.NEWS_API_TOKEN;
const query = process.env.NEWS_API_QUERY;

async function fetchNews() {
    const url = `https://newsapi.org/v2/everything?apiKey=${newsApiToken}&q=${query}&language=en&pageSize=10`;
    const response = await fetch(url);
    return await response.json();
}

function formatJson(json) {
    let body = "";
    for (const i in json.articles) {
        const article = json.articles[i];
        if (i > 0) {
            body += '\n\n';
        }
        body += `* ${article.title}\n\t${article.description}\n\t${article.url}`;
    }
    return body;
}

fetchNews()
    .then(json => formatJson(json));
