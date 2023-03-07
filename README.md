# Dostavista

Эта библиотека представляет собой клиент `axios` с описанием основных методов и типами данных

Использование

```ts
const api = new Dostavista(process.env.TOKEN);

api.getOrders().then(data => data.orders);
```
