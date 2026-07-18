//access browser onload event..................................
window.addEventListener("load", () => {

    userPrivi = getHTTPServiceRequest("/userprivilagebymodule?modulename=inventory")

    //load product dropdown
    products = getServiceRequest("/product/alldata");
    fillDataToSelect(selectProductElement, "Select Product", products, "name");

    //call refresh tbl function ( whenbrowser refresh, when submid end, when update end, when delete end)
    refreshInventoryTable();

    //call refresh form function ( whenbrowser refresh, when submid end, when update end, when cler end)
    refreshInventoryForm();

});

//*********************************************************************************************
//*********************************************************************************************

let selectProductElement = document.querySelector("#selectProduct");
let textTotalquantityElement = document.querySelector("#textTotalquantity");
let textDamagedquantityElement = document.querySelector("#textDamagedquantity");
let textAvailablequantityElement = document.querySelector("#textAvailablequantity");
let textRopElement = document.querySelector("#textRop");
let textRoqElement = document.querySelector("#textRoq");


//define function for refresh inventory table................................................
const refreshInventoryTable = () => {

    //cach the database data
    inventories = getServiceRequest("/inventory/alldata");

    // table column count = property count
    let propertyList = [
        { dataType: "function", propertyName: (data) => data.product_id ? data.product_id.name + " (" + data.product_id.itemcode + ")" : "" },
        { dataType: "function", propertyName: (data) => data.product_id ? data.product_id.itemcode : "" },
        { dataType: "string", propertyName: "total" },
        { dataType: "string", propertyName: "damaged" },
        { dataType: "string", propertyName: "available" },
        { dataType: "string", propertyName: "rop" },
        { dataType: "string", propertyName: "roq" }
    ];

    //call filldatainto table
    fillDataIntoTable(tableBodyInventory, inventories, propertyList, refillInventoryForm, deleteInventory, printInventory);

    //user anuwa privilage wens weddi update and delete button desable weemata
    for (const index in inventories) {
        if (!userPrivi.privi_update)
            tableBodyInventory.children[index].children[8].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodyInventory.children[index].children[8].children[1].style.disabled = "disabled";
    }
}


//define function for refill(edit) form
const refillInventoryForm = (dataOb) => {

    inventory = JSON.parse(JSON.stringify(dataOb));
    oldInventory = JSON.parse(JSON.stringify(dataOb));

    selectProductElement.value = inventory.product_id ? JSON.stringify(inventory.product_id) : "";
    textTotalquantityElement.value = inventory.total;
    textDamagedquantityElement.value = inventory.damaged;
    textAvailablequantityElement.value = inventory.available;
    textRopElement.value = inventory.rop;
    textRoqElement.value = inventory.roq;

    buttonSubmit.style.display = "none";  // submit penne na
    buttonUpdate.style.display = "block";   // update penwa
}


//define function for  check form updates (mg ena eka wage )
const checkInventoryFormUpdate = () => {

    let updates = "";

    if (JSON.stringify(inventory.product_id) != JSON.stringify(oldInventory.product_id)) {
        updates = updates + "Product Is Changed..! \n";
    }
    if (inventory.total != oldInventory.total) {
        updates = updates + "Total Quantity Is Changed..! \n" + oldInventory.total + " into " + inventory.total + "\n";
    }
    if (inventory.damaged != oldInventory.damaged) {
        updates = updates + "Damaged Quantity Is Changed..! \n" + oldInventory.damaged + " into " + inventory.damaged + "\n";
    }
    if (inventory.available != oldInventory.available) {
        updates = updates + "Available Quantity Is Changed..! \n" + oldInventory.available + " into " + inventory.available + "\n";
    }
    if (inventory.rop != oldInventory.rop) {
        updates = updates + "ROP Is Changed..! \n" + oldInventory.rop + " into " + inventory.rop + "\n";
    }
    if (inventory.roq != oldInventory.roq) {
        updates = updates + "ROQ Is Changed..! \n" + oldInventory.roq + " into " + inventory.roq + "\n";
    }

    return updates;
}


