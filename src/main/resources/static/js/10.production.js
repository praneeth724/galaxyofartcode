//access browser onload event..................................
window.addEventListener("load", () => {

    userPrivi = getHTTPServiceRequest("/userprivilagebymodule?modulename=production")

    //load mug products dropdown
    products = getServiceRequest("/product/alldata?type=mug");
    fillDataToSelect(selectProductElement, "Select Mug Product", products, "name");

    refreshProductionTable();
    refreshProductionForm();

});

let customerNameElement = document.querySelector("#customerName");
let contactElement = document.querySelector("#contact");
let jobIdElement = document.querySelector("#jobId");
let jobStatusElement = document.querySelector("#jobStatus");
let orderedDateElement = document.querySelector("#orderedDate");
let deliveryDateElement = document.querySelector("#deliveryDate");
let selectProductElement = document.querySelector("#selectProduct");
let designCategoryElement = document.querySelector("#designCategory");
let designFormatElement = document.querySelector("#designFormat");
let designFileElement = document.querySelector("#designFile");
let printAreaElement = document.querySelector("#printArea");
let colorModeElement = document.querySelector("#colorMode");
let designSizeElement = document.querySelector("#designSize");
let qtyElement = document.querySelector("#qty");
let unitCostElement = document.querySelector("#unitCost");
let inkCostElement = document.querySelector("#inkCost");
let paperCostElement = document.querySelector("#paperCost");
let designCostElement = document.querySelector("#designCost");
let discountElement = document.querySelector("#discount");
let discountAmountElement = document.querySelector("#discountAmount");
let totalCostElement = document.querySelector("#totalCost");
let advanceElement = document.querySelector("#advance");
let balanceElement = document.querySelector("#balance");
let approvedByManagerElement = document.querySelector("#approvedByManager");


//compute discount amount, total cost, balance
function calculate() {
    let qty = Number(qtyElement.value) || 0;
    let unitCost = Number(unitCostElement.value) || 0;
    let inkCost = Number(inkCostElement.value) || 0;
    let paperCost = Number(paperCostElement.value) || 0;
    let designCost = Number(designCostElement.value) || 0;
    let discount = Number(discountElement.value) || 0;
    let advance = Number(advanceElement.value) || 0;

    let subTotal = (qty * unitCost) + inkCost + paperCost + designCost;
    let discountAmount = subTotal * (discount / 100);
    let total = subTotal - discountAmount;
    let balance = total - advance;

    discountAmountElement.value = discountAmount;
    totalCostElement.value = total;
    balanceElement.value = balance;

    production.quantity = qty;
    production.unitcost = unitCost;
    production.inkcost = inkCost;
    production.papercost = paperCost;
    production.designcost = designCost;
    production.discount = discount;
    production.discountamount = discountAmount;
    production.total = total;
    production.advance = advance;
    production.balance = balance;
}


//define function for refresh table................................................
const refreshProductionTable = () => {

    productions = getServiceRequest("/production/alldata");

    let propertyList = [
        { dataType: "string", propertyName: "jobid" },
        { dataType: "string", propertyName: "customername" },
        { dataType: "function", propertyName: (data) => data.product_id ? data.product_id.name : "" },
        { dataType: "string", propertyName: "quantity" },
        { dataType: "string", propertyName: "total" },
        { dataType: "string", propertyName: "balance" },
        { dataType: "string", propertyName: "jobstatus" }
    ];

    fillDataIntoTable(tableBodyProduction, productions, propertyList, refillProductionForm, deleteProduction, printProduction);

    for (const index in productions) {
        if (!userPrivi.privi_update)
            tableBodyProduction.children[index].children[8].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodyProduction.children[index].children[8].children[1].style.disabled = "disabled";
    }
}


