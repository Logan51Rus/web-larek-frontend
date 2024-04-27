import { Model } from "./base/Model";
import { IAppState, IOrder, IOrderForm, IProduct, FormErrors } from "../types";

export type CatalogChangeEvent = {
    gallery: IProduct[]
};

export class Product extends Model<IProduct> {
    id: string;
    description: string;
    category: string;
    image: string;
    title: string;
    price: number | null;
    selected: boolean
}

export class AppState extends Model<IAppState> {
    basket: Product[] = [];
    gallery: Product[];
    order: IOrder = {
        items: [],
        payment: '',
        total: null,
        address: '',
        email: '',
        phone: ''
    };
    preview: string | null;
    formErrors: FormErrors = {};


    setGallery(items: IProduct[]) {
        this.gallery = items.map((item) => new Product(item, this.events));
        this.emitChanges('items:changed', { gallery: this.gallery });
    };

    setPreview(item: IProduct) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item)
    };

    addToBasket(item: Product) {
        this.basket.push(item);
        this.emitChanges('basket:changed', item)
    };

    getTotalPrice() {
       return this.basket.reduce((acc, items) => 
            acc + items.price
        , 0)
    };

    clearBasket() {
		this.basket.length = 0;
	}

    resetOrder() {
        this.order = {
            items: [],
            payment: '',
            total: null,
            address: '',
            email: '',
            phone: '',
        }
    }

    getProductsAmountInBasket() {
        return this.basket.length;
    };

    removeItemFromBasket(product: Product) {
        this.basket = this.basket.filter((item) => item.id !== product.id);
    }; 

    addProducts() {
        this.order.items = this.basket.map(item => item.id)
    }
    
    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order)
        }

        if (this.validateContacts()) {
            this.events.emit('contacts:ready', this.order)
        }
    };

    validateOrder() {
        const errors: typeof this.formErrors = {};

        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес доставки'
        }

        if (!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты'
        }

        this.formErrors = errors;
        this.events.emit('orderFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    };

    validateContacts() {
        const errors: typeof this.formErrors = {};

        if (!this.order.email) {
            errors.email = 'Необходимо ввести почту'
        }

        if (!this.order.phone) {
            errors.phone = 'Необходимо ввести телефон'
        }

        this.formErrors = errors;
        this.events.emit('contactsFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    };

    resetSelected() {
        this.gallery.forEach((item => item.selected = false))
    }
}