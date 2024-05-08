import {items} from "../db/db.js";
import {ItemModel} from "../model/itemModel.js";



let clickedIndex;
$("#btnAddItem").on('click',()=>{
    let itemId =$("#item-id").val();
    let itemName = $("#item-name").val()
    let author = $("#item-author").val()
    let qto = $("#qto").val()
    let price  = $("#item-price").val()

    let item = new ItemModel(itemId,itemName,author,qto,price)
    items.push(item)
    console.log(items)
    clearItem()
    loadTable()

})
function clearItem() {
    $("#item-id").val("")
    $("#item-name").val("")
    $("#item-author").val("")
    $("#qto").val("")
    $("#item-price").val("")

    $("#item-id-up").val("")
    $("#item-name-up").val("")
    $("#item-author-up").val("")
    $("#qto-up").val("")
    $("#item-price-up").val("")
}
function loadTable(){
    $("#item-table tbody tr").append().empty()
    items.map((item,index)=>{
        var record =
            `<tr>
        <td class="item-code">${item.itemCode}</td>
        <td class = "item-desc">${item.desc}</td>
        <td class = "item-author">${item.author}</td>
        <td class = "item-qto">${item.qto}</td>
        <td class = "item-price">${item.price}</td>
            </tr>`
        $("#item-table").append(record);
    })

}
$("#item-table tbody").on('click','tr',function (){
    let index = $(this).index();
    clickedIndex = index;
    let itemId = $(this).find(".item-code").text()
    let desc = $(this).find(".item-desc").text()
    let author = $(this).find(".item-author").text()
    let qto = $(this).find(".item-qto").text()
    let price = $(this).find(".item-price").text()


    $("#updateItemModal-btn").click()

    $("#item-id-up").val(itemId);
    $("#item-name-up").val(desc);
    $("#item-author-up").val(author);
    $("#qto-up").val(qto);
    $("#item-price-up").val(price);

})
$("#update-item-btn").on('click',()=>{

    let itemIdUpdated = $("#item-id-up").val();
    let descUpdated = $("#item-name-up").val();
    let authorUpdated = $("#item-author-up").val();
    let qtoUpdated = $("#qto-up").val();
    let priceUpdated = $("#item-price-up").val();

    let itemObject = items[clickedIndex];

    itemObject.itemCode =itemIdUpdated
    itemObject.desc = descUpdated
    itemObject.author = authorUpdated
    itemObject.qto = qtoUpdated
    itemObject.price = priceUpdated

    clearItem()
    loadTable()
})
$("#delete-item-btn").on('click',()=>{
    items.splice(clickedIndex,1)
    loadTable()
    clearItem()
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

    $("#cust-table tbody").empty();


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
        $("#cust-table tbody").html("<tr><td colspan='4'>No matching customers found.</td></tr>");
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
