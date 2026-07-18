//access browser onload event..................................
window.addEventListener("load", () => {

    userPrivi = getHTTPServiceRequest("/userprivilagebymodule?modulename=grn")

    //load purchase orders dropdown (only those not yet fully received/cancelled)
    purchaseOrders = getServiceRequest("/purchaseorder/alldata").filter(po => po.status == "Approved" || po.status == "Pending");
    fillDataToSelect(selectPurchaseOrderElement, "Select Purchase Order", purchaseOrders, "orderid");

    refreshGrnTable();
    refreshGrnForm();

});

let selectPurchaseOrderElement = document.querySelector("#selectPurchaseOrder");
let textSupplierElement = document.querySelector("#textSupplier");
let textProductElement = document.querySelector("#textProduct");
let dateOrderdateElement = document.querySelector("#dateOrderdate");
let dateReceiveddateElement = document.querySelector("#dateReceiveddate");
let textReceivedQtyElement = document.querySelector("#textReceivedQty");
let textDamagedQtyElement = document.querySelector("#textDamagedQty");
let textTotalamountElement = document.querySelector("#textTotalamount");
let selectPaymentmethodElement = document.querySelector("#selectPaymentmethod");
let selectStatusElement = document.querySelector("#selectStatus");


//auto-fill supplier/product/orderdate from the selected purchase order
function loadPurchaseOrderDetails() {

    if (!selectPurchaseOrderElement.value) return;

    const selectedPO = JSON.parse(selectPurchaseOrderElement.value);

    grn.purchaseorder_id = selectedPO;
    grn.supplier_id = selectedPO.supplier_id;

    textSupplierElement.value = selectedPO.supplier_id ? selectedPO.supplier_id.name : "";
    textProductElement.value = selectedPO.product_id ? selectedPO.product_id.name : "";
    dateOrderdateElement.value = selectedPO.orderdate;
    textReceivedQtyElement.value = selectedPO.quantity;
    textTotalamountElement.value = selectedPO.total;

    grn.orderdate = selectedPO.orderdate;

    selectPurchaseOrderElement.style.border = "2px solid green";
}


//define function for refresh table................................................
const refreshGrnTable = () => {

    grns = getServiceRequest("/grn/alldata");

    let propertyList = [
        { dataType: "string", propertyName: "grnno" },
        { dataType: "function", propertyName: (data) => data.supplier_id ? data.supplier_id.name : "" },
        { dataType: "function", propertyName: (data) => data.purchaseorder_id && data.purchaseorder_id.product_id ? data.purchaseorder_id.product_id.name : "" },
        { dataType: "string", propertyName: "receiveddate" },
        { dataType: "string", propertyName: "totalamount" },
        { dataType: "string", propertyName: "paymethod" },
        { dataType: "string", propertyName: "status" }
    ];

    fillDataIntoTable(tableBodyGRN, grns, propertyList, refillGrnForm, deleteGrn, printGrn);

    for (const index in grns) {
        if (!userPrivi.privi_update)
            tableBodyGRN.children[index].children[8].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodyGRN.children[index].children[8].children[1].style.disabled = "disabled";
    }
}


//define function for refill(edit) form
const refillGrnForm = (dataOb) => {

    grn = JSON.parse(JSON.stringify(dataOb));
    oldGrn = JSON.parse(JSON.stringify(dataOb));

    selectPurchaseOrderElement.value = grn.purchaseorder_id ? JSON.stringify(grn.purchaseorder_id) : "";
    textSupplierElement.value = grn.supplier_id ? grn.supplier_id.name : "";
    textProductElement.value = grn.purchaseorder_id && grn.purchaseorder_id.product_id ? grn.purchaseorder_id.product_id.name : "";
    dateOrderdateElement.value = grn.orderdate;
    dateReceiveddateElement.value = grn.receiveddate;
    textReceivedQtyElement.value = grn.receivedquantity;
    textDamagedQtyElement.value = grn.damagedquantity;
    textTotalamountElement.value = grn.totalamount;
    selectPaymentmethodElement.value = grn.paymethod;
    selectStatusElement.value = grn.status;

    buttonSubmit.style.display = "none";
    buttonUpdate.style.display = "block";
}


