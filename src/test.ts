import { config } from 'dotenv';
import { Dostavista, DOSTAVISTA_BASE_URL_TEST, VehicleType } from './index.js';
import { OrderType, PaymentMethod } from './types.js';

config();

if (!process.env.DOSTAVISTA_TOKEN) throw new Error('process.env.DOSTAVISTA_TOKEN not provided');

const api = new Dostavista(process.env.DOSTAVISTA_TOKEN, {
    baseURL: DOSTAVISTA_BASE_URL_TEST,
});
(async () => {
    const orders = await api.getOrders().then(data => data.orders);

    // const labels = await api
    //     .getLabels({
    //         type: 'pdf',
    //         order_id: [orders[0].order_id as number],
    //     })
    //     .then(data => data.labels);

    const data = await api
        .calculateOrder({
            matter: 'asd',
            total_weight_kg: 10,
            vehicle_type_id: VehicleType.Пеший_курьер,
            backpayment_details: '',
            // bank_card_id: 0,
            insurance_amount: '1000',
            is_client_notification_enabled: true,
            is_contact_person_notification_enabled: true,
            is_motobox_required: false,
            is_route_optimizer_enabled: true,
            loaders_count: 0,
            payment_method: PaymentMethod.Оплата_с_баланса,
            promo_code: '',
            points: [
                {
                    address: 'Ореховый пр-д, 9',
                },
                {
                    address: 'Павелецкая набережная, 2',
                },
            ],
            type: OrderType.Обычный,
        })
        .then(data => {
            console.log(data.order);
            console.log({
                Цена: data.order.payment_amount,
                Координаты: data.order.points.map(x => x.latitude + ' ' + x.longitude),
                Время: data.order.points.map(
                    x => x.required_start_datetime + ' ' + x.required_finish_datetime,
                ),
            });
        });
})();
