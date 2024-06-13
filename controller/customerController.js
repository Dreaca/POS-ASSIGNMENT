import {customers} from "../db/db.js";
import  {CustomerModel} from "../model/customerModel.js";
import {RegexValidator} from "../validation/RegexValidator.js";


let clickedIndex;
let idCounter = 1
$("#btnCustomerAdd").on('click',()=>{
    let custId = getCustId()
    let custName = $("#custName").val()
    let custAddress = $("#custAddress").val()
    let custPhone = $("#custPhone").val()

    let validator = new RegexValidator();

    const validationResult = validator.validateCustomer(custName, custAddress, custPhone);
    if (validationResult.isValid){
        let customer = new CustomerModel(custId(),custName,custAddress,custPhone)
        customers.push(customer)
        clearCustomer()
        loadTable()
    }
    else {
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
function  getCustId(){
    return function (){
        let custId = String(idCounter).padStart(3,'0')
        let id = "C"+custId;
        idCounter++
        return id;
    }
}
function clearCustomer() {
    $("#custName").val("")
    $("#custAddress").val("")
    $("#custPhone").val("")

    $("#customerIdUp").text("");
    $("#customerNameUp").val("");
    $("#customerAddressUp").val("");
    $("#customerPhoneUp").val("");
}
function loadTable(){
    $("#cust-table-tbody").append().empty()
    customers.map((item,index)=>{
        var record =
            `<tr>
        <td class="custId">${item.custId}</td>
        <td class = "custName">${item.custName}</td>
        <td class = "custAddress">${item.custAddress}</td>
        <td class = "custPhone">${item.custPhone}</td>
            </tr>`
        $("#cust-table-tbody").append(record);
    })

}
$("#cust-table-tbody").on('click','tr',function (){

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
$("#btnUpdateCustomer-modal").on('click',()=>{

    let custIdUpdated = $("#customerIdUp").text();
    let custNameUpdated = $("#customerNameUp").val();
    let custAddressUpdated = $("#customerAddressUp").val();
    let custPhoneUpdated = $("#customerPhoneUp").val();


    let customerObject = customers[clickedIndex];

    customerObject.custId =custIdUpdated
    customerObject.custName = custNameUpdated
    customerObject.custAddress = custAddressUpdated
    customerObject.custPhone = custPhoneUpdated

    clearCustomer()
    loadTable()
})
$("#btnDeleteCustomer-modal").on('click',()=>{
    customers.splice(clickedIndex,1)
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
$("#searchBar").on('input', function() {
    const input = $(this).val();
    const suggestions = suggestNames(input);

    updateSuggestions(suggestions);

    if (input.trim() === '') {
        $("#suggestions").hide();
    } else {
        $("#suggestions").show();
    }
});
