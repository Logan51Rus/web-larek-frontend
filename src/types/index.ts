interface ICard {
    id: string;
    category: string;
    title: string;
    image: string;

    price: string | null
}

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

interface IOrderForm {
    email: string;
    phone: string
}

interface IOrder extends IOrderForm {
    item: string[]
}

type IBusketItem = Pick<ICard, 'id' | 'title' | 'price'> & {counter: number} 

interface IBasketView {
    items: IBusketItem[];
    total: number;
}

interface IFormState {
    valid: boolean;
    errors: string[];
}

interface IModalData {
    content: HTMLElement;
}

interface ISuccess {
    total: number;
}

interface IAppState {
    catalog: ICard[];
    basket: string[];
    total: number;
    preview: string | null;
    order: IOrder | null;
    loading: Boolean
}

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
