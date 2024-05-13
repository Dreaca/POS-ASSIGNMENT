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

    loadItemTable()
    clearItem()

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
export function loadItemTable(){
    $("#item-table-tbody").append().empty()

    items.map((item,index)=>{
        var record =
            `<tr>
        <td class="item-code">${item.itemCode}</td>
        <td class = "item-desc">${item.desc}</td>
        <td class = "item-author">${item.author}</td>
        <td class = "item-qto">${item.qto}</td>
        <td class = "item-price">${item.price}</td>
            </tr>`

        $("#item-table-tbody").append(record);

    })

}
$("#item-table-tbody").on('click','tr',function (){

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
    loadItemTable()
})
$("#delete-item-btn").on('click',()=>{
    items.splice(clickedIndex,1)
    loadItemTable()
    clearItem()
})

$("#item-searchButton").on('click', () => {
    const searchQuery = $("#searchBar").val().trim().toLowerCase();
    const searchResults = [];


    items.forEach(item => {
        if (
            item.itemCode.toLowerCase() === searchQuery ||
            item.desc.toLowerCase().includes(searchQuery) ||
            item.author.toLowerCase().includes(searchQuery) ||
            item.qto.toLowerCase().includes(searchQuery) ||
            item.price.toLowerCase() === searchQuery
        ) {
            searchResults.push(item);
        }
    });

    $("#item-table-tbody").empty();


    searchResults.forEach(item => {
        $("#item-table tbody").append(`
            <tr>
                <td>${item.itemCode}</td>
                <td>${item.desc}</td>
                <td>${item.author}</td>
                <td>${item.qto}</td>
                <td>${item.price}</td>
            </tr>
        `);
    });


    if (searchResults.length === 0) {
        $("#item-table-tbody").html("<tr><td colspan='4'>No matching customers found.</td></tr>");
    }
});

function suggestNames(input) {
    const suggestions = [];
    const inputText = input.toLowerCase().trim();


    items.forEach(item => {
        if (item.desc.toLowerCase().startsWith(inputText)) {
            suggestions.push(item.desc);
        }
    });

    return suggestions;
}


function updateSuggestions(suggestions) {
    const suggestionsList = $("#item-suggestions");

    suggestionsList.empty();

    suggestions.forEach(suggestion => {
        suggestionsList.append(`<li>${suggestion}</li>`);
    });
}
$("#item-searchBar").on('input', function() {
    const input = $(this).val();
    const suggestions = suggestNames(input);

    updateSuggestions(suggestions);

    if (input.trim() === '') {
        $("#item-suggestions").hide();
    } else {
        $("#item-suggestions").show();
    }
});