//define function for update
const updateInventory = () => {

    //need to check errors
    let errors = checkFormError();

    if (errors == "") {

        let updates = checkInventoryFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");

        } else {
            swal({
                title: "Are You Sure To Update This Inventory Item..?",
                text: "Following Inventory Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })

                .then((willUpdate) => {

                    if (willUpdate) {

                        let serviceResponse = getHTTPServiceRequest("/inventory/update", "PUT", inventory);

                        if (serviceResponse == "OK") {
                            swal("Update Completed..!", {
                                icon: "success",
                            });

                            refreshInventoryTable();
                            refreshInventoryForm();

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
const deleteInventory = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This Inventory Item..?",
        text: "Following Inventory Details Will Be Deleted..! \n" +
            "Product :" + (dataOb.product_id ? dataOb.product_id.name : "") +
            "\n  Total Quantity :" + dataOb.total +
            "\n  Damaged Quantity :" + dataOb.damaged +
            "\n  Available Quantity :" + dataOb.available +
            "\n  ROP :" + dataOb.rop +
            "\n  ROQ :" + dataOb.roq,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    })

        .then((willDelete) => {

            if (willDelete) {

                let serviceResponse = getHTTPServiceRequest("/inventory/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {

                    swal("Delete Completed..!", {
                        icon: "success",
                    });

                    refreshInventoryTable();

                } else {
                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");

                };
            }

        });

}


//define function for print
const printInventory = (dataOb) => {

    inventory = dataOb;

    let newWindow = window.open();

    newWindow.document.writeln(
        "<html><head><title> Print Inventory Details </title></head><body>" +
        "<h1> __________Inventory Details__________ </h1>" +
        "<p><strong> Product : </strong> " + (inventory.product_id ? inventory.product_id.name : "") + "</p>" +
        "<p><strong> Total Quantity : </strong> " + inventory.total + "</p>" +
        "<p><strong> Damaged Quantity : </strong> " + inventory.damaged + "</p>" +
        "<p><strong> Available Quantity : </strong> " + inventory.available + "</p>" +
        "<p><strong> ROP : </strong> " + inventory.rop + "</p>" +
        "<p><strong> ROQ : </strong> " + inventory.roq + "</p>" +
        "</body></html>"

    );

    setInterval(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1000);
}


//*********************************************************************************************
//*********************************************************************************************


//define function for refresh  form.....................................................
const refreshInventoryForm = () => {

    formInventory.reset(); //clear static element value

    buttonUpdate.disabled = "disabled";    //update eka disable

    //create empty object
    inventory = {
        product_id: null,
        total: null,
        damaged: null,
        available: null,
        rop: null,
        roq: null
    };

    selectProductElement.style.border = "1px solid #ced4da";
    textTotalquantityElement.style.border = "1px solid #ced4da";
    textDamagedquantityElement.style.border = "1px solid #ced4da";
    textAvailablequantityElement.style.border = "1px solid #ced4da";
    textRopElement.style.border = "1px solid #ced4da";
    textRoqElement.style.border = "1px solid #ced4da";

}


//product validation
selectProductElement.addEventListener("change", () => {

    if (selectProductElement.value != "") {
        inventory.product_id = JSON.parse(selectProductElement.value);
        selectProductElement.style.border = "2px solid green";
    } else {
        inventory.product_id = null;
        selectProductElement.style.border = "2px solid red";
    }

});

//total quantity validation
textTotalquantityElement.addEventListener("keyup", () => {

    let total = textTotalquantityElement.value;
    let regPattern = new RegExp("^[0-9]{1,5}$");

    if (regPattern.test(total)) {
        inventory.total = Number(total);
        textTotalquantityElement.style.border = "2px solid green";
    } else {
        inventory.total = null;
        textTotalquantityElement.style.border = "2px solid red";
    }

});

//damaged quantity validation
textDamagedquantityElement.addEventListener("keyup", () => {

    let damaged = textDamagedquantityElement.value;
    let regPattern = new RegExp("^[0-9]{1,5}$");

    if (regPattern.test(damaged)) {
        inventory.damaged = Number(damaged);
        textDamagedquantityElement.style.border = "2px solid green";
    } else {
        inventory.damaged = null;
        textDamagedquantityElement.style.border = "2px solid red";
    }

});

//available quantity validation
textAvailablequantityElement.addEventListener("keyup", () => {

    let available = textAvailablequantityElement.value;
    let regPattern = new RegExp("^[0-9]{1,5}$");

    if (regPattern.test(available)) {
        inventory.available = Number(available);
        textAvailablequantityElement.style.border = "2px solid green";
    } else {
        inventory.available = null;
        textAvailablequantityElement.style.border = "2px solid red";
    }

});

//rop validation
textRopElement.addEventListener("keyup", () => {

    let rop = textRopElement.value;
    let regPattern = new RegExp("^[0-9]{1,5}$");

    if (regPattern.test(rop)) {
        inventory.rop = Number(rop);
        textRopElement.style.border = "2px solid green";
    } else {
        inventory.rop = null;
        textRopElement.style.border = "2px solid red";
    }

});

//roq validation
textRoqElement.addEventListener("keyup", () => {

    let roq = textRoqElement.value;
    let regPattern = new RegExp("^[0-9]{1,5}$");

    if (regPattern.test(roq)) {
        inventory.roq = Number(roq);
        textRoqElement.style.border = "2px solid green";
    } else {
        inventory.roq = null;
        textRoqElement.style.border = "2px solid red";
    }

});


//define function check form error.........................
const checkFormError = () => {

    let errors = "";

    if (!inventory.product_id) errors = errors + "Please Select Valid Product ..!\n";
    if (inventory.total == null) errors = errors + "Please Enter Valid Total Quantity ..!\n";
    if (inventory.damaged == null) errors = errors + "Please Enter Valid Damaged Quantity ..!\n";
    if (inventory.available == null) errors = errors + "Please Enter Valid Available Quantity ..!\n";
    if (inventory.rop == null) errors = errors + "Please Enter Valid ROP ..!\n";
    if (inventory.roq == null) errors = errors + "Please Enter Valid ROQ ..!\n";

    return errors;

}


//define function for submit user form
const submitInventory = () => {

    //need to check form error
    let errors = checkFormError();

    if (errors == "") {

        swal({
            title: "Are You Sure To Save This File..?",
            text: "Following Inventory Record Will Be Saved..! \n" +
                "\n Product :" + (inventory.product_id ? inventory.product_id.name : "") +
                "\n Total Quantity :" + inventory.total +
                "\n Damaged Quantity :" + inventory.damaged +
                "\n Available Quantity :" + inventory.available +
                "\n ROP :" + inventory.rop +
                "\n ROQ :" + inventory.roq,

            icon: "warning",
            buttons: true,
            dangerMode: true,
        })

            .then((willSave) => {

                if (willSave) {

                    let serviceResponse = getHTTPServiceRequest("/inventory/save", "POST", inventory);

                    if (serviceResponse == "OK") {
                        swal("Save Completed..!", {
                            icon: "success",
                        });

                        refreshInventoryTable();
                        refreshInventoryForm();

                    } else {
                        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + serviceResponse, "error");
                    }
                }

            });

    } else {
        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + errors, "error");
    }

}
