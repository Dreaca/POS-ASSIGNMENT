export class CustomerModel{
    constructor(custId,custName,custAddress,custPhone) {
        this._custId = custId
        this._custName = custName
        this._custAddress = custAddress
        this._custPhone = custPhone

    }

    get custId() {
        return this._custId;
    }

    set custId(value) {
        this._custId = value;
    }

    get custName() {
        return this._custName;
    }

    set custName(value) {
        this._custName = value;
    }

    get custAddress() {
        return this._custAddress;
    }

    set custAddress(value) {
        this._custAddress = value;
    }

    get custPhone() {
        return this._custPhone;
    }

    set custPhone(value) {
        this._custPhone = value;
    }
}