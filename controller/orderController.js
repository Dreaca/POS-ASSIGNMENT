
import {OrderModel} from "../model/orderModel.js";
import {cartItems} from "../db/db.js";
import {CartModel} from "../model/cartModel.js";
import {loadItemTable} from "./itemController.js";
import {OrderDetailModel} from "../model/orderDetailModel.js";

let displayCart = [];
let clickedIndex;
let orderIdCounter = 1;
let subTotal;
$(document).ready(function (){
    $("#order-item-desc").on('keypress',function (event){

        if (event.which===13){
            event.preventDefault()

            let i = $("#order-item-desc").val().trim().toLowerCase();

            const http = new XMLHttpRequest();
            http.open('GET','http://localhost:8080/POS-Backend/item',true);
            http.setRequestHeader("Request-Type","table")
            http.onreadystatechange = function(){
                if (http.readyState === 4 && http.status ===200){
                    var items = JSON.parse(http.responseText);

                    $("#item-table-tbody").empty();

                    items.forEach(item =>{
                        if (item.itemName.toLowerCase()===i){
                            $("#order-item-id").val(item.itemCode)
                            $("#order-item-price").val(item.price)
                            $("#item-id-suggestions").hide();
                        }
                    })
                }
            }
            http.send();

        }
    })
})
$("#nav-orders").on('click',()=>{
    $("#order-date").val(new Date().toISOString().slice(0, 10));
})
function suggestItemIds(input,callback) {
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
    const suggestionsList = $("#item-id-suggestions");

    suggestionsList.empty();

    suggestions.forEach(suggestion => {
        suggestionsList.append(`<li>${suggestion}</li>`);
    });
}
$("#order-item-desc").on('input', function() {
    const input = $(this).val();
   suggestItemIds(input,function(suggestions){
       updateSuggestions(suggestions);

       if (input.trim() === '') {
           $("#item-id-suggestions").hide();
       } else {
           $("#item-id-suggestions").show();
       }
   });


});
$("#order-item-qty").on('input',()=>{
    $("#order-sub-total").val(
        $("#order-item-price").val() * $("#order-item-qty").val()
    )
})

$("#btn-add-to-cart").on('click',()=>{
    let itemId = $("#order-item-id").val()
    let itemDesc = $("#order-item-desc").val()
    let price =$("#order-item-price").val()
    let qty =$("#order-item-qty").val()
    let subTotal = $("#order-sub-total").val()

    if (itemId === "" || itemDesc === ""|| price === ""){
        alert("Empty Item !!!")
    }
    else if (qty === ""){
        alert("Please Enter Qty")
    }
    else{
        let cartItem = new CartModel(itemId,itemDesc,price,qty,subTotal)
            cartItems.push(cartItem)
            loadTable()
            clearCart()
        loadItemTable()
    }

})

