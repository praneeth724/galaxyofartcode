//access browser onload event..................................
window.addEventListener("load", () => {

    userPrivi = getHTTPServiceRequest("/userprivilagebymodule?modulename=supplierpricerequest")

    //load dropdowns
    suppliers = getServiceRequest("/artistsupplierdetails/suppliers");
    fillDataToSelect(selectSupplierElement, "Select Supplier", suppliers, "name");

    products = getServiceRequest("/product/alldata");
    fillDataToSelect(selectProductElement, "Select Product", products, "name");

    refreshPriceRequestTable();
    refreshPriceRequestForm();

});

let selectSupplierElement = document.querySelector("#selectSupplier");
let selectProductElement = document.querySelector("#selectProduct");
let textPriceElement = document.querySelector("#textPrice");
let textQuantityElement = document.querySelector("#textQuantity");
let dateRequestDateElement = document.querySelector("#dateRequestDate");
let selectStatusElement = document.querySelector("#selectStatus");


//define function for refresh table................................................
const refreshPriceRequestTable = () => {

    priceRequests = getServiceRequest("/supplierpricerequest/alldata");

    let propertyList = [
        { dataType: "string", propertyName: "requestid" },
        { dataType: "function", propertyName: (data) => data.supplier_id ? data.supplier_id.name : "" },
        { dataType: "function", propertyName: (data) => data.product_id ? data.product_id.name : "" },
        { dataType: "string", propertyName: "price" },
        { dataType: "string", propertyName: "quantity" },
        { dataType: "string", propertyName: "requestdate" },
        { dataType: "string", propertyName: "status" }
    ];

    fillDataIntoTable(tableBodyPriceRequest, priceRequests, propertyList, refillPriceRequestForm, deletePriceRequest, printPriceRequest);

    for (const index in priceRequests) {
        if (!userPrivi.privi_update)
            tableBodyPriceRequest.children[index].children[8].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodyPriceRequest.children[index].children[8].children[1].style.disabled = "disabled";
    }
}


//define function for refill(edit) form
const refillPriceRequestForm = (dataOb) => {

    priceRequest = JSON.parse(JSON.stringify(dataOb));
    oldPriceRequest = JSON.parse(JSON.stringify(dataOb));

    selectSupplierElement.value = priceRequest.supplier_id ? JSON.stringify(priceRequest.supplier_id) : "";
    selectProductElement.value = priceRequest.product_id ? JSON.stringify(priceRequest.product_id) : "";
    textPriceElement.value = priceRequest.price;
    textQuantityElement.value = priceRequest.quantity;
    dateRequestDateElement.value = priceRequest.requestdate;
    selectStatusElement.value = priceRequest.status;

    buttonSubmit.style.display = "none";
    buttonUpdate.style.display = "block";
}


//check form updates
const checkPriceRequestFormUpdate = () => {

    let updates = "";

    if (JSON.stringify(priceRequest.supplier_id) != JSON.stringify(oldPriceRequest.supplier_id)) {
        updates = updates + "Supplier Is Changed..! \n";
    }
    if (JSON.stringify(priceRequest.product_id) != JSON.stringify(oldPriceRequest.product_id)) {
        updates = updates + "Product Is Changed..! \n";
    }
    if (priceRequest.price != oldPriceRequest.price) {
        updates = updates + "Price Is Changed..! \n" + oldPriceRequest.price + " into " + priceRequest.price + "\n";
    }
    if (priceRequest.quantity != oldPriceRequest.quantity) {
        updates = updates + "Quantity Is Changed..! \n" + oldPriceRequest.quantity + " into " + priceRequest.quantity + "\n";
    }
    if (priceRequest.requestdate != oldPriceRequest.requestdate) {
        updates = updates + "Request Date Is Changed..! \n" + oldPriceRequest.requestdate + " into " + priceRequest.requestdate + "\n";
    }
    if (priceRequest.status != oldPriceRequest.status) {
        updates = updates + "Status Is Changed..! \n" + oldPriceRequest.status + " into " + priceRequest.status + "\n";
    }

    return updates;
}


//define function for update
const updatePriceRequest = () => {

    let errors = checkFormError();

    if (errors == "") {
        let updates = checkPriceRequestFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");
        } else {
            swal({
                title: "Are You Sure To Update This Price Request..?",
                text: "Following Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willUpdate) => {
                    if (willUpdate) {
                        let serviceResponse = getHTTPServiceRequest("/supplierpricerequest/update", "PUT", priceRequest);

                        if (serviceResponse == "OK") {
                            swal("Update Completed..!", { icon: "success" });
                            refreshPriceRequestTable();
                            refreshPriceRequestForm();
                        } else {
                            swal("Update Not Completed..!", " Form Hasn't Any Changes..! \n" + serviceResponse, "error");
                        };
                    }
                });
        }
    } else {
        swal("Update Not Completed..!", "Form Has Errors..! \n" + errors, "error");
    }
}


//define function for delete
const deletePriceRequest = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This Price Request..?",
        text: "Following Details Will Be Deleted..! \n" +
            "Request ID :" + dataOb.requestid +
            "\n Supplier :" + (dataOb.supplier_id ? dataOb.supplier_id.name : "") +
            "\n Product :" + (dataOb.product_id ? dataOb.product_id.name : ""),

        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                let serviceResponse = getHTTPServiceRequest("/supplierpricerequest/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {
                    swal("Delete Completed..!", { icon: "success" });
                    refreshPriceRequestTable();
                } else {
                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");
                };
            }
        });
}


