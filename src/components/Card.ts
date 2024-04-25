import { Component } from "./base/Component";
import { IProduct, ICardActions } from "../types";
import { ensureElement } from "../utils/utils";


export class Card extends Component<IProduct> {
    protected _category: HTMLElement;
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._category = container.querySelector(`.${blockName}__category`)
        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._price = container.querySelector(`.${blockName}__price`);
        this._button = container.querySelector(`.${blockName}__button`);
        
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick)
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image,value, this.title);
    }

    set category(value: string) {
        this.setText(this._category, value)
    }

    get category(): string {
        return this._category.textContent || '';
    }

    set button(value: string) {
        this.setText(this._button, value)
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно')
            this._button?.setAttribute('disabled', 'disabled')
        } else {
            this.setText(this._price,`${value} синапсов`)
        }
        
    }
}

export class CatalogueItem extends Card {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions)
    }
}

export class CatalogueItemPreview extends Card {
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions)

        this._description = container.querySelector(`.${this.blockName}__text`);
    }

    set description(value: string) {
        this.setText(this._description, value)
    }
}