//check form updates
const checkGrnFormUpdate = () => {

    let updates = "";

    if (grn.receiveddate != oldGrn.receiveddate) {
        updates = updates + "Received Date Is Changed..! \n" + oldGrn.receiveddate + " into " + grn.receiveddate + "\n";
    }
    if (grn.receivedquantity != oldGrn.receivedquantity) {
        updates = updates + "Received Quantity Is Changed..! \n" + oldGrn.receivedquantity + " into " + grn.receivedquantity + "\n";
    }
    if (grn.damagedquantity != oldGrn.damagedquantity) {
        updates = updates + "Damaged Quantity Is Changed..! \n" + oldGrn.damagedquantity + " into " + grn.damagedquantity + "\n";
    }
    if (grn.totalamount != oldGrn.totalamount) {
        updates = updates + "Total Amount Is Changed..! \n" + oldGrn.totalamount + " into " + grn.totalamount + "\n";
    }
    if (grn.paymethod != oldGrn.paymethod) {
        updates = updates + "Payment Method Is Changed..! \n" + oldGrn.paymethod + " into " + grn.paymethod + "\n";
    }
    if (grn.status != oldGrn.status) {
        updates = updates + "Status Is Changed..! \n" + oldGrn.status + " into " + grn.status + "\n";
    }

    return updates;
}


