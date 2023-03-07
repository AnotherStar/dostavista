import axios, { AxiosInstance, isAxiosError } from 'axios';
import { OrderStatus, VehicleType, Warning } from './enums.js';
import { Delivery, Point } from './types.js';

const DOSTAVISTA_BASE_URL_TEST = 'https://robot.dostavista.ru/api/business/1.3';
const DOSTAVISTA_BASE_URL = 'https://robotapitest.dostavista.ru/api/business/1.3';

export interface DostavistaOptions {
    baseURL?: string;
    isTest?: boolean;
}

export type Timestamp = Number;
export type Coordinate = Number;

class Dostavista {
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

            console.log(data.parameter_errors);
            if ('parameter_errors' in error) {
            }

            throw error.response;
        });
    }

    /** Расчет стоимости доставки */
    async calculateOrder() {
        throw new Error('Not implemented yet!');
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
    async getOrders() {
        return this.instance
            .get<{
                orders: Delivery[];
                orders_count: number;
            }>('/orders')
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

export { Dostavista, Delivery, VehicleType, Warning };
