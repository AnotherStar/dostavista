import axios, { AxiosInstance, isAxiosError } from 'axios';
import { OrderStatus, VehicleType, Warning } from './enums.js';
import {
    Order,
    Delivery,
    Point,
    Coordinate,
    Timestamp,
    OrderType,
    Money,
    PaymentMethod,
} from './types.js';
export { Coordinate, Delivery, Order, OrderPoint, Point, Timestamp } from './types.js';
export { OrderStatus, VehicleType, Warning } from './enums.js';

export const DOSTAVISTA_BASE_URL = 'https://robot.dostavista.ru/api/business/1.3';
export const DOSTAVISTA_BASE_URL_TEST = 'https://robotapitest.dostavista.ru/api/business/1.3';

export interface DostavistaOptions {
    baseURL?: string;
    isTest?: boolean;
}

export class Dostavista {
    instance: AxiosInstance;

    constructor(private token: string, options: DostavistaOptions = {}) {
        options = {
            baseURL: DOSTAVISTA_BASE_URL,
            ...options,
        };

        if (options.isTest) options.baseURL = DOSTAVISTA_BASE_URL_TEST;

        this.instance = axios.create({
            baseURL: options.baseURL,
            headers: {
                'X-DV-Auth-Token': this.token,
            },
        });

        this.instance.interceptors.response.use(null, error => {
            if (!isAxiosError(error)) throw error;
            const data = error.response?.data;
            if (!data) throw error;

            throw new Error(JSON.stringify(data));

            // if ('parameter_errors' in error) console.log(data.parameter_errors);

            // if ('parameter_warnings' in error) console.log(data.parameter_warnings);

            throw error.response;
        });
    }

    /** Расчет стоимости доставки */
    async calculateOrder(data: {
        // Тип заказа.
        type: OrderType;
        // Что везем. Максимум 5000 символов.
        matter: string;
        // Тип транспорта.
        vehicle_type_id: VehicleType;
        // Общий вес отправления, кг.
        total_weight_kg: number;
        // Сумма страховки.
        insurance_amount: Money;
        // Отправлять клиенту SMS уведомления о статусе заказа.
        is_client_notification_enabled: boolean;
        // Отправлять получателям SMS с интервалом прибытия и телефоном курьера.
        is_contact_person_notification_enabled: boolean;
        // Автоматически оптимизировать маршрут (адреса в заказе будут расставлены в оптимальном порядке).
        is_route_optimizer_enabled: boolean;
        // Требуемое число грузчиков (включая водителя). Максимум 11 человек.
        loaders_count: number;
        // Реквизиты для перевода выручки. Например, номер карты или Qiwi-кошелька. Максимум 300 символов.
        backpayment_details: string;
        // Нужно ли использовать мотобокс на мотоцикле/мопеде.
        is_motobox_required: boolean;
        // Способ оплаты (если отличается от способа по умолчанию).
        payment_method: PaymentMethod;
        // Идентификатор привязанной банковской карты (обязателен для способа оплаты bank_card).
        bank_card_id?: number;
        // Промокод.
        promo_code: string;
        // Список адресов (точек) в заказе.
        points: Point[];
    }) {
        return this.instance
            .post<{
                is_successful: boolean;
                order: Order;
                warnings: Warning[];
                parameter_warnings: unknown;
            }>('/calculate-order', data)
            .then(response => response.data);
    }

    /** Создание заказа */
    async createOrder() {
        throw new Error('Not implemented yet!');
    }

    /** Редактирование заказа */
    async editOrder() {
        throw new Error('Not implemented yet!');
    }

    /** Отмена заказа */
    async cancelOrder() {
        throw new Error('Not implemented yet!');
    }

    /** Получение списка заказов */
    async getOrders(
        params: {
            /** Полный номер заказа или список номеров заказов для поиска. */
            order_id?: number | number[];
            /** Статус заказов для поиска. */
            status?: OrderStatus;
            /** Смещение в списке заказов (для постраничной навигации). */
            offset?: number;
            /** Возвращаемое число заказов. Максимум 50. */
            count?: number;
        } = {},
    ) {
        return this.instance
            .get<{
                is_successful: boolean;
                orders: Order[];
                orders_count: number;
            }>('/orders', { params })
            .then(response => response.data);
    }

    /** Данные и местоположение курьера */
    async getCourier() {
        throw new Error('Not implemented yet!');
    }

    /** Данные клиентского профиля */
    async getClient() {
        throw new Error('Not implemented yet!');
    }

    /** Привязанные банковские карты */
    async getBankCards() {
        throw new Error('Not implemented yet!');
    }

    /** Получение списка интервалов */
    async getDeliveryIntervals() {
        throw new Error('Not implemented yet!');
    }

    /** Создание черновиков доставок */
    async createDeliveries() {
        throw new Error('Not implemented yet!');
    }

    /** Редактирование черновиков доставок */
    async editDeliveries() {
        throw new Error('Not implemented yet!');
    }

    /** Удаление черновиков доставок */
    async deleteDeliveries() {
        throw new Error('Not implemented yet!');
    }

    /**
     * Получение списка доставок
     *  */
    async getDeliveries(
        params: {
            /** Список номеров доставок для поиска. */
            delivery_ids?: number[];
            /** Выполнить поиск по полям: order_id, client_order_id, address, contact_person.name, contact_person.phone . */
            search_text?: string;
            /** Статус доставок для поиска. */
            status?: OrderStatus;
            /** Смещение в списке доставок (для постраничной навигации). */
            offset?: number;
            /**  Возвращаемое число доставок. Максимум 100. */
            count?: number;
        } = {},
    ) {
        return this.instance
            .get<{
                is_successful: boolean;
                deliveries: Delivery[];
                deliveries_count: number;
            }>(`/deliveries`, { params })
            .then(response => response.data);
    }

    /** Построить маршруты из доставок */
    async makeDeliveriesRoutes(data: {
        vehicle_type_id?: VehicleType;
        start_point?: Point;
        deliveries?: number[];
    }) {
        return this.instance
            .post<{
                is_successful: boolean;
                routes: {
                    route_points: {
                        /** Уникальный номер доставки. */
                        delivery_id?: number;
                        /** Координаты точки (широта). */
                        latitude?: Coordinate;
                        /** Координаты точки (долгота). */
                        longitude?: Coordinate;
                        /** Адрес. */
                        address?: string;
                        /** Ожидаемое время прибытия курьера на адрес (от). */
                        required_start_datetime?: Timestamp;
                        /** Ожидаемое время прибытия курьера на адрес (до). */
                        required_finish_datetime?: Timestamp;
                    }[];
                }[];
                warnings: Warning[];
                parameter_warnings: Object;
            }>(`/make-deliveries-routes`, data)
            .then(response => response.data);
    }

    /** Получение наклеек для коробок */
    async getLabels(
        params: {
            type?: 'pdf' | 'zpl';
            order_id?: number | number[];
            point_id?: number | number[];
            delivery_id?: number | number[];
        } = {},
    ) {
        return this.instance
            .get<{
                is_successful: boolean;
                labels: {
                    type: 'pdf' | 'zpl';
                    order_id: number;
                    point_id: number;
                    delivery_id: number;
                    content_base64: string;
                }[];
            }>(`/labels`, {
                params,
            })
            .then(response => response.data);
    }
}
