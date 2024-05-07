import {customers} from "../db/db.js";
import  {CustomerModel} from "../model/customerModel.js";

let idCounter = 1
let clickedIndex;
$("#btnCustomerAdd").on('click',()=>{
    let custId = getCustId()
    let custName = $("#custName").val()
    let custAddress = $("#custAddress").val()
    let custPhone = $("#custPhone").val()

    let customer = new CustomerModel(custId(),custName,custAddress,custPhone)
    customers.push(customer)
    console.log(customers)
    clearCustomer()
    loadTable()

})
function  getCustId(){
    console.log(idCounter)
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
    $("#cust-table tbody tr").append().empty()
    customers.map((item,index)=>{
        var record =
            `<tr>
        <td class="custId">${item.custId}</td>
        <td class = "custName">${item.custName}</td>
        <td class = "custAddress">${item.custAddress}</td>
        <td class = "custPhone">${item.custPhone}</td>
            </tr>`
        $("#cust-table").append(record);
    })

}
$("#cust-table tbody").on('click','tr',function (){
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