//define function for refill(edit) form
const refillProductionForm = (dataOb) => {

    production = JSON.parse(JSON.stringify(dataOb));
    oldProduction = JSON.parse(JSON.stringify(dataOb));

    customerNameElement.value = production.customername;
    contactElement.value = production.contact;
    jobIdElement.value = production.jobid;
    jobStatusElement.value = production.jobstatus;
    orderedDateElement.value = production.ordereddate;
    deliveryDateElement.value = production.deliverydate;
    selectProductElement.value = production.product_id ? JSON.stringify(production.product_id) : "";
    designCategoryElement.value = production.designcategory;
    designFormatElement.value = production.designformat;
    printAreaElement.value = production.printarea;
    colorModeElement.value = production.colormode;
    designSizeElement.value = production.designsize;
    qtyElement.value = production.quantity;
    unitCostElement.value = production.unitcost;
    inkCostElement.value = production.inkcost;
    paperCostElement.value = production.papercost;
    designCostElement.value = production.designcost;
    discountElement.value = production.discount;
    discountAmountElement.value = production.discountamount;
    totalCostElement.value = production.total;
    advanceElement.value = production.advance;
    balanceElement.value = production.balance;
    approvedByManagerElement.checked = !!production.approvedbymanager;

    buttonSubmit.style.display = "none";
    buttonUpdate.style.display = "block";
}


//check form updates
const checkProductionFormUpdate = () => {

    let updates = "";

    if (production.jobstatus != oldProduction.jobstatus) {
        updates = updates + "Job Status Is Changed..! \n" + oldProduction.jobstatus + " into " + production.jobstatus + "\n";
    }
    if (production.total != oldProduction.total) {
        updates = updates + "Total Is Changed..! \n" + oldProduction.total + " into " + production.total + "\n";
    }
    if (production.advance != oldProduction.advance) {
        updates = updates + "Advance Is Changed..! \n" + oldProduction.advance + " into " + production.advance + "\n";
    }

    return updates;
}


