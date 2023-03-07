import { OrderStatus, VehicleType } from './enums';

export type Money = string;
export type Timestamp = number;
export type Coordinate = number;

export enum OrderType {
    Обычный = 'standard',
    Премиум = 'same_day',
}

export interface Courier {
    // Уникальный номер курьера.
    courier_id: number;

    // Фамилия курьера.
    surname: string;

    // Имя курьера.
    name: string;

    // Отчество курьера.
    middlename: string;

    // Контактный телефон курьера.
    phone: string;

    // Ссылка на фотографию курьера.
    photo_url: string | null;
    // Координаты курьера (широта).
    latitude: Coordinate | null;

    // Координаты курьера (долгота).
    longitude: Coordinate | null;
}

export enum PaymentMethod {
    Наличная_оплата = 'cash',
    Оплата_с_баланса = 'non_cash',
    Оплата_с_привязанной_банковской_карты = 'bank_card',
}
export interface Order {
    // Полный номер заказа.
    order_id: number;
    // Тип заказа.
    type: OrderType;
    // Что везем.
    matter: string;
    // Короткий номер заказа.
    order_name: string;
    // Тип транспорта.
    vehicle_type_id: VehicleType;
    // Дата и время создания заказа.
    created_datetime: Timestamp;
    // Дата и время завершения заказа.
    finish_datetime: Timestamp | null;
    // Статус заказа.
    status: OrderStatus;
    // Расшифровка статуса заказа.
    status_description: string;
    // Общий вес отправления, кг.
    total_weight_kg: number;
    // Отправлять клиенту SMS уведомления о статусе заказа.
    is_client_notification_enabled: boolean;
    // Отправлять получателям SMS с интервалом прибытия и телефоном курьера.
    is_contact_person_notification_enabled: boolean;
    // Требуемое число грузчиков (включая водителя).
    loaders_count: number;
    // Список адресов (точек) в заказе.
    points: Point[];
    // Общая стоимость заказа.
    payment_amount: Money;
    // Стоимость доставки.
    delivery_fee_amount: Money;
    // Наценка за вес отправления.
    weight_fee_amount: Money;
    // Сумма страховки.
    insurance_amount: Money;
    // Стоимость страховки.
    insurance_fee_amount: Money;
    // Стоимость погрузки-разгрузки.
    loading_fee_amount: Money;
    // Комиссия за работу с деньгами (перевод выручки, получение денег на точках).
    money_transfer_fee_amount: Money;
    // Наценка за доставку с ночевкой.
    overnight_fee_amount: Money;
    // Наценка за кассовое обслуживание.
    cod_fee_amount: Money;
    // Реквизиты для перевода выручки. Например, номер карты или Qiwi-кошелька.
    backpayment_details: string | null;
    // Ссылка на фотографию с чеком (подтверждение перевода выручки).
    backpayment_photo_url: string | null;
    // Ссылка на маршрутный лист.
    itinerary_document_url: string | null;
    // Ссылка на транспортную накладную.
    waybill_document_url: string | null;
    // Данные курьера.
    courier: Courier | null;
    // Нужно ли использовать мотобокс на мотоцикле/мопеде.
    is_motobox_required: boolean;
    // Способ оплаты.
    payment_method: PaymentMethod;
    // Идентификатор карты при способе оплаты банковской картой.
    bank_card_id: number | null;
    // Применённый промокод.
    applied_promo_code: string | null;
    // Заказ создан с возвратом.
    is_return_required: boolean;
    // Сумма скидки по применённому промокоду.
    promo_code_discount_amount: Money;
}
export interface Delivery {
    /** Уникальный номер доставки. */
    delivery_id: number;
    /** Тип доставки (на текущий момент поддерживается только тип plain). */
    delivery_type: string;
    /** Полный номер заказа (для черновика доставки будет null). */
    order_id: number | null;
    /** Идентификатор клиента. */
    client_id: number;
    /** Внутренний номер заказа в интернет-магазине клиента. */
    client_order_id: string | null;
    /** Адрес доставки. */
    address: string;
    /** Координаты пункта доставки (широта). */
    latitude: Coordinate | null;
    /** Координаты пункта доставки (долгота). */
    longitude: Coordinate | null;
    /** Статус доставки. */
    status: string;
    /** Дата и время смены статуса. */
    status_datetime: Timestamp;
    /** Дата и время создания доставки. */
    created_datetime: Timestamp;
    /** Короткий номер заказа. */
    order_name: string | null;
    /** Общая стоимость заказа. */
    order_payment_amount: Money | null;
    /** Средняя стоимость доставки (мы рассчитываем только стоимость всего заказа в целом). */
    delivery_price_amount: Money | null;
    /** Уникальный номер точки. */
    point_id: number | null;
    /** Данные контактного лица на точке. */
    contact_person: Object;
    /** Дополнительная информация о доставке для курьера: номер офиса или квартиры, название компании, с какой купюры сдача, габариты отправления. */
    note: string | null;
    /** Номер здания. */
    building_number: string | null;
    /** Квартира/офис. */
    apartment_number: string | null;
    /** Подъезд. */
    entrance_number: string | null;
    /** Код домофона. */
    intercom_code: string | null;
    /** Этаж. */
    floor_number: string | null;
    /** Инструкция для курьера, как пройти до получателя на месте. */
    invisible_mile_navigation_instructions: string | null;
    /** Ожидаемое время прибытия курьера на адрес (от). */
    required_start_datetime: Timestamp;
    /** Ожидаемое время прибытия курьера на адрес (до). */
    required_finish_datetime: Timestamp;
    /** Сумма для получения от клиента на точке. */
    taking_amount: Money;
    /** Сумма выкупа на точке. */
    buyout_amount: Money;
    /** Требуется ли выдать кассовый чек получателю на точке. */
    is_cod_cash_voucher_required: boolean;
    /** Нужно ли использовать мотобокс на мотоцикле/мопеде (только для черновика). */
    is_motobox_required: boolean;
    /** Доставка до двери (только для черновика). */
    is_door_to_door: boolean;
    /** Требуется ли возврат на точку забора (только для черновика). */
    is_return_to_first_point_required: boolean;
    /** Что везем (только для черновика). */
    matter: string | null;
    /** Сумма страховки (только для черновика). */
    insurance_amount: Money;
    /** Вес посылки, кг (только для черновика). */
    weight_kg: number;
    /** Проблемы при чекине на точке. */
    checkin_issue_name: string | null;
    /** Данные курьера. */
    courier: Object | null;
    /** Список товаров на точке. */
    packages: [];
}

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

