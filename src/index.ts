import './scss/styles.scss';

import { ProductAPI } from './components/ProductAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { CatalogueItem,CatalogueItemPreview } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket, ProductInBasket } from './components/common/Basket';
import { Order } from './components/Order';
import { IProduct, IOrder, IOrderForm, IOrderResult } from './types';
import { ContactDetails } from './components/Contacts';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new ProductAPI(CDN_URL, API_URL)

//Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview')
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const ContactDetailsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//Модель данных приложения
const appData = new AppState({}, events);

//Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

//Переиспользуемые части интерфейса
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const orderForm = new Order('order', cloneTemplate(orderTemplate), events);
const contactsForm = new ContactDetails(cloneTemplate(ContactDetailsTemplate), events);
const sucessWindow = new Success('order-success', cloneTemplate(successTemplate), {
    onClick: () => modal.close(),
});

//Вывод карточек товаров на страницу
events.on<CatalogChangeEvent>('items:changed', () => {
    page.gallery = appData.gallery.map(item => {
        const product = new CatalogueItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });

        return product.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category
        })
    })
});

//Открытие модального окна с выбранным товаром
events.on('card:select', (item: IProduct) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
    const cardPreview = new CatalogueItemPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => events.emit('items:add', item)
    });
    if (item) {
        if (!appData.isProductInBasket(item)) {
            cardPreview.blockAddButton(false)
        } else {
            cardPreview.blockAddButton(true)
        }
    };
    modal.render({content: cardPreview.render({
        id: item.id,
        image: item.image,
        category: item.category,
        title: item.title,
        description: item.description,
        price: item.price,
        })
    })
});

//Изменение товаров в корзине
events.on('basket:open', () => {
    const basketContent = appData.basket.map((item, index) => {
        const products = new ProductInBasket('card', cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:removeItem', item)
        });
        return products.render({
            title: item.title,
            price: item.price,
            index: index + 1});
    });
    modal.render({
        content: basket.render({
            items: basketContent,
            total: appData.getTotalPrice()
        })
    })                   
});

//Добавить товар в корзину
events.on('items:add', (item: IProduct) => {
    appData.addToBasket(item);
    page.counter = appData.getProductsAmountInBasket();
    modal.close();
});

//Удалить товар из корзины
events.on('basket:removeItem', (item: IProduct) => {
    appData.removeItemFromBasket(item);
    page.counter = appData.getProductsAmountInBasket();
    basket.total = appData.getTotalPrice()
    basket.updateIndices();
    if (!appData.basket.length) {
        basket.disableButton();
    }
});

// Выбор способа оплаты и адреса доставки
events.on('order:open', () => {
    appData.addProducts();
    modal.render({
        content: orderForm.render({
        address: '',
        payment: '',
        valid: false,
        errors: []
        })
    })
    appData.order.total = appData.getTotalPrice();
});

//Изменилось одно из полей
events.on(
	'orderInput:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value)
});

//Изменилось состояние валидации форм
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
    const { payment, address } = errors;
    orderForm.valid = !payment && !address;
    orderForm.errors = Object.values({ payment, address}).filter((i) => !!i).join('; ')
});

events.on('contactsFormErrors:change', (errors: Partial<IOrder>) => {
    const { email, phone } = errors;
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({ email, phone }).filter((i) => !!i).join('; ')
});

//Выбираем способ оплаты и заполняем адрес доставки
events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    })
});

//Заполняем контактные данные и отправляем заказ
events.on('contacts:submit', () => {
    api.orderItems(appData.order)
    .then((res) => {
        events.emit('order:success', res);
        appData.clearBasket();
        appData.resetOrder();
        page.counter = 0;
        orderForm.clearOrderFields();
        contactsForm.clearContactsFields();
        
    })
    .catch(error => console.error(error));
});

//Получаем сообщение об успешной оплате
events.on('order:success', (res: IOrderResult) => {
	modal.render({
		content: sucessWindow.render({
			description: res.total,
		}),
	});
});

//Получение данных о товарах
api.getProductList()
.then(appData.setGallery.bind(appData))
.catch(err => console.error(err));

// Блокируем прокрутку страницы при открытом модальном окне
events.on('modal:open', () => {
    page.locked = true;
});

// Разблокируем прокрутку страницы при закрытии модального окна
events.on('modal:close', () => {
    page.locked = false;
});
