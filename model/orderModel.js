export class OrderModel{
    get orderId() {
        return this._orderId;
    }

    set orderId(value) {
        this._orderId = value;
    }

    get customerId() {
        return this._customerId;
    }

    set customerId(value) {
        this._customerId = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get customerName() {
        return this._customerName;
    }

    set customerName(value) {
        this._customerName = value;
    }

    get total() {
        return this._total;
    }

    set total(value) {
        this._total = value;
    }

    get discount() {
        return this._discount;
    }

    set discount(value) {
        this._discount = value;
    }

    get subtotal() {
        return this._subtotal;
    }

    set subtotal(value) {
        this._subtotal = value;
    }
    constructor(orderId,customerId,date,customerName,total,discount,subtotal) {
        this._orderId = orderId;
        this._customerId = customerId;
        this._date = date;
        this._customerName = customerName;
        this._total = total;
        this._discount = discount;
        this._subtotal = subtotal;
    }
}