import { Component } from "../base/Component";
import { cloneTemplate, createElement, ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { IProductInBasket } from "../../types";

export interface IBasketView {
    items: HTMLElement[];
    total: number;
};

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = container.querySelector(`.${blockName}__list`);
        this._total = container.querySelector(`.${blockName}__price`);
        this._button = container.querySelector(`.${blockName}__button`)

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = []
    };

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._button, false)
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }))
            this.setDisabled(this._button, true)
        }
    };

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`)
    }

    disableButton() {
        this._button.disabled = true
    };

    updateIndices() {
		Array.from(this._list.children).forEach((item, index) => {
			const indexInItem = item.querySelector(`.basket__item-index`);
			if (indexInItem) {
				indexInItem.textContent = (index + 1).toString();
			}
		})
    };
};

export interface IProductInBasketAction {
    onClick: (event: MouseEvent) => void;
};

export class ProductInBasket extends Component<IProductInBasket> {
    protected  _index: HTMLElement;
    protected  _title: HTMLElement;
    protected  _price: HTMLElement;
    protected  _button: HTMLButtonElement;

    constructor(protected blockName: string,container: HTMLElement, actions?: IProductInBasketAction) {
        super(container);

        this._index = container.querySelector(`.basket__item-index`);
        this._title = container.querySelector(`.${blockName}__title`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._button = container.querySelector(`.${blockName}__button`);

        if (this._button) {
            this._button.addEventListener('click', (evt) => {
                this.container.remove(); 
                actions?.onClick(evt);
            })
        }
    };

    set title(value: string) {
        this.setText(this._title, value);
    };

    set price(value: number) {
        this.setText(this._price, `${value} синапсов`);  
    };

    set index(value: string) {
        this.setText(this._index,value);
    };
}