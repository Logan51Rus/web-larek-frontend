export interface IProduct {
    id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
    selected: boolean;
}

export interface ApiResponse {
    items: IProduct[];
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface IOrderForm {
    address: string;
    payment: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
    payment: string;
	total: number | null;
	address: string;
	email: string;
	phone: string;
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IAppState {
    gallery: IProduct[];
    basket: string[];
    total: number;
    preview: string | null;
    order: IOrder | null;
    loading: Boolean
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IProductInBasket {
    index: number;
    title: string;
    price: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
