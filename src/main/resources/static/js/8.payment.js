//access browser onload event..................................
window.addEventListener("load", () => {

    userPrivi = getHTTPServiceRequest("/userprivilagebymodule?modulename=artistsupplierpayment")

    //load dropdowns
    artists = getServiceRequest("/artistsupplierdetails/artists");
    fillDataToSelect(selectArtistElement, "Select Artist", artists, "name");

    products = getServiceRequest("/product/alldata");
    fillDataToSelect(selectProductElement, "Select Product", products, "name");

    refreshPaymentTable();
    refreshPaymentForm();

});

let selectArtistElement = document.querySelector("#selectArtist");
let selectProductElement = document.querySelector("#selectProduct");
let selectCommissiontypeElement = document.querySelector("#selectCommissiontype");
let commissionRateElement = document.querySelector("#commissionRate");
let itemPriceElement = document.querySelector("#itemPrice");
let itemQuantityElement = document.querySelector("#itemQuantity");
let totalAmountElement = document.querySelector("#totalAmount");
let artistPayableamountElement = document.querySelector("#artistPayableamount");
let balanceAmountElement = document.querySelector("#balanceAmount");
let datePaymentduedateElement = document.querySelector("#datePaymentduedate");
let selectPaymentmethodElement = document.querySelector("#selectPaymentmethod");
let datePaymentdateElement = document.querySelector("#datePaymentdate");
let selectPaymentstatusElement = document.querySelector("#selectPaymentstatus");


//auto-fill price from the selected product
function onProductChange() {
    if (!selectProductElement.value) return;
    const selectedProduct = JSON.parse(selectProductElement.value);
    payment.product_id = selectedProduct;
    itemPriceElement.value = selectedProduct.price;
    calculatePayable();
    selectProductElement.style.border = "2px solid green";
}

//compute total and payable amount
function calculatePayable() {
    let price = Number(itemPriceElement.value) || 0;
    let qty = Number(itemQuantityElement.value) || 0;
    let rate = Number(commissionRateElement.value) || 0;
    let type = selectCommissiontypeElement.value;

    let total = price * qty;
    totalAmountElement.value = total;
    payment.total = total;
    payment.price = price;
    payment.quantity = qty;
    payment.commissionrate = rate;

    let payable = 0;
    if (type == "Percentage") {
        payable = total * (rate / 100);
    } else if (type == "Fixed Amount") {
        payable = rate;
    }
    artistPayableamountElement.value = payable;
    payment.paybleamount = payable;
}


//define function for refresh table................................................
const refreshPaymentTable = () => {

    payments = getServiceRequest("/artistsupplierpayment/alldata");

    let propertyList = [
        { dataType: "string", propertyName: "payno" },
        { dataType: "function", propertyName: (data) => data.artist_id ? data.artist_id.name : "" },
        { dataType: "function", propertyName: (data) => data.product_id ? data.product_id.name : "" },
        { dataType: "string", propertyName: "commissiontype" },
        { dataType: "string", propertyName: "commissionrate" },
        { dataType: "string", propertyName: "total" },
        { dataType: "string", propertyName: "paybleamount" },
        { dataType: "string", propertyName: "paydate" },
        { dataType: "string", propertyName: "paystatus" }
    ];

    fillDataIntoTable(tableBodyPayment, payments, propertyList, refillPaymentForm, deletePayment, printPayment);

    for (const index in payments) {
        if (!userPrivi.privi_update)
            tableBodyPayment.children[index].children[10].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodyPayment.children[index].children[10].children[1].style.disabled = "disabled";
    }
}


//define function for refill(edit) form
const refillPaymentForm = (dataOb) => {

    payment = JSON.parse(JSON.stringify(dataOb));
    oldPayment = JSON.parse(JSON.stringify(dataOb));

    selectArtistElement.value = payment.artist_id ? JSON.stringify(payment.artist_id) : "";
    selectProductElement.value = payment.product_id ? JSON.stringify(payment.product_id) : "";
    selectCommissiontypeElement.value = payment.commissiontype;
    commissionRateElement.value = payment.commissionrate;
    itemPriceElement.value = payment.price;
    itemQuantityElement.value = payment.quantity;
    totalAmountElement.value = payment.total;
    artistPayableamountElement.value = payment.paybleamount;
    balanceAmountElement.value = payment.balance;
    datePaymentduedateElement.value = payment.payduedate;
    selectPaymentmethodElement.value = payment.paymethod;
    datePaymentdateElement.value = payment.paydate;
    selectPaymentstatusElement.value = payment.paystatus;

    buttonSubmit.style.display = "none";
    buttonUpdate.style.display = "block";
}


