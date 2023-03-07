import axios, { AxiosInstance, isAxiosError } from 'axios';
import { OrderStatus, VehicleType } from './enums.js';
import { Delivery } from './types.js';

const DOSTAVISTA_BASE_URL_TEST = 'https://robot.dostavista.ru/api/business/1.3';
const DOSTAVISTA_BASE_URL = 'https://robotapitest.dostavista.ru/api/business/1.3';

export interface DostavistaOptions {
    baseURL?: string;
    isTest?: boolean;
}

export enum Warning {
    'Неизвестная ошибка. Сообщите о проблеме на api@dostavista.ru.' = 'unexpected_error',
    'Неизвестная версия API. На данный момент доступны версии 1.0, 1.1 и 1.2.' = 'invalid_api_version',
    'Устаревшая версия API. Указанная в запросе версия API больше не поддерживается.' = 'required_api_upgrade',
    'Превышено максимально допустимое число запросов к API.' = 'requests_limit_exceeded',
    'В запросе требуется передать заголовок X-DV-Auth-Token с токеном для авторизации.' = 'required_auth_token',
    'Некорректный токен в заголовке X-DV-Auth-Token.' = 'invalid_auth_token',
    'Запрос должен быть отправлен HTTP методом GET.' = 'required_method_get',
    'Запрос должен быть отправлен HTTP методом POST.' = 'required_method_post',
    'Данные в теле POST запроса должны быть в формате JSON.' = 'invalid_post_json',
    'В передаваемых параметрах содержатся ошибки. Подробный список ошибок можно найти в параметре ответа parameter_errors.' = 'invalid_parameters',
    'Ваш договор присоединения ещё не одобрен (для юридических лиц).' = 'unapproved_contract',
    'Сервис временно недоступен. Повторите запрос позже.' = 'service_unavailable',
    'Вызов несуществующего метода API.' = 'invalid_api_method',
    'Для вашего аккаунта не доступна функция «Выкупить товар на точке».' = 'buyout_not_allowed',
    'Недостаточно денег на балансе для функции «Выкупить товар на точке».' = 'insufficient_balance_for_buyout',
    'Заказ не может быть изменен.' = 'order_cannot_be_edited',
    'Заказ не может быть отменен.' = 'order_cannot_be_canceled',
    'Недостаточно средств на балансе. Пополните баланс.' = 'insufficient_balance',
    'Сумма выкупа по активным заказам слишком велика. Для оформления нового заказа с учетом других активных заказов и доступного кредитного лимита недостаточно средств на балансе. Необходимо внести предоплату.' = 'buyout_amount_limit_exceeded',
    'Маршрут не найден.' = 'route_not_found',
    'Превышена максимально разрешенная сумма заказа.' = 'total_payment_amount_limit_exceeded',
    'Заказ является копией недавнего заказа' = 'order_is_duplicate',
    'Недостаточно средств на карте' = 'insufficient_funds',
    'Оплата картой не удалась' = 'card_payment_failed',
}

export type Timestamp = Number;
export type Coordinate = Number;

export interface Point {
    /** Полный адрес в формате: город, улица, дом. Максимум 350 символов. */
    address: string;
    /** Координаты точки (широта). */
    latitude?: Coordinate;
    /** Координаты точки (долгота). */
    longitude?: Coordinate;
    /** Ожидаемое время прибытия курьера на адрес (от). */
    required_start_datetime?: Timestamp;
    /** Ожидаемое время прибытия курьера на адрес (до). */
    required_finish_datetime?: Timestamp;
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

            console.log(data.parameter_errors);
            if ('parameter_errors' in error) {
            }

            throw error.response;
        });
    }

    /** Расчет стоимости доставки */
    async calculateOrder() {}

    /** Создание заказа */
    async createOrder() {}

    /** Редактирование заказа */
    async editOrder() {}

    /** Отмена заказа */
    async cancelOrder() {}

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
    async getCourier() {}

    /** Данные клиентского профиля */
    async getClient() {}

    /** Привязанные банковские карты */
    async getBankCards() {}

    /** Получение списка интервалов */
    async getDeliveryIntervals() {}

    /** Создание черновиков доставок */
    async createDeliveries() {}

    /** Редактирование черновиков доставок */
    async editDeliveries() {}

    /** Удаление черновиков доставок */
    async deleteDeliveries() {}

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
