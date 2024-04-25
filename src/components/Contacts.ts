import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export interface IContactsForm {
    phone: string;
    email: string;
}

export class ContactDetails extends Form<IContactsForm> {
    protected _phone: HTMLInputElement;
    protected _email: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._phone = container.elements.namedItem('phone') as HTMLInputElement;
        this._email = container.elements.namedItem('email') as HTMLInputElement;
    }

    clearContactsFields() {
        this._phone.value = '';
        this._email.value = '';
    }
}