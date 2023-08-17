const express = require('express');
const axios = require('axios');
const app = express();
const port = 8008;

app.get('/numbers', async (req, res) => {
    let urls = req.query.url;
    if (typeof urls === 'string') {
        urls = [urls];
    }
    const numbers = await getNumbers(urls);
    res.send({ numbers });
});

const Validator = (obj) => {
    if ((typeof obj !== 'object' || obj === null) || !Array.isArray(obj.numbers)) {
        return false;
    }
    for (const num of obj.numbers) {
        if (typeof num !== 'number' || !Number.isInteger(num)) {
            return false;
        }
    }
    return true;
}

async function getNumbers(urls) {
    const promises = urls.map(async (url) => {
        try {
            const response = await axios.get(url);
            // here we can check if the response is valid JSON
            if (Validator(response.data)) {
                return response.data.numbers;
            }
            else{
                return [];
            }
        } catch (error) {
            return [];
        }
    });

    let numbers = await Promise.all(promises);

    // console.log(numbers);

    // convert array of arrays into one array
    numbers = numbers.flat();
    return [...new Set(numbers)].sort((a, b) => a - b);
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});