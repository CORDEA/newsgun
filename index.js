const fetch = require('node-fetch');
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const newsApiToken = process.env.NEWS_API_TOKEN;
const query = process.env.NEWS_API_QUERY;

const mailgunApiToken = process.env.MAILGUN_API_TOKEN;
const mailgunDomain = process.env.MAILGUN_DOMAIN;
const mailgunTo = process.env.MAILGUN_TO;

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

async function sendMail(body) {
    const mailgun = new Mailgun(formData);
    const client = mailgun.client({username: 'api', key: mailgunApiToken});

    const response = await client.messages.create(
        mailgunDomain,
        {
            from: `mailgun@${mailgunDomain}`,
            to: [mailgunTo],
            subject: `News Update: ${query}`,
            text: body,
        }
    );
    console.log(response);
}

fetchNews()
    .then(json => formatJson(json))
    .then(s => sendMail(s));