function loadTable(){
    $("#order-item-tbody").append().empty()

    cartItems.map((item, index)=>{
        var record =
            `<tr>
        <td class="order-item-code">${item.itemCode}</td>
        <td class = "order-item-desc">${item.desc}</td>
        <td class = "order-item-price">${item.unitPrice}</td>
        <td class = "order-item-qty">${item.qty}</td>
        <td class = "order-item-subTotal">${item.totalPrice}  </tr>`

        $("#order-item-tbody").append(record);
    } )
}
function clearCart(){
    $("#order-item-id").val("")
    $("#order-item-desc").val("")
    $("#order-item-price").val("")
    $("#order-item-qty").val("")
    $("#order-sub-total").val("")
    $("#item-id-suggestions").hide()
}
$("#order-item-tbody").on('click','tr',function (){
    let index = $(this).index();
    clickedIndex = index;

    let itemCode = $(this).find(".order-item-code").text()
    let desc = $(this).find(".order-item-desc").text()
    let price = $(this).find(".order-item-price").text()
    let qty = $(this).find(".order-item-qty").text()
    let total = $(this).find(".order-item-subTotal").text()

    $("#order-item-id").val(itemCode)
    $("#order-item-desc").val(desc)
    $("#order-item-price").val(price)
    $("#order-item-qty").val(qty)
    $("#order-sub-total").val(total)

    $("#btn-cart-item-delete").css('display','inline-block')
    $("#btn-update-cart-item").css('display','inline-block')
})
$("#btn-cart-item-delete").on('click',()=>{
    let itemId =  $("#order-item-id").val()
    let itemInc;
    items.forEach(item=>{
        if (item.itemCode === itemId){
            itemInc = item;
        }
    })
    itemInc.qto = itemInc.qto + parseInt($("#order-item-qty").val())
    cartItems.splice(clickedIndex,1);
    loadItemTable()
    clearCart()
    loadTable()

    $("#btn-cart-item-delete").css('display','none')
    $("#btn-update-cart-item").css('display','none')


})
$("#btn-update-cart-item").on('click',()=>{
    let itemId = $("#order-item-id").val()
    let itemDesc = $("#order-item-desc").val()
    let price =$("#order-item-price").val()
    let qty =$("#order-item-qty").val()
    let subTotal = $("#order-sub-total").val()

    let cartItem = cartItems[clickedIndex];

    cartItem.itemCode = itemId;
    cartItem.desc=itemDesc;
    cartItem.unitPrice = price;
    cartItem.qty=qty;
    cartItem.totalPrice = subTotal

    clearCart()
    loadTable()

    $("#btn-cart-item-delete").css('display','none')
    $("#btn-update-cart-item").css('display','none')
})
function  getOrderId(callback){
    return new Promise((resolve,reject)=>{
        const http = new XMLHttpRequest();
        var orderId;
        http.open("GET","http://localhost:8080/POS-Backend/order",true)
        http.setRequestHeader("Request-type","getOrderId");

        http.onreadystatechange=()=>{
            if (http.readyState === 4 && http.status === 200){
                orderId = http.responseText
                callback(orderId);
            }
        }
        http.send();
    })

}
$("#orderId").on('focus',()=>{
    getOrderId(orderID =>{
        $("#orderId").val(orderID)
    })
})
$("#order-cust-name").on('blur', (event)=>{
        let custId = $("#order-cust-name").val().trim().toLowerCase();
    const http = new XMLHttpRequest();
    http.open('GET','http://localhost:8080/POS-Backend/customer',true);
    http.setRequestHeader("Request-Type","table")
    http.onreadystatechange = function(){
        if (http.readyState === 4 && http.status ===200){

            var customers = JSON.parse(http.responseText);

            customers.forEach(customer=>{
                if (customer.customerName.toLowerCase() === custId){
                    $("#order-cust-id").val(customer.customerId)
                    $("#order-cust-id-suggestions").hide()
                }
            })
        }
    }
    http.send();


})
function suggestCustomerNames(input,callback) {
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
function updateCustomerSuggestions(suggestions) {
    const suggestionsList = $("#order-cust-id-suggestions");

    suggestionsList.empty();

    suggestions.forEach(suggestion => {
        suggestionsList.append(`<li>${suggestion}</li>`);
    });
}
$("#order-cust-name").on('input', function() {
    const input = $(this).val();
    suggestCustomerNames(input,function(suggestions){
        updateCustomerSuggestions(suggestions);

        if (input.trim() === '') {
            $("#order-cust-id-suggestions").hide();
        } else {
            $("#order-cust-id-suggestions").show();
        }
    });


});
$("#order-finished").on('click',()=>{
    let total = 0;
    cartItems.forEach( item=> {
         total = total + parseInt(item.totalPrice)
    })
    $("#order-total").val(total);
    subTotal = total-((total/100)*5);
    $("#order-full-total").val(subTotal);
    clearCart()
    $("#order-item-tbody").empty();

})
$("#buy-order").on('click',()=>{
    let id = $("#orderId").val()
    let custId = $("#order-cust-id").val()
    let date = $("#order-date").val()
    let custName = $("#order-cust-name").val()
    let total = $("#order-total").val()
    let discount  = "5%"
    let subTotal = $("#order-full-total").val()

    if (id === "" || custId === "" || total === "" || discount === "" || subTotal ==="" ){
        alert("Empty Order!")
        clearOrder()
    }
    else {
        const http = new XMLHttpRequest();
        http.open("POST","http://localhost:8080/POS-Backend/order",true);
        http.setRequestHeader("content-type","application/json");

        const outCart = cartItems.map(item=>({
            itemCode: item._itemCode,
            desc: item._desc,
            qty: item._qty,
            unitPrice: item._unitPrice,
            totalPrice: item._totalPrice,
        }));

        const sendOrder={
            orderId : id,
            customerId :custId,
            customerName : custName,
            date : date,
            total: total,
            discount:discount,
            subTotal : subTotal,

            cartItems : outCart

        }
        const orderJson = JSON.stringify(sendOrder);

        console.log(sendOrder)

        http.onreadystatechange=()=>{
            if (http.readyState === 4 && http.status === 200){
                var JsonResponse = JSON.stringify(http.responseText);
                console.log(JsonResponse)
            }else{
                console.error(http.status);
                console.error(http.readyState);
                console.error("Order Placing Failed")
            }
        }
        http.send(orderJson);

        $("#customer-bal").val(parseInt($("#customer-cash").val())-subTotal);
        clearOrder()

        $("#order-item-tbody").empty()
    }
})
function clearOrder(){
    $("#orderId").val("")
    $("#order-cust-id").val("")
    $("#order-date").val("")
    $("#order-cust-name").val("")
    $("#order-total").val("")
    $("#order-full-total").val("")
    $("#customer-cash").val("")
}