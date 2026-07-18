//access browser onload event..................................
window.addEventListener("load", () => {

    userPrivi = getHTTPServiceRequest("/userprivilagebymodule?modulename=purchaseorder")

    //load approved quotations dropdown
    quotations = getServiceRequest("/quotation/alldata").filter(q => q.status == "Approved");
    fillDataToSelect(selectQuotationElement, "Select Quotation", quotations, "quotationid");

    refreshPurchaseOrderTable();
    refreshPurchaseOrderForm();

});

let selectQuotationElement = document.querySelector("#selectQuotation");
let textSupplierElement = document.querySelector("#textSupplier");
let textProductElement = document.querySelector("#textProduct");
let poDateElement = document.querySelector("#poDate");
let requiredDateElement = document.querySelector("#requiredDate");
let poStatusElement = document.querySelector("#poStatus");
let qtyElement = document.querySelector("#qty");
let unitPriceElement = document.querySelector("#unitPrice");
let totalElement = document.querySelector("#total");


//auto-fill supplier/product/price/quantity from the selected quotation
function loadQuotationDetails() {

    if (!selectQuotationElement.value) return;

    const selectedQ = JSON.parse(selectQuotationElement.value);

    purchaseOrder.quotation_id = selectedQ;
    purchaseOrder.supplier_id = selectedQ.supplier_id;
    purchaseOrder.product_id = selectedQ.product_id;

    textSupplierElement.value = selectedQ.supplier_id ? selectedQ.supplier_id.name : "";
    textProductElement.value = selectedQ.product_id ? selectedQ.product_id.name : "";
    qtyElement.value = selectedQ.quantity;
    unitPriceElement.value = selectedQ.price;

    purchaseOrder.quantity = selectedQ.quantity;
    calculateTotal();

    selectQuotationElement.style.border = "2px solid green";
}

//compute total = quantity * unitPrice
function calculateTotal() {
    let qty = Number(qtyElement.value) || 0;
    let price = Number(unitPriceElement.value) || 0;
    let total = qty * price;
    totalElement.value = total;
    purchaseOrder.quantity = qty;
    purchaseOrder.total = total;
}


//define function for refresh table................................................
const refreshPurchaseOrderTable = () => {

    purchaseOrders = getServiceRequest("/purchaseorder/alldata");

    let propertyList = [
        { dataType: "string", propertyName: "orderid" },
        { dataType: "function", propertyName: (data) => data.supplier_id ? data.supplier_id.name : "" },
        { dataType: "function", propertyName: (data) => data.product_id ? data.product_id.name : "" },
        { dataType: "string", propertyName: "requireddate" },
        { dataType: "string", propertyName: "quantity" },
        { dataType: "string", propertyName: "total" },
        { dataType: "string", propertyName: "status" }
    ];

    fillDataIntoTable(tableBodyPurchase, purchaseOrders, propertyList, refillPurchaseOrderForm, deletePurchaseOrder, printPurchaseOrder);

    for (const index in purchaseOrders) {
        if (!userPrivi.privi_update)
            tableBodyPurchase.children[index].children[8].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodyPurchase.children[index].children[8].children[1].style.disabled = "disabled";
    }
}


//define function for refill(edit) form
const refillPurchaseOrderForm = (dataOb) => {

    purchaseOrder = JSON.parse(JSON.stringify(dataOb));
    oldPurchaseOrder = JSON.parse(JSON.stringify(dataOb));

    selectQuotationElement.value = purchaseOrder.quotation_id ? JSON.stringify(purchaseOrder.quotation_id) : "";
    textSupplierElement.value = purchaseOrder.supplier_id ? purchaseOrder.supplier_id.name : "";
    textProductElement.value = purchaseOrder.product_id ? purchaseOrder.product_id.name : "";
    poDateElement.value = purchaseOrder.orderdate;
    requiredDateElement.value = purchaseOrder.requireddate;
    poStatusElement.value = purchaseOrder.status;
    qtyElement.value = purchaseOrder.quantity;
    unitPriceElement.value = purchaseOrder.quotation_id ? purchaseOrder.quotation_id.price : "";
    totalElement.value = purchaseOrder.total;

    buttonSubmit.style.display = "none";
    buttonUpdate.style.display = "block";
}