//define function for update
const updateProduction = () => {

    let errors = checkFormError();

    if (errors == "") {
        let updates = checkProductionFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");
        } else {
            swal({
                title: "Are You Sure To Update This Production Job..?",
                text: "Following Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willUpdate) => {
                    if (willUpdate) {
                        let serviceResponse = getHTTPServiceRequest("/production/update", "PUT", production);

                        if (serviceResponse == "OK") {
                            swal("Update Completed..!", { icon: "success" });
                            refreshProductionTable();
                            refreshProductionForm();
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
const deleteProduction = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This Production Job..?",
        text: "Following Job Will Be Deleted..! \n" +
            "Job ID :" + dataOb.jobid +
            "\n Customer :" + dataOb.customername,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                let serviceResponse = getHTTPServiceRequest("/production/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {
                    swal("Delete Completed..!", { icon: "success" });
                    refreshProductionTable();
                } else {
                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");
                }
            }
        });
}


//define function for print
const printProduction = (dataOb) => {

    production = dataOb;
    let newWindow = window.open();

    newWindow.document.writeln(
        "<html><head><title> Print Production Job </title></head><body>" +
        "<h1> __________Production Job__________ </h1>" +
        "<p><strong> Job ID : </strong> " + production.jobid + "</p>" +
        "<p><strong> Customer : </strong> " + production.customername + "</p>" +
        "<p><strong> Product : </strong> " + (production.product_id ? production.product_id.name : "") + "</p>" +
        "<p><strong> Quantity : </strong> " + production.quantity + "</p>" +
        "<p><strong> Total : </strong> " + production.total + "</p>" +
        "<p><strong> Balance : </strong> " + production.balance + "</p>" +
        "<p><strong> Status : </strong> " + production.jobstatus + "</p>" +
        "</body></html>"
    );

    setInterval(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1000);
}


//refresh form.........................................................
const refreshProductionForm = () => {

    formProduction.reset();
    buttonUpdate.disabled = "disabled";
    jobIdElement.value = "";

    production = {
        customername: null,
        contact: null,
        jobstatus: null,
        ordereddate: null,
        deliverydate: null,
        product_id: null,
        designcategory: null,
        designformat: null,
        designfile: null,
        printarea: null,
        colormode: null,
        designsize: null,
        quantity: null,
        unitcost: null,
        inkcost: null,
        papercost: null,
        designcost: null,
        discount: 0,
        discountamount: 0,
        total: null,
        advance: 0,
        balance: null,
        approvedbymanager: false
    }

    approvedByManagerElement.checked = false;
}

//simple text/date field bindings
customerNameElement.addEventListener("keyup", () => { production.customername = customerNameElement.value || null; });
contactElement.addEventListener("keyup", () => { production.contact = contactElement.value || null; });
jobStatusElement.addEventListener("change", () => { production.jobstatus = jobStatusElement.value || null; });
orderedDateElement.addEventListener("change", () => { production.ordereddate = orderedDateElement.value || null; });
deliveryDateElement.addEventListener("change", () => { production.deliverydate = deliveryDateElement.value || null; });
selectProductElement.addEventListener("change", () => {
    production.product_id = selectProductElement.value ? JSON.parse(selectProductElement.value) : null;
});
designCategoryElement.addEventListener("change", () => { production.designcategory = designCategoryElement.value || null; });
designFormatElement.addEventListener("keyup", () => { production.designformat = designFormatElement.value || null; });
designFileElement.addEventListener("change", () => { production.designfile = designFileElement.value || null; });
printAreaElement.addEventListener("change", () => { production.printarea = printAreaElement.value || null; });
colorModeElement.addEventListener("change", () => { production.colormode = colorModeElement.value || null; });
designSizeElement.addEventListener("keyup", () => { production.designsize = designSizeElement.value || null; });
approvedByManagerElement.addEventListener("change", () => { production.approvedbymanager = approvedByManagerElement.checked; });


//define function check form error.........................
const checkFormError = () => {

    let errors = "";

    if (production.customername == null) errors = errors + "Please Enter Valid Customer Name ..!\n";
    if (production.contact == null) errors = errors + "Please Enter Valid Contact No ..!\n";
    if (production.jobstatus == null) errors = errors + "Please Select Valid Job Status ..!\n";
    if (production.ordereddate == null) errors = errors + "Please Enter Valid Ordered Date ..!\n";
    if (production.deliverydate == null) errors = errors + "Please Enter Valid Delivery Date ..!\n";
    if (!production.product_id) errors = errors + "Please Select A Mug Product ..!\n";
    if (production.designcategory == null) errors = errors + "Please Select Design Category ..!\n";
    if (production.designformat == null) errors = errors + "Please Enter Design Format ..!\n";
    if (production.printarea == null) errors = errors + "Please Select Print Area ..!\n";
    if (production.colormode == null) errors = errors + "Please Select Color Mode ..!\n";
    if (production.designsize == null) errors = errors + "Please Enter Design Size ..!\n";
    if (production.quantity == null || production.quantity <= 0) errors = errors + "Please Enter Valid Quantity ..!\n";
    if (production.unitcost == null) errors = errors + "Please Enter Valid Unit Cost ..!\n";

    return errors;
}


//define function for submit form
const submitProduction = () => {

    let errors = checkFormError();

    if (errors == "") {
        swal({
            title: "Are You Sure To Save This Production Job..?",
            text: "Following Production Job Will Be Saved..! ",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willSave) => {
                if (willSave) {
                    let serviceResponse = getHTTPServiceRequest("/production/save", "POST", production);

                    if (serviceResponse && serviceResponse.startsWith("OK")) {
                        swal("Save Completed..!", { icon: "success" });
                        refreshProductionTable();
                        refreshProductionForm();

                        let newId = serviceResponse.split(":")[1];
                        window.open("productionview/details?id=" + newId, "_blank");
                    } else {
                        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + serviceResponse, "error");
                    }
                }
            });
    } else {
        swal("Save Not Completed..!", "Form Has Some Errors..!\n" + errors, "error");
    }
}
