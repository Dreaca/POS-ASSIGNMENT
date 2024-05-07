export class ItemModel{
    get itemCode() {
        return this._itemCode;
    }

    set itemCode(value) {
        this._itemCode = value;
    }

    get desc() {
        return this._desc;
    }

    set desc(value) {
        this._desc = value;
    }

    get qto() {
        return this._qto;
    }

    set qto(value) {
        this._qto = value;
    }

    get amount() {
        return this._amount;
    }

    set amount(value) {
        this._amount = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }
    constructor(itemCode,desc,qto,amount,price) {
        this._itemCode = itemCode;
        this._desc = desc;
        this._qto = qto;
        this._amount = amount;
        this._price = price;
    }
}