//define function for update
const updateGrn = () => {

    let errors = checkFormError();

    if (errors == "") {
        let updates = checkGrnFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");
        } else {
            swal({
                title: "Are You Sure To Update This GRN..?",
                text: "Following Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willUpdate) => {
                    if (willUpdate) {
                        let serviceResponse = getHTTPServiceRequest("/grn/update", "PUT", grn);

                        if (serviceResponse == "OK") {
                            swal("Update Completed..!", { icon: "success" });
                            refreshGrnTable();
                            refreshGrnForm();
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
const deleteGrn = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This GRN..?",
        text: "Following GRN Will Be Deleted..! \n" +
            "GRN No :" + dataOb.grnno +
            "\n Supplier :" + (dataOb.supplier_id ? dataOb.supplier_id.name : ""),

        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                let serviceResponse = getHTTPServiceRequest("/grn/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {
                    swal("Delete Completed..!", { icon: "success" });
                    refreshGrnTable();
                } else {
                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");
                }
            }
        });
}


//define function for print
const printGrn = (dataOb) => {

    grn = dataOb;
    let newWindow = window.open();

    newWindow.document.writeln(
        "<html><head><title> Print GRN </title></head><body>" +
        "<h1> __________Goods Receive Note__________ </h1>" +
        "<p><strong> GRN No : </strong> " + grn.grnno + "</p>" +
        "<p><strong> Supplier : </strong> " + (grn.supplier_id ? grn.supplier_id.name : "") + "</p>" +
        "<p><strong> Received Date : </strong> " + grn.receiveddate + "</p>" +
        "<p><strong> Received Quantity : </strong> " + grn.receivedquantity + "</p>" +
        "<p><strong> Damaged Quantity : </strong> " + grn.damagedquantity + "</p>" +
        "<p><strong> Total Amount : </strong> " + grn.totalamount + "</p>" +
        "<p><strong> Payment Method : </strong> " + grn.paymethod + "</p>" +
        "<p><strong> Status : </strong> " + grn.status + "</p>" +
        "</body></html>"
    );

    setInterval(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1000);
}


//refresh form.........................................................
const refreshGrnForm = () => {

    formGRN.reset();
    buttonUpdate.disabled = "disabled";

    grn = {
        purchaseorder_id: null,
        supplier_id: null,
        orderdate: null,
        receiveddate: null,
        receivedquantity: null,
        damagedquantity: null,
        totalamount: null,
        paymethod: null,
        status: null
    }

    selectPurchaseOrderElement.style.border = "1px solid #ced4da";
    dateReceiveddateElement.style.border = "1px solid #ced4da";
    textReceivedQtyElement.style.border = "1px solid #ced4da";
    textDamagedQtyElement.style.border = "1px solid #ced4da";
    textTotalamountElement.style.border = "1px solid #ced4da";
    selectPaymentmethodElement.style.border = "1px solid #ced4da";
    selectStatusElement.style.border = "1px solid #ced4da";
}

//received date validation
dateReceiveddateElement.addEventListener("change", () => {
    if (dateReceiveddateElement.value != "") {
        grn.receiveddate = dateReceiveddateElement.value;
        dateReceiveddateElement.style.border = "2px solid green";
    } else {
        grn.receiveddate = null;
        dateReceiveddateElement.style.border = "2px solid red";
    }
});

//received qty validation
textReceivedQtyElement.addEventListener("keyup", () => {
    let qty = textReceivedQtyElement.value;
    if (qty != "" && Number(qty) >= 0) {
        grn.receivedquantity = Number(qty);
        textReceivedQtyElement.style.border = "2px solid green";
    } else {
        grn.receivedquantity = null;
        textReceivedQtyElement.style.border = "2px solid red";
    }
});

//damaged qty validation
textDamagedQtyElement.addEventListener("keyup", () => {
    let qty = textDamagedQtyElement.value;
    if (qty != "" && Number(qty) >= 0) {
        grn.damagedquantity = Number(qty);
        textDamagedQtyElement.style.border = "2px solid green";
    } else {
        grn.damagedquantity = null;
        textDamagedQtyElement.style.border = "2px solid red";
    }
});

//total amount validation
textTotalamountElement.addEventListener("keyup", () => {
    let total = textTotalamountElement.value;
    if (total != "" && Number(total) >= 0) {
        grn.totalamount = Number(total);
        textTotalamountElement.style.border = "2px solid green";
    } else {
        grn.totalamount = null;
        textTotalamountElement.style.border = "2px solid red";
    }
});

//payment method validation
selectPaymentmethodElement.addEventListener("change", () => {
    if (selectPaymentmethodElement.value != "") {
        grn.paymethod = selectPaymentmethodElement.value;
        selectPaymentmethodElement.style.border = "2px solid green";
    } else {
        grn.paymethod = null;
        selectPaymentmethodElement.style.border = "2px solid red";
    }
});

//status validation
selectStatusElement.addEventListener("change", () => {
    if (selectStatusElement.value != "") {
        grn.status = selectStatusElement.value;
        selectStatusElement.style.border = "2px solid green";
    } else {
        grn.status = null;
        selectStatusElement.style.border = "2px solid red";
    }
});


//define function check form error.........................
const checkFormError = () => {

    let errors = "";

    if (!grn.purchaseorder_id) errors = errors + "Please Select A Purchase Order ..!\n";
    if (grn.receiveddate == null) errors = errors + "Please Enter Valid Received Date ..!\n";
    if (grn.receivedquantity == null) errors = errors + "Please Enter Valid Received Quantity ..!\n";
    if (grn.damagedquantity == null) errors = errors + "Please Enter Valid Damaged Quantity ..!\n";
    if (grn.totalamount == null) errors = errors + "Please Enter Valid Total Amount ..!\n";
    if (grn.paymethod == null) errors = errors + "Please Select Payment Method ..!\n";
    if (grn.status == null) errors = errors + "Please Select Valid Status ..!\n";

    return errors;
}


//define function for submit form
const submitGrn = () => {

    let errors = checkFormError();

    if (errors == "") {
        swal({
            title: "Are You Sure To Save This GRN..?",
            text: "Following GRN Will Be Saved And Inventory Will Be Updated..! ",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willSave) => {
                if (willSave) {
                    let serviceResponse = getHTTPServiceRequest("/grn/save", "POST", grn);

                    if (serviceResponse == "OK") {
                        swal("Save Completed..!", { icon: "success" });
                        refreshGrnTable();
                        refreshGrnForm();
                    } else {
                        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + serviceResponse, "error");
                    }
                }
            });
    } else {
        swal("Save Not Completed..!", "Form Has Some Errors..!\n" + errors, "error");
    }
}
