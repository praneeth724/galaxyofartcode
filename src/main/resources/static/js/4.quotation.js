//access browser onload event..................................
window.addEventListener("load", () => {

    userPrivi = getHTTPServiceRequest("/userprivilagebymodule?modulename=quotation")

    //load price request dropdown
    priceRequests = getServiceRequest("/supplierpricerequest/alldata");
    fillDataToSelect(selectPriceRequestElement, "Select Price Request", priceRequests, "requestid");

    refreshQuotationTable();
    refreshQuotationForm();

});

let selectPriceRequestElement = document.querySelector("#selectPriceRequest");
let textSupplierElement = document.querySelector("#textSupplier");
let textProductElement = document.querySelector("#textProduct");
let requestDateElement = document.querySelector("#requestDate");
let validDateElement = document.querySelector("#validDate");
let unitPriceElement = document.querySelector("#unitPrice");
let discountElement = document.querySelector("#discount");
let qtyElement = document.querySelector("#qty");
let selectStatusElement = document.querySelector("#selectStatus");


//auto-fill supplier/product/price/quantity/requestdate from the selected price request
function loadPriceRequestDetails() {

    if (!selectPriceRequestElement.value) return;

    const selectedPR = JSON.parse(selectPriceRequestElement.value);

    quotation.pricerequest_id = selectedPR;
    quotation.supplier_id = selectedPR.supplier_id;
    quotation.product_id = selectedPR.product_id;

    textSupplierElement.value = selectedPR.supplier_id ? selectedPR.supplier_id.name : "";
    textProductElement.value = selectedPR.product_id ? selectedPR.product_id.name : "";
    requestDateElement.value = selectedPR.requestdate;
    unitPriceElement.value = selectedPR.price;
    qtyElement.value = selectedPR.quantity;

    quotation.requestdate = selectedPR.requestdate;
    quotation.price = selectedPR.price;
    quotation.quantity = selectedPR.quantity;

    selectPriceRequestElement.style.border = "2px solid green";
}

//keep quotation.requestdate in sync if the auto-filled date is manually edited
requestDateElement.addEventListener("change", () => {
    quotation.requestdate = requestDateElement.value;
});


//define function for refresh table................................................
const refreshQuotationTable = () => {

    quotations = getServiceRequest("/quotation/alldata");

    let propertyList = [
        { dataType: "string", propertyName: "quotationid" },
        { dataType: "function", propertyName: (data) => data.supplier_id ? data.supplier_id.name : "" },
        { dataType: "function", propertyName: (data) => data.product_id ? data.product_id.name : "" },
        { dataType: "string", propertyName: "deadline" },
        { dataType: "string", propertyName: "price" },
        { dataType: "string", propertyName: "discount" },
        { dataType: "string", propertyName: "quantity" },
        { dataType: "string", propertyName: "status" }
    ];

    fillDataIntoTable(tableBodyQuotation, quotations, propertyList, refillQuotationForm, deleteQuotation, printQuotation);

    for (const index in quotations) {
        if (!userPrivi.privi_update)
            tableBodyQuotation.children[index].children[9].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodyQuotation.children[index].children[9].children[1].style.disabled = "disabled";
    }
}


//define function for refill(edit) form
const refillQuotationForm = (dataOb) => {

    quotation = JSON.parse(JSON.stringify(dataOb));
    oldQuotation = JSON.parse(JSON.stringify(dataOb));

    selectPriceRequestElement.value = quotation.pricerequest_id ? JSON.stringify(quotation.pricerequest_id) : "";
    textSupplierElement.value = quotation.supplier_id ? quotation.supplier_id.name : "";
    textProductElement.value = quotation.product_id ? quotation.product_id.name : "";
    requestDateElement.value = quotation.requestdate;
    validDateElement.value = quotation.deadline;
    unitPriceElement.value = quotation.price;
    discountElement.value = quotation.discount;
    qtyElement.value = quotation.quantity;
    selectStatusElement.value = quotation.status;

    buttonSubmit.style.display = "none";
    buttonUpdate.style.display = "block";
}


//check form updates
const checkQuotationFormUpdate = () => {

    let updates = "";

    if (quotation.deadline != oldQuotation.deadline) {
        updates = updates + "Deadline Is Changed..! \n" + oldQuotation.deadline + " into " + quotation.deadline + "\n";
    }
    if (quotation.price != oldQuotation.price) {
        updates = updates + "Unit Price Is Changed..! \n" + oldQuotation.price + " into " + quotation.price + "\n";
    }
    if (quotation.discount != oldQuotation.discount) {
        updates = updates + "Discount Is Changed..! \n" + oldQuotation.discount + " into " + quotation.discount + "\n";
    }
    if (quotation.quantity != oldQuotation.quantity) {
        updates = updates + "Quantity Is Changed..! \n" + oldQuotation.quantity + " into " + quotation.quantity + "\n";
    }
    if (quotation.status != oldQuotation.status) {
        updates = updates + "Status Is Changed..! \n" + oldQuotation.status + " into " + quotation.status + "\n";
    }

    return updates;
}


