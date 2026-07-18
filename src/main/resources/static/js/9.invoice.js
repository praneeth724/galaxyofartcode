//access browser onload event..................................
window.addEventListener("load", () => {

    userPrivi = getHTTPServiceRequest("/userprivilagebymodule?modulename=invoice")

    //load dropdowns
    customers = getServiceRequest("/customerdetails/alldata");
    fillDataToSelect(selectCustomerElement, "Select Customer", customers, "name");

    products = getServiceRequest("/product/alldata");
    fillDataToSelect(selectProductElement, "Select Product", products, "name");

    refreshInvoiceTable();
    refreshInvoiceForm();

});

let selectCustomerElement = document.querySelector("#selectCustomer");
let dateInvoicedateElement = document.querySelector("#dateInvoicedate");
let selectProductElement = document.querySelector("#selectProduct");
let qtyElement = document.querySelector("#qty");
let unitPriceElement = document.querySelector("#unitPrice");
let discountElement = document.querySelector("#discount");
let totalElement = document.querySelector("#total");
let payAmountElement = document.querySelector("#payAmount");
let balanceAmountElement = document.querySelector("#balanceAmount");
let selectPaymethodElement = document.querySelector("#selectPaymethod");


//auto-fill price from the selected product
function onProductChange() {
    if (!selectProductElement.value) return;
    const selectedProduct = JSON.parse(selectProductElement.value);
    invoice.product_id = selectedProduct;
    unitPriceElement.value = selectedProduct.price;
    calculateTotal();
    selectProductElement.style.border = "2px solid green";
}

//compute total (qty*price less discount%) and balance
function calculateTotal() {
    let qty = Number(qtyElement.value) || 0;
    let price = Number(unitPriceElement.value) || 0;
    let discount = Number(discountElement.value) || 0;
    let payAmount = Number(payAmountElement.value) || 0;

    let total = qty * price;
    total = total - (total * discount / 100);

    totalElement.value = total;
    balanceAmountElement.value = total - payAmount;

    invoice.quantity = qty;
    invoice.price = price;
    invoice.discount = discount;
    invoice.total = total;
    invoice.payamount = payAmount;
    invoice.balance = total - payAmount;
}


//define function for refresh table................................................
const refreshInvoiceTable = () => {

    invoices = getServiceRequest("/invoice/alldata");

    let propertyList = [
        { dataType: "string", propertyName: "invoiceno" },
        { dataType: "function", propertyName: (data) => data.customer_id ? data.customer_id.name : "" },
        { dataType: "function", propertyName: (data) => data.product_id ? data.product_id.name : "" },
        { dataType: "string", propertyName: "total" },
        { dataType: "string", propertyName: "payamount" },
        { dataType: "string", propertyName: "balance" },
        { dataType: "string", propertyName: "paymethod" },
        { dataType: "string", propertyName: "status" }
    ];

    fillDataIntoTable(tableBodyInvoice, invoices, propertyList, refillInvoiceForm, deleteInvoice, printInvoice);

    for (const index in invoices) {
        if (!userPrivi.privi_update)
            tableBodyInvoice.children[index].children[9].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodyInvoice.children[index].children[9].children[1].style.disabled = "disabled";
    }
}


//define function for refill(edit) form
const refillInvoiceForm = (dataOb) => {

    invoice = JSON.parse(JSON.stringify(dataOb));
    oldInvoice = JSON.parse(JSON.stringify(dataOb));

    selectCustomerElement.value = invoice.customer_id ? JSON.stringify(invoice.customer_id) : "";
    dateInvoicedateElement.value = invoice.invoicedate;
    selectProductElement.value = invoice.product_id ? JSON.stringify(invoice.product_id) : "";
    qtyElement.value = invoice.quantity;
    unitPriceElement.value = invoice.price;
    discountElement.value = invoice.discount;
    totalElement.value = invoice.total;
    payAmountElement.value = invoice.payamount;
    balanceAmountElement.value = invoice.balance;
    selectPaymethodElement.value = invoice.paymethod;

    buttonSubmit.style.display = "none";
    buttonUpdate.style.display = "block";
}


