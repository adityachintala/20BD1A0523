const express = require('express');
const axios = require('axios');
const app = express();
const port = 8008;

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;
    console.log(urls);
    const numbers = await getNumbers(urls);
    res.send({ numbers });
    });


async function getNumbers(urls) {
    const promises = urls.map(async (url) => {
        try {
            const response = await axios.get(url);
            return response.data.numbers;
        } catch (error) {
            console.log(error);
        }
    });
    const numbers = await Promise.all(promises);
    return numbers.flat().sort((a, b) => a - b);
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});