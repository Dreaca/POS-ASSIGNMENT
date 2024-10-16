

import {RegexValidator} from "../validation/RegexValidator.js";


let clickedIndex;
$(document).ready(function (){
    loadItemTable()
})
$("#btnAddItem").on('click', () => {

    let itemName = $("#item-name").val()
    let itemauthor = $("#item-author").val()
    let itemqto = $("#qto").val()
    let price = $("#item-price").val()

    let validator = new RegexValidator();

    const validationResult = validator.validateItem(itemName, itemauthor, itemqto, price);

    if (validationResult.isValid) {
        const itemData = {
            itemName: itemName,
            qto: itemqto,
            author: itemauthor,
            price: price

        }
        const itemJson = JSON.stringify(itemData);
        const http = new XMLHttpRequest();
        http.onreadystatechange = () => {
            if (http.readyState === 4) {
                if (http.status === 200) {
                    var JsonTypeResponse = JSON.stringify(http.responseText);
                    console.log(JsonTypeResponse)
                } else {
                    console.error(http.status)
                    console.error(http.readyState)
                    console.error("FAILED REQUEST")
                }
            } else {
                console.error(http.readyState.toString())
            }
        }
        http.open("POST", "http://localhost:8080/posback/api/v3/item", true);
        http.setRequestHeader("content-type", "application/json");
        http.send(itemJson);

    } else {
        alert('Invalid item data. Please check the input fields.');
        if (!validationResult.isItemIdValid) {
            alert('Invalid Item ID');
        }
        if (!validationResult.isItemNameValid) {
            alert('Invalid Item Name');
        }
        if (!validationResult.isAuthorValid) {
            alert('Invalid Author');
        }
        if (!validationResult.isQtoValid) {
            alert('Invalid Quantity');
        }
        if (!validationResult.isPriceValid) {
            alert('Invalid Price');
        }
    }
    loadItemTable()
    clearItem()
})

function clearItem() {
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

export function loadItemTable() {

    const http = new XMLHttpRequest();
    http.open('GET','http://localhost:8080/posback/api/v3/item',true);
    http.setRequestHeader("Request-Type","table")
    http.onreadystatechange = function(){
        if (http.readyState === 4 && http.status ===200){
            var items = JSON.parse(http.responseText);

            $("#item-table-tbody").empty();

            items.forEach(item =>{
                $("#item-table-tbody").append(
                    `<tr>
                        <td class="item-code">${item.itemCode}</td>
                        <td class = "item-desc">${item.itemName}</td>
                        <td class = "item-author">${item.author}</td>
                        <td class = "item-qto">${item.qto}</td>
                        <td class = "item-price">${item.price}</td>
                     </tr>`
                );

            })

        }
    }
    http.send();

}

$("#item-table-tbody").on('click', 'tr', function () {

    let index = $(this).index();


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
$("#update-item-btn").on('click', () => {

    let itemIdUpdated = $("#item-id-up").val();
    let nameUpdated = $("#item-name-up").val();
    let authorUpdated = $("#item-author-up").val();
    let qtoUpdated = $("#qto-up").val();
    let priceUpdated = $("#item-price-up").val();


    let validator = new RegexValidator();

    const validationResult = validator.validateItem(nameUpdated, authorUpdated, qtoUpdated, priceUpdated);

    if (validationResult.isValid) {
        const itemData = {
            itemCode : itemIdUpdated,
            itemName: nameUpdated,
            qto: qtoUpdated,
            author: authorUpdated,
            price: priceUpdated

        }
        const itemJson = JSON.stringify(itemData);
        const http = new XMLHttpRequest();
        http.onreadystatechange = () => {
            if (http.readyState === 4) {
                if (http.status === 200) {
                    var JsonTypeResponse = JSON.stringify(http.responseText);
                    console.log(JsonTypeResponse)
                    loadItemTable()
                    clearItem()
                } else {
                    console.error(http.status)
                    console.error(http.readyState)
                    console.error("FAILED REQUEST")
                }
            } else {
                console.error(http.readyState.toString())
            }
        }
        http.open("PUT", "http://localhost:8080/posback/api/v3/item/"+itemIdUpdated, true);
        http.setRequestHeader("content-type", "application/json");
        http.send(itemJson);

    } else {
        alert('Invalid item data. Please check the input fields.');
        if (!validationResult.isItemIdValid) {
            alert('Invalid Item ID');
        }
        if (!validationResult.isItemNameValid) {
            alert('Invalid Item Name');
        }
        if (!validationResult.isAuthorValid) {
            alert('Invalid Author');
        }
        if (!validationResult.isQtoValid) {
            alert('Invalid Quantity');
        }
        if (!validationResult.isPriceValid) {
            alert('Invalid Price');
        }
    }

    clearItem()
    loadItemTable()
})
$("#delete-item-btn").on('click', () => {
   let itemToBeDeleted = $("#item-id-up").val();
   const http = new XMLHttpRequest();
   http.onreadystatechange = ()=>{
       if (http.readyState === 4 ){
           if (http.status === 200){
                var JsonTypeResponse = JSON.stringify(http.responseText);
               console.log(JsonTypeResponse)
               loadItemTable()
               clearItem()
           }
           else{
               console.error(http.status)
               console.error(http.readyState)
               console.error("FAILED REQUEST")
           }
       }
       else {
           console.error(http.readyState.toString())
       }
   };
   http.open("Delete","http://localhost:8080/posback/api/v3/item/"+itemToBeDeleted,true);
   http.send()

})

$("#item-searchButton").on('click', () => {
    const searchQuery = $("#searchBar").val().trim().toLowerCase();

    const http = new XMLHttpRequest();
    http.open('GET','http://localhost:8080/posback/api/v3/item/'+searchQuery,true);
    http.setRequestHeader("Request-Type","search")

    http.onreadystatechange = function(){
        if (http.readyState === 4 && http.status ===200){
            const searchResults = JSON.parse(http.responseText);


            $("#item-table-tbody").empty();

            searchResults.forEach(item =>{
                $("#item-table-tbody").append(
                    `<tr>
                        <td class="item-code">${item.itemCode}</td>
                        <td class = "item-desc">${item.itemName}</td>
                        <td class = "item-author">${item.author}</td>
                        <td class = "item-qto">${item.qto}</td>
                        <td class = "item-price">${item.price}</td>
                     </tr>`
                );

            });
            if (searchResults.length === 0) {
                $("#item-table-tbody").html("<tr><td colspan='4'>No matching customers found.</td></tr>");
            }

        }
    }

    http.send();
});

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
    http.open("GET", "http://localhost:8080/POS-Backend/item?query="+inputText, true);
    http.setRequestHeader("Request-Type","suggest");
    http.send();
    return suggestions;
}


function updateSuggestions(suggestions) {
    const suggestionsList = $("#item-suggestions");

    suggestionsList.empty();

    suggestions.forEach(suggestion => {
        suggestionsList.append(`<li>${suggestion}</li>`);
    });
}

$("#item-searchBar").on('input', function () {
    const input = $(this).val();
    suggestNames(input,function (suggestions){
        updateSuggestions(suggestions);

        if (input.trim() === '') {
            $("#item-suggestions").hide();
        } else {
            $("#item-suggestions").show();
        }
    });


});