//check form updates
const checkInvoiceFormUpdate = () => {

    let updates = "";

    if (invoice.quantity != oldInvoice.quantity) {
        updates = updates + "Quantity Is Changed..! \n" + oldInvoice.quantity + " into " + invoice.quantity + "\n";
    }
    if (invoice.discount != oldInvoice.discount) {
        updates = updates + "Discount Is Changed..! \n" + oldInvoice.discount + " into " + invoice.discount + "\n";
    }
    if (invoice.payamount != oldInvoice.payamount) {
        updates = updates + "Pay Amount Is Changed..! \n" + oldInvoice.payamount + " into " + invoice.payamount + "\n";
    }
    if (invoice.paymethod != oldInvoice.paymethod) {
        updates = updates + "Payment Method Is Changed..! \n" + oldInvoice.paymethod + " into " + invoice.paymethod + "\n";
    }

    return updates;
}


//define function for update
const updateInvoice = () => {

    let errors = checkFormError();

    if (errors == "") {
        let updates = checkInvoiceFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");
        } else {
            swal({
                title: "Are You Sure To Update This Invoice..?",
                text: "Following Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willUpdate) => {
                    if (willUpdate) {
                        let serviceResponse = getHTTPServiceRequest("/invoice/update", "PUT", invoice);

                        if (serviceResponse == "OK") {
                            swal("Update Completed..!", { icon: "success" });
                            refreshInvoiceTable();
                            refreshInvoiceForm();
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
const deleteInvoice = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This Invoice..?",
        text: "Following Invoice Will Be Deleted..! \n" +
            "Invoice No :" + dataOb.invoiceno +
            "\n Customer :" + (dataOb.customer_id ? dataOb.customer_id.name : ""),

        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                let serviceResponse = getHTTPServiceRequest("/invoice/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {
                    swal("Delete Completed..!", { icon: "success" });
                    refreshInvoiceTable();
                } else {
                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");
                }
            }
        });
}


//define function for print
const printInvoice = (dataOb) => {

    invoice = dataOb;
    let newWindow = window.open();

    newWindow.document.writeln(
        "<html><head><title> Print Invoice </title></head><body>" +
        "<h1> __________Invoice__________ </h1>" +
        "<p><strong> Invoice No : </strong> " + invoice.invoiceno + "</p>" +
        "<p><strong> Customer : </strong> " + (invoice.customer_id ? invoice.customer_id.name : "") + "</p>" +
        "<p><strong> Product : </strong> " + (invoice.product_id ? invoice.product_id.name : "") + "</p>" +
        "<p><strong> Quantity : </strong> " + invoice.quantity + "</p>" +
        "<p><strong> Total : </strong> " + invoice.total + "</p>" +
        "<p><strong> Pay Amount : </strong> " + invoice.payamount + "</p>" +
        "<p><strong> Balance : </strong> " + invoice.balance + "</p>" +
        "<p><strong> Status : </strong> " + invoice.status + "</p>" +
        "</body></html>"
    );

    setInterval(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1000);
}


//refresh form.........................................................
const refreshInvoiceForm = () => {

    formInvoice.reset();
    buttonUpdate.disabled = "disabled";

    invoice = {
        customer_id: null,
        invoicedate: null,
        product_id: null,
        quantity: null,
        price: null,
        discount: 0,
        total: null,
        paymethod: null,
        payamount: null,
        balance: null
    }

    selectCustomerElement.style.border = "1px solid #ced4da";
    dateInvoicedateElement.style.border = "1px solid #ced4da";
    selectProductElement.style.border = "1px solid #ced4da";
    qtyElement.style.border = "1px solid #ced4da";
    unitPriceElement.style.border = "1px solid #ced4da";
    payAmountElement.style.border = "1px solid #ced4da";
    selectPaymethodElement.style.border = "1px solid #ced4da";
}

//customer validation
selectCustomerElement.addEventListener("change", () => {
    if (selectCustomerElement.value != "") {
        invoice.customer_id = JSON.parse(selectCustomerElement.value);
        selectCustomerElement.style.border = "2px solid green";
    } else {
        invoice.customer_id = null;
        selectCustomerElement.style.border = "2px solid red";
    }
});

//invoice date validation
dateInvoicedateElement.addEventListener("change", () => {
    if (dateInvoicedateElement.value != "") {
        invoice.invoicedate = dateInvoicedateElement.value;
        dateInvoicedateElement.style.border = "2px solid green";
    } else {
        invoice.invoicedate = null;
        dateInvoicedateElement.style.border = "2px solid red";
    }
});

//quantity validation
qtyElement.addEventListener("keyup", () => {
    if (qtyElement.value != "" && Number(qtyElement.value) > 0) {
        qtyElement.style.border = "2px solid green";
    } else {
        qtyElement.style.border = "2px solid red";
    }
    calculateTotal();
});

//unit price validation
unitPriceElement.addEventListener("keyup", () => {
    if (unitPriceElement.value != "" && Number(unitPriceElement.value) > 0) {
        unitPriceElement.style.border = "2px solid green";
    } else {
        unitPriceElement.style.border = "2px solid red";
    }
    calculateTotal();
});

//discount (optional)
discountElement.addEventListener("keyup", () => {
    calculateTotal();
});

//pay amount validation
payAmountElement.addEventListener("keyup", () => {
    if (payAmountElement.value != "" && Number(payAmountElement.value) >= 0) {
        payAmountElement.style.border = "2px solid green";
    } else {
        payAmountElement.style.border = "2px solid red";
    }
    calculateTotal();
});

//payment method validation
selectPaymethodElement.addEventListener("change", () => {
    if (selectPaymethodElement.value != "") {
        invoice.paymethod = selectPaymethodElement.value;
        selectPaymethodElement.style.border = "2px solid green";
    } else {
        invoice.paymethod = null;
        selectPaymethodElement.style.border = "2px solid red";
    }
});


//define function check form error.........................
const checkFormError = () => {

    let errors = "";

    if (!invoice.customer_id) errors = errors + "Please Select Valid Customer ..!\n";
    if (invoice.invoicedate == null) errors = errors + "Please Enter Valid Invoice Date ..!\n";
    if (!invoice.product_id) errors = errors + "Please Select Valid Product ..!\n";
    if (invoice.quantity == null || invoice.quantity <= 0) errors = errors + "Please Enter Valid Quantity ..!\n";
    if (invoice.price == null || invoice.price <= 0) errors = errors + "Please Enter Valid Unit Price ..!\n";
    if (invoice.payamount == null || invoice.payamount < 0) errors = errors + "Please Enter Valid Pay Amount ..!\n";
    if (invoice.paymethod == null) errors = errors + "Please Select Payment Method ..!\n";

    return errors;
}


//define function for submit form
const submitInvoice = () => {

    let errors = checkFormError();

    if (errors == "") {
        swal({
            title: "Are You Sure To Save This Invoice..?",
            text: "Following Invoice Will Be Saved And Inventory Will Be Updated..! ",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willSave) => {
                if (willSave) {
                    let serviceResponse = getHTTPServiceRequest("/invoice/save", "POST", invoice);

                    if (serviceResponse == "OK") {
                        swal("Save Completed..!", { icon: "success" });
                        refreshInvoiceTable();
                        refreshInvoiceForm();
                    } else {
                        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + serviceResponse, "error");
                    }
                }
            });
    } else {
        swal("Save Not Completed..!", "Form Has Some Errors..!\n" + errors, "error");
    }
}