export interface Package {
    // Уникальный номер упаковки.
    order_package_id: number;
    // Артикул товара.
    ware_code: string;
    // Описание товара.
    description: string;
    // Количество товаров.
    items_count: number;
    // Сумма оплаты за единицу товара.
    item_payment_amount: string;
    // Маркировка товара.
    nomenclature_code: string;
}

export interface ContactPerson {
    // Имя контактного лица на точке.
    name: string;
    // Номер телефона контактного лица на точке.
    phone: string;
}

export interface Checkin {
    // ФИО получателя, встретившего курьера.
    recipient_full_name: string | null;
    // Должность получателя, встретившего курьера.
    recipient_position: string | null;
}

export interface OrderPoint {
    // Уникальный номер точки.
    point_id: number;
    // Уникальный номер доставки.
    delivery_id: number | null;
    // Адрес.
    address: string;

    contact_person: ContactPerson;
    // Данные контактного лица на точке.

    // Внутренний номер заказа в интернет-магазине клиента.
    client_order_id: string | null;

    // Координаты точки (широта).
    latitude: Coordinate;

    // Координаты точки (долгота).
    longitude: Coordinate;

    // Ожидаемое время прибытия курьера на адрес (от).
    required_start_datetime: Timestamp | null;

    // Ожидаемое время прибытия курьера на адрес (до).
    required_finish_datetime: Timestamp | null;

    // Предполагаемое время прибытия курьера на адрес (от).
    arrival_start_datetime: Timestamp | null;

    // Предполагаемое время прибытия курьера на адрес (до).
    arrival_finish_datetime: Timestamp | null;

    // Фактическое время посещения адреса курьером.
    courier_visit_datetime: Timestamp | null;

    // Сумма для получения от клиента на точке.
    taking_amount: Money;

    // Сумма выкупа на точке.
    buyout_amount: Money;

    // Дополнительная информация о заказе для курьера: номер офиса или квартиры, название компании, с какой купюры сдача, габариты отправления.
    note: string | null;

    // Список товаров на точке.
    packages: Package[];

    // Требуется ли выдать кассовый чек получателю на точке.
    is_cod_cash_voucher_required: boolean;

    // Выплата денег курьеру будет произведена на этом адресе.
    is_order_payment_here: boolean;

    // Номер здания.
    building_number: string | null;

    // Подъезд.
    entrance_number: string | null;

    // Код домофона.
    intercom_code: string | null;

    // Этаж.
    floor_number: string | null;

    // Квартира/офис.
    apartment_number: string | null;

    // Инструкция для курьера, как пройти до получателя на месте.
    invisible_mile_navigation_instructions: string | null;

    // Фотография местности при закрытии точки на адресе.
    place_photo_url: string | null;

    // Фотография подписи получателя при закрытии точки на адресе.
    sign_photo_url: string | null;

    // Код подтверждения прибытия курьеров на точку.
    checkin_code: string | null;

    // Дополнительная информация о закрытии точки на адресе.
    checkin: Checkin | null;

    // Возвратная точка (совпадает с первой или склад).
    is_return_point: boolean;

    // Ссылка для отслеживания отправления.
    tracking_url: string | null;
}