//define function for print
const printPriceRequest = (dataOb) => {

    priceRequest = dataOb;
    let newWindow = window.open();

    newWindow.document.writeln(
        "<html><head><title> Print Price Request </title></head><body>" +
        "<h1> __________Supplier Price Request__________ </h1>" +
        "<p><strong> Request ID : </strong> " + priceRequest.requestid + "</p>" +
        "<p><strong> Supplier : </strong> " + (priceRequest.supplier_id ? priceRequest.supplier_id.name : "") + "</p>" +
        "<p><strong> Product : </strong> " + (priceRequest.product_id ? priceRequest.product_id.name : "") + "</p>" +
        "<p><strong> Price : </strong> " + priceRequest.price + "</p>" +
        "<p><strong> Quantity : </strong> " + priceRequest.quantity + "</p>" +
        "<p><strong> Request Date : </strong> " + priceRequest.requestdate + "</p>" +
        "<p><strong> Status : </strong> " + priceRequest.status + "</p>" +
        "</body></html>"
    );

    setInterval(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1000);
}


//refresh form.........................................................
const refreshPriceRequestForm = () => {

    formSupplierpr.reset();
    buttonUpdate.disabled = "disabled";

    priceRequest = {
        supplier_id: null,
        product_id: null,
        price: null,
        quantity: null,
        requestdate: null,
        status: null
    }

    selectSupplierElement.style.border = "1px solid #ced4da";
    selectProductElement.style.border = "1px solid #ced4da";
    textPriceElement.style.border = "1px solid #ced4da";
    textQuantityElement.style.border = "1px solid #ced4da";
    dateRequestDateElement.style.border = "1px solid #ced4da";
    selectStatusElement.style.border = "1px solid #ced4da";
}

//supplier validation
selectSupplierElement.addEventListener("change", () => {
    if (selectSupplierElement.value != "") {
        priceRequest.supplier_id = JSON.parse(selectSupplierElement.value);
        selectSupplierElement.style.border = "2px solid green";
    } else {
        priceRequest.supplier_id = null;
        selectSupplierElement.style.border = "2px solid red";
    }
});

//product validation
selectProductElement.addEventListener("change", () => {
    if (selectProductElement.value != "") {
        priceRequest.product_id = JSON.parse(selectProductElement.value);
        selectProductElement.style.border = "2px solid green";
    } else {
        priceRequest.product_id = null;
        selectProductElement.style.border = "2px solid red";
    }
});

//price validation
textPriceElement.addEventListener("keyup", () => {
    let price = textPriceElement.value;
    if (price != "" && Number(price) > 0) {
        priceRequest.price = Number(price);
        textPriceElement.style.border = "2px solid green";
    } else {
        priceRequest.price = null;
        textPriceElement.style.border = "2px solid red";
    }
});

//quantity validation
textQuantityElement.addEventListener("keyup", () => {
    let quantity = textQuantityElement.value;
    if (quantity != "" && Number(quantity) > 0) {
        priceRequest.quantity = Number(quantity);
        textQuantityElement.style.border = "2px solid green";
    } else {
        priceRequest.quantity = null;
        textQuantityElement.style.border = "2px solid red";
    }
});

//request date validation
dateRequestDateElement.addEventListener("change", () => {
    if (dateRequestDateElement.value != "") {
        priceRequest.requestdate = dateRequestDateElement.value;
        dateRequestDateElement.style.border = "2px solid green";
    } else {
        priceRequest.requestdate = null;
        dateRequestDateElement.style.border = "2px solid red";
    }
});

//status validation
selectStatusElement.addEventListener("change", () => {
    if (selectStatusElement.value != "") {
        priceRequest.status = selectStatusElement.value;
        selectStatusElement.style.border = "2px solid green";
    } else {
        priceRequest.status = null;
        selectStatusElement.style.border = "2px solid red";
    }
});


//define function check form error.........................
const checkFormError = () => {

    let errors = "";

    if (!priceRequest.supplier_id) errors = errors + "Please Select Valid Supplier ..!\n";
    if (!priceRequest.product_id) errors = errors + "Please Select Valid Product ..!\n";
    if (priceRequest.price == null) errors = errors + "Please Enter Valid Price ..!\n";
    if (priceRequest.quantity == null) errors = errors + "Please Enter Valid Quantity ..!\n";
    if (priceRequest.requestdate == null) errors = errors + "Please Enter Valid Request Date ..!\n";
    if (priceRequest.status == null) errors = errors + "Please Select Valid Status ..!\n";

    return errors;
}


//define function for submit form
const submitPriceRequestForm = () => {

    let errors = checkFormError();

    if (errors == "") {
        swal({
            title: "Are You Sure To Save This Price Request..?",
            text: "Following Price Request Will Be Saved..! ",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willSave) => {
                if (willSave) {
                    let serviceResponse = getHTTPServiceRequest("/supplierpricerequest/save", "POST", priceRequest);

                    if (serviceResponse == "OK") {
                        swal("Save Completed..!", { icon: "success" });
                        refreshPriceRequestTable();
                        refreshPriceRequestForm();
                    } else {
                        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + serviceResponse, "error");
                    }
                }
            });
    } else {
        swal("Save Not Completed..!", "Form Has Some Errors..!\n" + errors, "error");
    }
}
