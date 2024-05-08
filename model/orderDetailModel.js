

export class OrderDetailModel{
    get OrderModel() {
        return this._OrderModel;
    }

    set OrderModel(value) {
        this._OrderModel = value;
    }

    get ItemList() {
        return this._ItemList;
    }

    set ItemList(value) {
        this._ItemList = value;
    }
    constructor(OrderModel,ItemList) {
        this._OrderModel = OrderModel;
        this._ItemList=ItemList
    }
}