


let clickedIndex;
let orderId;

$("#nav-order-details").on('click',()=>{
    loadODtable()
})
function loadODtable(){

    const http = new XMLHttpRequest();
    http.open("GET","http://localhost:8080/posback/api/v3/orderdetail",true);
    http.setRequestHeader("Request-Type","table");

    $("#order-detail-tbody").append().empty()
    http.onreadystatechange = ()=>{
        if (http.readyState === 4 && http.status === 200){
            const orderT = JSON.parse(http.responseText)
            orderT.forEach(order =>{
                $("#order-detail-tbody").append(
                `
         <tr>
         <td class="order-detail-orderId">${order.orderId}</td>
         <td class="order-detail-custName">${order.customerName}</td>
         <td class="order-detail-date">${order.date}</td>
         <td class="order-detail-total">${order.total}</td>
         <td class="order-detail-discount">${order.discount}</td>
         <td class="order-detail-subTotal">${order.subtotal}</td>
            </tr>`

                )
            })

        }
    }
    http.send();


}
$("#order-detail-tbody").on('click', 'tr', function() {
    orderId = $(this).find(".order-detail-orderId").text()
    console.log(orderId)
    populateItemList(orderId);
    $('#listItems').modal('show');

});

function populateItemList(orderId) {
    let itemListBody = $("#itemList-body");
    itemListBody.empty();

    const http = new XMLHttpRequest();
    http.open("GET","http://localhost:8080/posback/api/v3/orderDetails?orderId="+orderId,true)
    http.onreadystatechange = ()=>{
        if (http.readyState === 4 && http.status === 200){
            const itemList = JSON.parse(http.responseText);
            itemList.forEach(item => {
                let row = `
                <tr>
                    <td>${item.itemId}</td>
                    <td>${item.customerId}</td>
                    <td>${item.unitPrice}</td>
                    <td>${item.qty}</td>
                    <td>${item.unitPrice * item.qty}</td>
                </tr>
            `;
                itemListBody.append(row);
            });

        }
    }
    http.send()
}
$("#btnDeleteOrderDetail-modal").on('click',()=>{
    const http = new XMLHttpRequest();
    http.open("Delete","http://localhost:8080/posback/api/v3/order?orderId="+orderId,true)
    http.onreadystatechange = ()=>{
        if (http.readyState === 4 && http.status === 200){
            const response = JSON.stringify(http.responseText);
            console.log(response)
            $('#listItems').modal('close');
        }
    }
    http.send()
})

