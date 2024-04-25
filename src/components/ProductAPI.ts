import { Api, ApiListResponse } from './base/api'
import { IProduct, IOrder, IOrderResult } from '../types'

export interface IProductAPI {
    getProductItem: (id: string) => Promise<IProduct>;
    getProductList: () => Promise<IProduct[]>;
    orderItems: (order: IOrder) => Promise<IOrderResult>
}

export class ProductAPI extends Api implements IProductAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then((item: IProduct) => ({...item, image: this.cdn + item.image,})
        );
    }

    getProductList(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        );
    }

    orderItems(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then((data: IOrderResult) => data)
    }
}