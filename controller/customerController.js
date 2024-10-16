
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
        http.open("POST", "http://localhost:8080/posback/api/v3/customer",true);
        http.setRequestHeader("content-type", "application/json");
        http.send(customerJson);

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
    clearCustomer()
    loadTable()

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
    http.open('GET', 'http://localhost:8080/posback/api/v3/customer', true);
    http.setRequestHeader('request-type', 'table');

    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 200) {
            var customers = JSON.parse(http.responseText);
            $("#cust-table-tbody").empty();
            customers.forEach(customer => {
                $("#cust-table-tbody").append(`
                    <tr>
                        <td class="customerId">${customer.customerId}</td>
                        <td class="customerName">${customer.customerName}</td>
                        <td class="customerAddress">${customer.customerAddress}</td>
                        <td class="customerPhone">${customer.customerPhone}</td>
                    </tr>
                `);
            });
        }
    };

    http.send();
}


$("#cust-table-tbody").on('click', 'tr', function () {

    let index = $(this).index();


    let custId = $(this).find(".customerId").text()
    let custName = $(this).find(".customerName").text()
    let custAddress = $(this).find(".customerAddress").text()
    let custPhone = $(this).find(".customerPhone").text()

    console.log("id"+custId,"name"+custName,"address"+custAddress,"phone"+custPhone)


    $("#updateCustBtn").click()
    $("#customerIdUp").text(custId);
    $("#customerNameUp").val(custName);
    $("#customerAddressUp").val(custAddress);
    $("#customerPhoneUp").val(custPhone);

})
$("#btnUpdateCustomer-modal").on('click', () => {
    let validator = new RegexValidator();

    let custIdUpdated = $("#customerIdUp").text();
    let custNameUpdated = $("#customerNameUp").val();
    let custAddressUpdated = $("#customerAddressUp").val();
    let custPhoneUpdated = $("#customerPhoneUp").val();

    const validationResult = validator.validateCustomer(custNameUpdated, custAddressUpdated, custPhoneUpdated);
    if (validationResult.isValid) {
        const customerData = {
            customerId : custIdUpdated,
            customerName: custNameUpdated,
            customerAddress: custAddressUpdated,
            customerPhone: custPhoneUpdated
        };
        const customerJson = JSON.stringify(customerData);
        const http = new XMLHttpRequest();
        http.onreadystatechange = () => {
            if (http.readyState === 4) {
                if (http.status === 200) {
                    var JsonTypeResponse = JSON.stringify(http.responseText);
                    console.log(JsonTypeResponse);
                    clearCustomer()
                    loadTable()
                } else {
                    console.error(http.status);
                    console.error(http.readyState);
                    console.error("FAILED REQUEST ");
                }
            } else {
                console.error(http.readyState.toString())
            }
        };
        http.open("PUT", "http://localhost:8080/posback/api/v3/customer/"+custIdUpdated,true);
        http.setRequestHeader("content-type", "application/json");
        http.send(customerJson);

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
$("#btnDeleteCustomer-modal").on('click', () => {

    let custIdtoBeDeleted = $("#customerIdUp").text();
    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                var JsonTypeResponse = JSON.stringify(http.responseText);
                console.log(JsonTypeResponse);
                loadTable()
                clearCustomer()
            } else {
                console.error(http.status);
                console.error(http.readyState);
                console.error("FAILED REQUEST ");
            }
        } else {
            console.error(http.readyState.toString())
        }
    };
    http.open("Delete", "http://localhost:8080/posback/api/v3/customer/"+custIdtoBeDeleted,true);
    http.send();

})

$("#searchButton").on('click', () => {
    const searchQuery = $("#searchBar").val().trim().toLowerCase();

    const http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {

                const searchResults = JSON.parse(http.responseText);

                // Clear the table before appending new results
                $("#cust-table-tbody").empty();

                // Append search results to the table
                searchResults.forEach(customer => {
                    $("#cust-table-tbody").append(`
                        <tr>
                            <td class = "customerId">${customer.customerId}</td>
                            <td class="customerName">${customer.customerName}</td>
                            <td class="customerAddress">${customer.customerAddress}</td>
                            <td class="customerPhone">${customer.customerPhone}</td>
                        </tr>
                    `);
                });

                // If no results found
                if (searchResults.length === 0) {
                    $("#cust-table-tbody").html("<tr><td colspan='4'>No matching customers found.</td></tr>");
                }
            } else {
                console.error("Failed to retrieve search results");
            }
        }
    };
    http.open("GET", "http://localhost:8080/posback/api/v3/customer/"+searchQuery, true);
    http.send();
});

//TODO
function suggestNames(input,callback) {
    const inputText = input.toLowerCase().trim();

    const http = new XMLHttpRequest();

    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {

                const suggestions = JSON.parse(http.responseText);
                 callback(suggestions)

            } else {
                console.error("Failed to retrieve name suggestions");
            }
        }
    };
    http.open("GET", "http://localhost:8080/POS-Backend/customer?query="+inputText, true);
    http.setRequestHeader("Request-Type","suggest");
    http.send();
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
    suggestNames(input,function (suggestions){
        updateSuggestions(suggestions);

        if (input.trim() === '') {
            $("#suggestions").hide();
        } else {
            $("#suggestions").show();
        }
    });
});
