import {items} from "../db/db.js";
import {orders} from "../db/db.js";
import {OrderModel} from "../model/orderModel.js";

$(document).ready(function (){
    $("#order-item-id").on('keypress',function (event){
        if (event.which===13){
            event.preventDefault()
            var itemIds = items.map(function(item) {
                return item.itemCode;
            });

            // Populate the dropdown menu with options
            var dropdown = $("#order-item-id");
            itemIds.forEach(function(itemId) {
                dropdown.append($("<option>").attr("value", itemId).text(itemId));
            });

            // Listen for the change event on the dropdown menu
            dropdown.on('change', function() {
                var selectedItemId = $(this).val(); // Get the selected item ID
                console.log("Selected item ID:", selectedItemId);
                // Your code to handle the selection goes here
            });
            // let itemCode = $("#order-item-id").val().trim().toLowerCase();
            /*items.forEach(item =>{
                if (item.itemCode.toLowerCase()===itemCode){
                    $("#order-item-desc").val(item.desc)
                    $("#order-item-price").val(item.price)
                }
            })*/
        }
    })
})