import axios from 'axios';
import * as cheerio from 'cheerio';

const getPrice = async (productID) => {
    const url = `https://www.amazon.de/gp/product/${productID}`;
    const product = await axios.get(url, {
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Host': 'www.amazon.de',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0',
            'TE': 'trailers',
			'Upgrade-Insecure-Requests': 1
        }
    });
    try {
        const $ = cheerio.load(product.data);
        let price = $('#sns-base-price').text().replace(/\s/g, '').replace(/€/g, '');
        if (price.length !== 0) {
            return price;
        } else {
            const element = $('.a-price').html();
            price = cheerio.load(element)('.a-offscreen').text().replace(/\s/g, '').replace(/€/g, '');
            if (price.length === 0) {
                console.error('Could not load the price!');
            } else {
                return price;
            }
        }
    } catch (err) {
        console.error(err);
    }
};

console.log(await getPrice('B00F0SQLR8'));