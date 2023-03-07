import { config } from 'dotenv';
import { Dostavista } from './index.js';

config();

if (!process.env.DOSTAVISTA_TOKEN) throw new Error('process.env.DOSTAVISTA_TOKEN not provided');

const api = new Dostavista(process.env.DOSTAVISTA_TOKEN);

(async () => {
    const orders = await api.getOrders().then(data => data.orders);

    const labels = await api
        .getLabels({
            type: 'pdf',
            order_id: [orders[0].order_id as number],
        })
        .then(data => data.labels);

    console.log(labels.map(x => x.order_id + ': ' + x.content_base64.slice(0, 100)));
})();