//check form updates
const checkPaymentFormUpdate = () => {

    let updates = "";

    if (payment.commissionrate != oldPayment.commissionrate) {
        updates = updates + "Commission Rate Is Changed..! \n";
    }
    if (payment.paybleamount != oldPayment.paybleamount) {
        updates = updates + "Payable Amount Is Changed..! \n" + oldPayment.paybleamount + " into " + payment.paybleamount + "\n";
    }
    if (payment.paystatus != oldPayment.paystatus) {
        updates = updates + "Payment Status Is Changed..! \n" + oldPayment.paystatus + " into " + payment.paystatus + "\n";
    }
    if (payment.paydate != oldPayment.paydate) {
        updates = updates + "Payment Date Is Changed..! \n" + oldPayment.paydate + " into " + payment.paydate + "\n";
    }

    return updates;
}


//define function for update
const updatePayment = () => {

    let errors = checkFormError();

    if (errors == "") {
        let updates = checkPaymentFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");
        } else {
            swal({
                title: "Are You Sure To Update This Payment..?",
                text: "Following Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willUpdate) => {
                    if (willUpdate) {
                        let serviceResponse = getHTTPServiceRequest("/artistsupplierpayment/update", "PUT", payment);

                        if (serviceResponse == "OK") {
                            swal("Update Completed..!", { icon: "success" });
                            refreshPaymentTable();
                            refreshPaymentForm();
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
const deletePayment = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This Payment..?",
        text: "Following Payment Will Be Deleted..! \n" +
            "Pay No :" + dataOb.payno +
            "\n Artist :" + (dataOb.artist_id ? dataOb.artist_id.name : ""),

        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                let serviceResponse = getHTTPServiceRequest("/artistsupplierpayment/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {
                    swal("Delete Completed..!", { icon: "success" });
                    refreshPaymentTable();
                } else {
                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");
                }
            }
        });
}


//define function for print
const printPayment = (dataOb) => {

    payment = dataOb;
    let newWindow = window.open();

    newWindow.document.writeln(
        "<html><head><title> Print Payment </title></head><body>" +
        "<h1> __________Artist Payment__________ </h1>" +
        "<p><strong> Pay No : </strong> " + payment.payno + "</p>" +
        "<p><strong> Artist : </strong> " + (payment.artist_id ? payment.artist_id.name : "") + "</p>" +
        "<p><strong> Product : </strong> " + (payment.product_id ? payment.product_id.name : "") + "</p>" +
        "<p><strong> Commission Type : </strong> " + payment.commissiontype + "</p>" +
        "<p><strong> Commission Rate : </strong> " + payment.commissionrate + "</p>" +
        "<p><strong> Total : </strong> " + payment.total + "</p>" +
        "<p><strong> Payable Amount : </strong> " + payment.paybleamount + "</p>" +
        "<p><strong> Payment Date : </strong> " + payment.paydate + "</p>" +
        "<p><strong> Status : </strong> " + payment.paystatus + "</p>" +
        "</body></html>"
    );

    setInterval(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1000);
}


//refresh form.........................................................
const refreshPaymentForm = () => {

    formPayment.reset();
    buttonUpdate.disabled = "disabled";

    payment = {
        artist_id: null,
        product_id: null,
        commissiontype: null,
        commissionrate: null,
        price: null,
        quantity: null,
        total: null,
        paybleamount: null,
        paymethod: null,
        paydate: null,
        paystatus: null,
        balance: null,
        payduedate: null
    }

    selectArtistElement.style.border = "1px solid #ced4da";
    selectProductElement.style.border = "1px solid #ced4da";
    selectCommissiontypeElement.style.border = "1px solid #ced4da";
    commissionRateElement.style.border = "1px solid #ced4da";
    itemPriceElement.style.border = "1px solid #ced4da";
    itemQuantityElement.style.border = "1px solid #ced4da";
    selectPaymentmethodElement.style.border = "1px solid #ced4da";
    datePaymentdateElement.style.border = "1px solid #ced4da";
    selectPaymentstatusElement.style.border = "1px solid #ced4da";
}

//artist validation
selectArtistElement.addEventListener("change", () => {
    if (selectArtistElement.value != "") {
        payment.artist_id = JSON.parse(selectArtistElement.value);
        selectArtistElement.style.border = "2px solid green";
    } else {
        payment.artist_id = null;
        selectArtistElement.style.border = "2px solid red";
    }
});

//commission type validation
selectCommissiontypeElement.addEventListener("change", () => {
    if (selectCommissiontypeElement.value != "") {
        payment.commissiontype = selectCommissiontypeElement.value;
        selectCommissiontypeElement.style.border = "2px solid green";
    } else {
        payment.commissiontype = null;
        selectCommissiontypeElement.style.border = "2px solid red";
    }
    calculatePayable();
});

//item price validation
itemPriceElement.addEventListener("keyup", () => {
    if (itemPriceElement.value != "" && Number(itemPriceElement.value) > 0) {
        itemPriceElement.style.border = "2px solid green";
    } else {
        itemPriceElement.style.border = "2px solid red";
    }
    calculatePayable();
});

//quantity validation
itemQuantityElement.addEventListener("keyup", () => {
    if (itemQuantityElement.value != "" && Number(itemQuantityElement.value) > 0) {
        itemQuantityElement.style.border = "2px solid green";
    } else {
        itemQuantityElement.style.border = "2px solid red";
    }
    calculatePayable();
});

//balance (optional)
balanceAmountElement.addEventListener("keyup", () => {
    payment.balance = balanceAmountElement.value != "" ? Number(balanceAmountElement.value) : null;
});

//due date (optional)
datePaymentduedateElement.addEventListener("change", () => {
    payment.payduedate = datePaymentduedateElement.value != "" ? datePaymentduedateElement.value : null;
});

//payment method validation
selectPaymentmethodElement.addEventListener("change", () => {
    if (selectPaymentmethodElement.value != "") {
        payment.paymethod = selectPaymentmethodElement.value;
        selectPaymentmethodElement.style.border = "2px solid green";
    } else {
        payment.paymethod = null;
        selectPaymentmethodElement.style.border = "2px solid red";
    }
});

//payment date validation
datePaymentdateElement.addEventListener("change", () => {
    if (datePaymentdateElement.value != "") {
        payment.paydate = datePaymentdateElement.value;
        datePaymentdateElement.style.border = "2px solid green";
    } else {
        payment.paydate = null;
        datePaymentdateElement.style.border = "2px solid red";
    }
});

//payment status validation
selectPaymentstatusElement.addEventListener("change", () => {
    if (selectPaymentstatusElement.value != "") {
        payment.paystatus = selectPaymentstatusElement.value;
        selectPaymentstatusElement.style.border = "2px solid green";
    } else {
        payment.paystatus = null;
        selectPaymentstatusElement.style.border = "2px solid red";
    }
});


//define function check form error.........................
const checkFormError = () => {

    let errors = "";

    if (!payment.artist_id) errors = errors + "Please Select Valid Artist ..!\n";
    if (!payment.product_id) errors = errors + "Please Select Valid Product ..!\n";
    if (payment.commissiontype == null) errors = errors + "Please Select Commission Type ..!\n";
    if (payment.commissionrate == null) errors = errors + "Please Enter Valid Commission Rate ..!\n";
    if (payment.price == null || payment.price <= 0) errors = errors + "Please Enter Valid Item Price ..!\n";
    if (payment.quantity == null || payment.quantity <= 0) errors = errors + "Please Enter Valid Quantity ..!\n";
    if (payment.paymethod == null) errors = errors + "Please Select Payment Method ..!\n";
    if (payment.paydate == null) errors = errors + "Please Enter Valid Payment Date ..!\n";
    if (payment.paystatus == null) errors = errors + "Please Select Valid Payment Status ..!\n";

    return errors;
}


//define function for submit form
const submitPayment = () => {

    let errors = checkFormError();

    if (errors == "") {
        swal({
            title: "Are You Sure To Save This Payment..?",
            text: "Following Payment Will Be Saved..! ",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willSave) => {
                if (willSave) {
                    let serviceResponse = getHTTPServiceRequest("/artistsupplierpayment/save", "POST", payment);

                    if (serviceResponse == "OK") {
                        swal("Save Completed..!", { icon: "success" });
                        refreshPaymentTable();
                        refreshPaymentForm();
                    } else {
                        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + serviceResponse, "error");
                    }
                }
            });
    } else {
        swal("Save Not Completed..!", "Form Has Some Errors..!\n" + errors, "error");
    }
}
