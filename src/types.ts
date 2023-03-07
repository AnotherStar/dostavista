export type Money = string;
export type Timestamp = number;
export type Coordinate = number;

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
