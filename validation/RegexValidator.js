export class RegexValidator {
    constructor() {
        this.nameRegex = /^[A-Za-z\s]+$/;
        this.addressRegex = /^[A-Za-z0-9\s,.-]+$/;
        this.phoneRegex = /^\d{10}$/;

        this.itemIdRegex = /^[A-Za-z0-9-]+$/;
        this.itemNameRegex = /^[A-Za-z0-9\s]+$/;
        this.authorRegex = /^[A-Za-z\s]+$/;
        this.qtoRegex = /^\d+$/;
        this.priceRegex = /^\d+(\.\d{1,2})?$/;
    }

    validateName(name) {
        return this.nameRegex.test(name);
    }

    validateAddress(address) {
        return this.addressRegex.test(address);
    }

    validatePhone(phone) {
        return this.phoneRegex.test(phone);
    }

    validateCustomer(name, address, phone) {
        return {
            isNameValid: this.validateName(name),
            isAddressValid: this.validateAddress(address),
            isPhoneValid: this.validatePhone(phone),
            isValid: this.validateName(name) && this.validateAddress(address) && this.validatePhone(phone)
        };
    }
    // Item validation methods
    validateItemId(itemId) {
        return this.itemIdRegex.test(itemId);
    }

    validateItemName(itemName) {
        return this.itemNameRegex.test(itemName);
    }

    validateAuthor(author) {
        return this.authorRegex.test(author);
    }

    validateQto(qto) {
        return this.qtoRegex.test(qto);
    }

    validatePrice(price) {
        return this.priceRegex.test(price);
    }

    validateItem(itemId, itemName, author, qto, price) {
        return {
            isItemIdValid: this.validateItemId(itemId),
            isItemNameValid: this.validateItemName(itemName),
            isAuthorValid: this.validateAuthor(author),
            isQtoValid: this.validateQto(qto),
            isPriceValid: this.validatePrice(price),
            isValid: this.validateItemId(itemId) && this.validateItemName(itemName) && this.validateAuthor(author) && this.validateQto(qto) && this.validatePrice(price)
        };
    }
}