//check form updates
const checkPurchaseOrderFormUpdate = () => {

    let updates = "";

    if (purchaseOrder.orderdate != oldPurchaseOrder.orderdate) {
        updates = updates + "PO Date Is Changed..! \n" + oldPurchaseOrder.orderdate + " into " + purchaseOrder.orderdate + "\n";
    }
    if (purchaseOrder.requireddate != oldPurchaseOrder.requireddate) {
        updates = updates + "Required Date Is Changed..! \n" + oldPurchaseOrder.requireddate + " into " + purchaseOrder.requireddate + "\n";
    }
    if (purchaseOrder.quantity != oldPurchaseOrder.quantity) {
        updates = updates + "Quantity Is Changed..! \n" + oldPurchaseOrder.quantity + " into " + purchaseOrder.quantity + "\n";
    }
    if (purchaseOrder.total != oldPurchaseOrder.total) {
        updates = updates + "Total Is Changed..! \n" + oldPurchaseOrder.total + " into " + purchaseOrder.total + "\n";
    }
    if (purchaseOrder.status != oldPurchaseOrder.status) {
        updates = updates + "Status Is Changed..! \n" + oldPurchaseOrder.status + " into " + purchaseOrder.status + "\n";
    }

    return updates;
}


//define function for update
const updatePO = () => {

    let errors = checkFormError();

    if (errors == "") {
        let updates = checkPurchaseOrderFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");
        } else {
            swal({
                title: "Are You Sure To Update This Purchase Order..?",
                text: "Following Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willUpdate) => {
                    if (willUpdate) {
                        let serviceResponse = getHTTPServiceRequest("/purchaseorder/update", "PUT", purchaseOrder);

                        if (serviceResponse == "OK") {
                            swal("Update Completed..!", { icon: "success" });
                            refreshPurchaseOrderTable();
                            refreshPurchaseOrderForm();
                        } else {
                            swal("Update Not Completed..!", " Form Hasn't Any Changes..! \n" + serviceResponse, "error");
                        }
                    }
                });
        }
    } else {
        swal("Update Not Completed..!", "Form Has Errors..! \n" + errors, "error");
    }
}


//define function for delete
const deletePurchaseOrder = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This Purchase Order..?",
        text: "Following Purchase Order Will Be Deleted..! \n" +
            "PO ID :" + dataOb.orderid +
            "\n Supplier :" + (dataOb.supplier_id ? dataOb.supplier_id.name : "") +
            "\n Product :" + (dataOb.product_id ? dataOb.product_id.name : ""),

        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                let serviceResponse = getHTTPServiceRequest("/purchaseorder/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {
                    swal("Delete Completed..!", { icon: "success" });
                    refreshPurchaseOrderTable();
                } else {
                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");
                }
            }
        });
}


//define function for print
const printPurchaseOrder = (dataOb) => {

    purchaseOrder = dataOb;
    let newWindow = window.open();

    newWindow.document.writeln(
        "<html><head><title> Print Purchase Order </title></head><body>" +
        "<h1> __________Purchase Order__________ </h1>" +
        "<p><strong> PO ID : </strong> " + purchaseOrder.orderid + "</p>" +
        "<p><strong> Supplier : </strong> " + (purchaseOrder.supplier_id ? purchaseOrder.supplier_id.name : "") + "</p>" +
        "<p><strong> Product : </strong> " + (purchaseOrder.product_id ? purchaseOrder.product_id.name : "") + "</p>" +
        "<p><strong> Required Date : </strong> " + purchaseOrder.requireddate + "</p>" +
        "<p><strong> Quantity : </strong> " + purchaseOrder.quantity + "</p>" +
        "<p><strong> Total : </strong> " + purchaseOrder.total + "</p>" +
        "<p><strong> Status : </strong> " + purchaseOrder.status + "</p>" +
        "</body></html>"
    );

    setInterval(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1000);
}