//define function for update
const updateQuotation = () => {

    let errors = checkFormError();

    if (errors == "") {
        let updates = checkQuotationFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");
        } else {
            swal({
                title: "Are You Sure To Update This Quotation..?",
                text: "Following Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willUpdate) => {
                    if (willUpdate) {
                        let serviceResponse = getHTTPServiceRequest("/quotation/update", "PUT", quotation);

                        if (serviceResponse == "OK") {
                            swal("Update Completed..!", { icon: "success" });
                            refreshQuotationTable();
                            refreshQuotationForm();
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
const deleteQuotation = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This Quotation..?",
        text: "Following Quotation Will Be Deleted..! \n" +
            "Quotation ID :" + dataOb.quotationid +
            "\n Supplier :" + (dataOb.supplier_id ? dataOb.supplier_id.name : "") +
            "\n Product :" + (dataOb.product_id ? dataOb.product_id.name : ""),

        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                let serviceResponse = getHTTPServiceRequest("/quotation/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {
                    swal("Delete Completed..!", { icon: "success" });
                    refreshQuotationTable();
                } else {
                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");
                }
            }
        });
}


//define function for print
const printQuotation = (dataOb) => {

    quotation = dataOb;
    let newWindow = window.open();

    newWindow.document.writeln(
        "<html><head><title> Print Quotation </title></head><body>" +
        "<h1> __________Quotation__________ </h1>" +
        "<p><strong> Quotation ID : </strong> " + quotation.quotationid + "</p>" +
        "<p><strong> Supplier : </strong> " + (quotation.supplier_id ? quotation.supplier_id.name : "") + "</p>" +
        "<p><strong> Product : </strong> " + (quotation.product_id ? quotation.product_id.name : "") + "</p>" +
        "<p><strong> Deadline : </strong> " + quotation.deadline + "</p>" +
        "<p><strong> Unit Price : </strong> " + quotation.price + "</p>" +
        "<p><strong> Discount : </strong> " + quotation.discount + "</p>" +
        "<p><strong> Quantity : </strong> " + quotation.quantity + "</p>" +
        "<p><strong> Status : </strong> " + quotation.status + "</p>" +
        "</body></html>"
    );

    setInterval(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1000);
}


//refresh form.........................................................
const refreshQuotationForm = () => {

    formQuotation.reset();
    buttonUpdate.disabled = "disabled";

    quotation = {
        pricerequest_id: null,
        supplier_id: null,
        product_id: null,
        requestdate: null,
        deadline: null,
        price: null,
        discount: 0,
        quantity: null,
        status: null
    }

    selectPriceRequestElement.style.border = "1px solid #ced4da";
    validDateElement.style.border = "1px solid #ced4da";
    unitPriceElement.style.border = "1px solid #ced4da";
    qtyElement.style.border = "1px solid #ced4da";
    selectStatusElement.style.border = "1px solid #ced4da";
}

//deadline validation
validDateElement.addEventListener("change", () => {
    if (validDateElement.value != "") {
        quotation.deadline = validDateElement.value;
        validDateElement.style.border = "2px solid green";
    } else {
        quotation.deadline = null;
        validDateElement.style.border = "2px solid red";
    }
});

//unit price validation
unitPriceElement.addEventListener("keyup", () => {
    let price = unitPriceElement.value;
    if (price != "" && Number(price) > 0) {
        quotation.price = Number(price);
        unitPriceElement.style.border = "2px solid green";
    } else {
        quotation.price = null;
        unitPriceElement.style.border = "2px solid red";
    }
});

//discount (optional)
discountElement.addEventListener("keyup", () => {
    quotation.discount = discountElement.value != "" ? Number(discountElement.value) : 0;
});

//quantity validation
qtyElement.addEventListener("keyup", () => {
    let qty = qtyElement.value;
    if (qty != "" && Number(qty) > 0) {
        quotation.quantity = Number(qty);
        qtyElement.style.border = "2px solid green";
    } else {
        quotation.quantity = null;
        qtyElement.style.border = "2px solid red";
    }
});

//status validation
selectStatusElement.addEventListener("change", () => {
    if (selectStatusElement.value != "") {
        quotation.status = selectStatusElement.value;
        selectStatusElement.style.border = "2px solid green";
    } else {
        quotation.status = null;
        selectStatusElement.style.border = "2px solid red";
    }
});


//define function check form error.........................
const checkFormError = () => {

    let errors = "";

    if (!quotation.pricerequest_id) errors = errors + "Please Select A Price Request ..!\n";
    if (quotation.deadline == null) errors = errors + "Please Enter Valid Deadline ..!\n";
    if (quotation.price == null) errors = errors + "Please Enter Valid Unit Price ..!\n";
    if (quotation.quantity == null) errors = errors + "Please Enter Valid Quantity ..!\n";
    if (quotation.status == null) errors = errors + "Please Select Valid Status ..!\n";

    return errors;
}


//define function for submit form
const submitQuotation = () => {

    let errors = checkFormError();

    if (errors == "") {
        swal({
            title: "Are You Sure To Save This Quotation..?",
            text: "Following Quotation Will Be Saved..! ",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willSave) => {
                if (willSave) {
                    let serviceResponse = getHTTPServiceRequest("/quotation/save", "POST", quotation);

                    if (serviceResponse == "OK") {
                        swal("Save Completed..!", { icon: "success" });
                        refreshQuotationTable();
                        refreshQuotationForm();
                    } else {
                        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + serviceResponse, "error");
                    }
                }
            });
    } else {
        swal("Save Not Completed..!", "Form Has Some Errors..!\n" + errors, "error");
    }
}
