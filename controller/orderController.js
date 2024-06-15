import {cartItems, items, orderItems, customers, orders, orderDetails} from "../db/db.js";
import {OrderModel} from "../model/orderModel.js";

import {CartModel} from "../model/cartModel.js";
import {loadItemTable} from "./itemController.js";
import {OrderDetailModel} from "../model/orderDetailModel.js";

let displayCart = [];
let clickedIndex;
let orderIdCounter = 1;
let subTotal;
$(document).ready(function (){
    $("#order-item-id").on('keypress',function (event){
        if (event.which===13){
            event.preventDefault()

            let itemCode = $("#order-item-id").val().trim().toLowerCase();
            items.forEach(item =>{
                if (item.itemCode.toLowerCase()===itemCode){
                    $("#order-item-desc").val(item.desc)
                    $("#order-item-price").val(item.price)
                    $("#item-id-suggestions").hide();
                }
                else{
                    alert('Invalid Item');
                }
            })
        }
    })
})
$("#nav-orders").on('click',()=>{
    $("#order-date").val(new Date().toISOString().slice(0, 10));
})
function suggestItemIds(input) {
    const suggestions = [];
    const inputText = input.toLowerCase().trim();


    items.forEach(item => {
        if (item.itemCode.toLowerCase().startsWith(inputText)) {
            suggestions.push(item.itemCode + "-" + item.desc + "- QTO : "+item.qto);
        }
    });

    return suggestions;
}
function updateSuggestions(suggestions) {
    const suggestionsList = $("#item-id-suggestions");

    suggestionsList.empty();

    suggestions.forEach(suggestion => {
        suggestionsList.append(`<li>${suggestion}</li>`);
    });
}
$("#order-item-id").on('input', function() {
    const input = $(this).val();
    const suggestions = suggestItemIds(input);

    updateSuggestions(suggestions);

    if (input.trim() === '') {
        $("#item-id-suggestions").hide();
    } else {
        $("#item-id-suggestions").show();
    }
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
        items.forEach(item =>{
            if (item.itemCode.toLowerCase() === itemId) {
                orderItems.push(item)
            }
        })

        let itemToReduce

        items.forEach(item =>{
            if (itemId === item.itemCode){
                itemToReduce = item;
            }
        })
        if (itemToReduce.qto <qty){
            alert("Stock Insufficient !!!");
        }
        else{
            itemToReduce.qto = itemToReduce.qto - qty;
            let cartItem = new CartModel(itemId,itemDesc,price,qty,subTotal)
            cartItems.push(cartItem)
            loadTable()
            clearCart()
        }
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
function  getOrderId(){
    return function (){
        let orderId = String(orderIdCounter).padStart(3,'0')
        let id = "O:"+orderId;
        orderIdCounter++
        return id;
    }
}
$("#orderId").on('focus',()=>{
    $("#orderId").val(getOrderId())
})
$("#order-cust-id").on('blur', (event)=>{
        let custId = $("#order-cust-id").val().trim().toLowerCase();
        customers.forEach(customer=>{
            if (customer.custId.toLowerCase() === custId){
                $("#order-cust-name").val(customer.custName)
                $("#order-cust-id-suggestions").hide()
            }
            else{
                alert('Invalid Customer!');
            }
        })
})
function suggestCustomerIds(input) {
    const suggestions = [];
    const inputText = input.toLowerCase().trim();


    customers.forEach(item => {
        if (item.custId.toLowerCase().startsWith(inputText)) {
            suggestions.push(item.custId + "-" + item.custName);
        }
    });

    return suggestions;
}
function updateCustomerSuggestions(suggestions) {
    const suggestionsList = $("#order-cust-id-suggestions");

    suggestionsList.empty();

    suggestions.forEach(suggestion => {
        suggestionsList.append(`<li>${suggestion}</li>`);
    });
}
$("#order-cust-id").on('input', function() {
    const input = $(this).val();
    const suggestions = suggestCustomerIds(input);

    updateCustomerSuggestions(suggestions);

    if (input.trim() === '') {
        $("#order-cust-id-suggestions").hide();
    } else {
        $("#order-cust-id-suggestions").show();
    }
});
$("#order-finished").on('click',()=>{
    let total = 0;
    cartItems.forEach( item=> {
         total = total + parseInt(item.totalPrice)
    })
    $("#order-total").val(total);
    subTotal = total-((total/100)*5);
    $("#order-full-total").val(subTotal);

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
        $("#orderId").val("")
        $("#order-cust-id").val("")
        $("#order-date").val("")
        $("#order-cust-name").val("")
        $("#order-total").val("")
        $("#order-full-total").val("")
        $("#customer-cash").val("")
        $("#customer-bal").val("");
    }
    else {
        let order = new OrderModel(id,custId,date,custName,total,discount,subTotal)
        orders.push(order);
        let orderDetail = new OrderDetailModel(order,cartItems);
        orderDetails.push(orderDetail)
        $("#customer-bal").val(parseInt($("#customer-cash").val())-subTotal);

        $("#orderId").val("")
        $("#order-cust-id").val("")
        $("#order-date").val("")
        $("#order-cust-name").val("")
        $("#order-total").val("")
        $("#order-full-total").val("")
        $("#customer-cash").val("")

        $("#order-item-tbody").append().empty()
    }
})