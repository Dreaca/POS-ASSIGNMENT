import {orderDetails} from "../db/db.js";


let clickedIndex;

$("#nav-order-details").on('click',()=>{
    loadODtable()
})
function loadODtable(){
    $("#order-detail-tbody").append().empty()

     orderDetails.map((order, index) =>{
         var record = `
         <tr>
         <td class="order-detail-orderId">${order.OrderModel.orderId}</td>
         <td class="order-detail-custName">${order.OrderModel.customerName}</td>
         <td class="order-detail-date">${order.OrderModel.date}</td>
         <td class="order-detail-total">${order.OrderModel.total}</td>
         <td class="order-detail-discount">${order.OrderModel.discount}</td>
         <td class="order-detail-subTotal">${order.OrderModel.subtotal}</td>
            </tr>`

         $("#order-detail-tbody").append(record)
     })
}
$("#order-detail-tbody").on('click', 'tr', function() {
    let index = $(this).index();
    let order = orderDetails[index];
    populateItemList(order.ItemList);
    $('#listItems').modal('show');
});

function populateItemList(itemList) {
    let itemListBody = $("#itemList-body");
    itemListBody.empty();

    itemList.forEach(item => {
        let row = `
                <tr>
                    <td>${item.itemCode}</td>
                    <td>${item.desc}</td>
                    <td>${item.unitPrice}</td>
                    <td>${item.qty}</td>
                    <td>${item.unitPrice * item.qty}</td>
                </tr>
            `;
        itemListBody.append(row);
    });
}