//refresh form.........................................................
const refreshPurchaseOrderForm = () => {

    formPO.reset();
    buttonUpdate.disabled = "disabled";

    purchaseOrder = {
        quotation_id: null,
        supplier_id: null,
        product_id: null,
        orderdate: null,
        requireddate: null,
        quantity: null,
        total: null,
        status: null
    }

    selectQuotationElement.style.border = "1px solid #ced4da";
    poDateElement.style.border = "1px solid #ced4da";
    requiredDateElement.style.border = "1px solid #ced4da";
    poStatusElement.style.border = "1px solid #ced4da";
    qtyElement.style.border = "1px solid #ced4da";
    unitPriceElement.style.border = "1px solid #ced4da";
}

//po date validation
poDateElement.addEventListener("change", () => {
    if (poDateElement.value != "") {
        purchaseOrder.orderdate = poDateElement.value;
        poDateElement.style.border = "2px solid green";
    } else {
        purchaseOrder.orderdate = null;
        poDateElement.style.border = "2px solid red";
    }
});

//required date validation
requiredDateElement.addEventListener("change", () => {
    if (requiredDateElement.value != "") {
        purchaseOrder.requireddate = requiredDateElement.value;
        requiredDateElement.style.border = "2px solid green";
    } else {
        purchaseOrder.requireddate = null;
        requiredDateElement.style.border = "2px solid red";
    }
});

//status validation
poStatusElement.addEventListener("change", () => {
    if (poStatusElement.value != "") {
        purchaseOrder.status = poStatusElement.value;
        poStatusElement.style.border = "2px solid green";
    } else {
        purchaseOrder.status = null;
        poStatusElement.style.border = "2px solid red";
    }
});

//quantity validation
qtyElement.addEventListener("keyup", () => {
    let qty = qtyElement.value;
    if (qty != "" && Number(qty) > 0) {
        qtyElement.style.border = "2px solid green";
    } else {
        qtyElement.style.border = "2px solid red";
    }
    calculateTotal();
});

//unit price validation
unitPriceElement.addEventListener("keyup", () => {
    let price = unitPriceElement.value;
    if (price != "" && Number(price) > 0) {
        unitPriceElement.style.border = "2px solid green";
    } else {
        unitPriceElement.style.border = "2px solid red";
    }
    calculateTotal();
});


//define function check form error.........................
const checkFormError = () => {

    let errors = "";

    if (!purchaseOrder.quotation_id) errors = errors + "Please Select An Approved Quotation ..!\n";
    if (purchaseOrder.orderdate == null) errors = errors + "Please Enter Valid PO Date ..!\n";
    if (purchaseOrder.requireddate == null) errors = errors + "Please Enter Valid Required Date ..!\n";
    if (purchaseOrder.quantity == null || purchaseOrder.quantity <= 0) errors = errors + "Please Enter Valid Quantity ..!\n";
    if (purchaseOrder.status == null) errors = errors + "Please Select Valid Status ..!\n";

    return errors;
}


//define function for submit form
const submitPO = () => {

    let errors = checkFormError();

    if (errors == "") {
        swal({
            title: "Are You Sure To Save This Purchase Order..?",
            text: "Following Purchase Order Will Be Saved..! ",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willSave) => {
                if (willSave) {
                    let serviceResponse = getHTTPServiceRequest("/purchaseorder/save", "POST", purchaseOrder);

                    if (serviceResponse == "OK") {
                        swal("Save Completed..!", { icon: "success" });
                        refreshPurchaseOrderTable();
                        refreshPurchaseOrderForm();
                    } else {
                        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + serviceResponse, "error");
                    }
                }
            });
    } else {
        swal("Save Not Completed..!", "Form Has Some Errors..!\n" + errors, "error");
    }
}
