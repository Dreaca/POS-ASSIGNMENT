import {customers} from "../db/db.js";
import {CustomerModel} from "../model/customerModel.js";
import {RegexValidator} from "../validation/RegexValidator.js";


let clickedIndex;
let idCounter = 1;
$(document).ready(function () {
    loadTable();
});

$("#btnCustomerAdd").on('click', () => {
    let custName = $("#custName").val()
    let custAddress = $("#custAddress").val()
    let custPhone = $("#custPhone").val()

    let validator = new RegexValidator();

    const validationResult = validator.validateCustomer(custName, custAddress, custPhone);
    if (validationResult.isValid) {
        const customerData = {
            customerName: custName,
            customerAddress: custAddress,
            customerPhone: custPhone
        };
        const customerJson = JSON.stringify(customerData);
        const http = new XMLHttpRequest();
        http.onreadystatechange = () => {
            if (http.readyState === 4) {
                if (http.status === 200) {
                    var JsonTypeResponse = JSON.stringify(http.responseText);
                    console.log(JsonTypeResponse);
                } else {
                    console.error(http.status);
                    console.error(http.readyState);
                    console.error("FAILED REQUEST ");
                }
            } else {
                console.error(http.readyState.toString())
            }
        };
        http.open("POST", "http://localhost:8080/POS-Backend/customer",true);
        http.setRequestHeader("content-type", "application/json");
        http.send(customerJson);
        clearCustomer()
        loadTable()
    } else {
        alert('Invalid customer data. Please check the input fields.');
        if (!validationResult.isNameValid) {
            alert('Invalid Name');
        }
        if (!validationResult.isAddressValid) {
            alert('Invalid Address');
        }
        if (!validationResult.isPhoneValid) {
            alert('Invalid Phone');
        }
    }

})

function clearCustomer() {
    $("#custName").val("")
    $("#custAddress").val("")
    $("#custPhone").val("")

    $("#customerIdUp").text("");
    $("#customerNameUp").val("");
    $("#customerAddressUp").val("");
    $("#customerPhoneUp").val("");
}

function loadTable() {
    const http = new XMLHttpRequest();
    http.open('GET', 'http://localhost:8080/POS-Backend/customer', true);
    http.setRequestHeader('request-type', 'table');

    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 200) {
            var customers = JSON.parse(http.responseText);
            $("#cust-table-tbody").empty();
            customers.forEach(customer => {
                $("#cust-table-tbody").append(`
                    <tr>
                        <td>${customer.customerId}</td>
                        <td>${customer.customerName}</td>
                        <td>${customer.customerAddress}</td>
                        <td>${customer.customerPhone}</td>
                    </tr>
                `);
            });
        }
    };

    http.send();
}


$("#cust-table-tbody").on('click', 'tr', function () {

    let index = $(this).index();

    clickedIndex = index;


    let custId = $(this).find(".custId").text()
    let custName = $(this).find(".custName").text()
    let custAddress = $(this).find(".custAddress").text()
    let custPhone = $(this).find(".custPhone").text()


    $("#updateCustBtn").click()
    $("#customerIdUp").text(custId);
    $("#customerNameUp").val(custName);
    $("#customerAddressUp").val(custAddress);
    $("#customerPhoneUp").val(custPhone);

})
$("#btnUpdateCustomer-modal").on('click', () => {

    let custIdUpdated = $("#customerIdUp").text();
    let custNameUpdated = $("#customerNameUp").val();
    let custAddressUpdated = $("#customerAddressUp").val();
    let custPhoneUpdated = $("#customerPhoneUp").val();


    let customerObject = customers[clickedIndex];

    customerObject.custId = custIdUpdated
    customerObject.custName = custNameUpdated
    customerObject.custAddress = custAddressUpdated
    customerObject.custPhone = custPhoneUpdated

    clearCustomer()
    loadTable()
})
$("#btnDeleteCustomer-modal").on('click', () => {
    customers.splice(clickedIndex, 1)
    loadTable()
    clearCustomer()
})

$("#searchButton").on('click', () => {
    const searchQuery = $("#searchBar").val().trim().toLowerCase();
    const searchResults = [];


    customers.forEach(customer => {
        if (
            customer.custId.toLowerCase() === searchQuery ||
            customer.custName.toLowerCase().includes(searchQuery) ||
            customer.custAddress.toLowerCase().includes(searchQuery) ||
            customer.custPhone.toLowerCase() === searchQuery
        ) {
            searchResults.push(customer);
        }
    });

    $("#cust-table-tbody").empty();


    searchResults.forEach(customer => {
        $("#cust-table tbody").append(`
            <tr>
                <td>${customer.custId}</td>
                <td>${customer.custName}</td>
                <td>${customer.custAddress}</td>
                <td>${customer.custPhone}</td>
            </tr>
        `);
    });


    if (searchResults.length === 0) {
        $("#cust-table-tbody").html("<tr><td colspan='4'>No matching customers found.</td></tr>");
    }
});

function suggestNames(input) {
    const suggestions = [];
    const inputText = input.toLowerCase().trim();


    customers.forEach(customer => {
        if (customer.custName.toLowerCase().startsWith(inputText)) {
            suggestions.push(customer.custName);
        }
    });

    return suggestions;
}


function updateSuggestions(suggestions) {
    const suggestionsList = $("#suggestions");

    suggestionsList.empty();

    suggestions.forEach(suggestion => {
        suggestionsList.append(`<li>${suggestion}</li>`);
    });
}

$("#searchBar").on('input', function () {
    const input = $(this).val();
    const suggestions = suggestNames(input);

    updateSuggestions(suggestions);

    if (input.trim() === '') {
        $("#suggestions").hide();
    } else {
        $("#suggestions").show();
    }
});
