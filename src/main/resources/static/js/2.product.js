
//access browser onload event..................................
window.addEventListener("load", () => {

    userPrivi = getHTTPServiceRequest("/userprivilagebymodule?modulename=product")

    //load lookup dropdowns for statues/mugs
    statuesList = getServiceRequest("/statues/alldata");
    mugsList = getServiceRequest("/mugs/alldata");
    fillDataToSelect(selectStatueNameElement, "Select Name", statuesList, "name");
    fillDataToSelect(selectMugNameElement, "Select Name", mugsList, "name");

    //call refresh tbl function ( whenbrowser refresh, when submid end, when update end, when delete end)
    refreshArtsTable();
    refreshStatuesTable();
    refreshMugsTable();

    //call refresh form function ( whenbrowser refresh, when submid end, when update end, when cler end)
    refreshArtsForm();
    refreshStatuesForm();
    refreshMugsForm();

});

// object for binding data
let art = {};
let oldArt = null;

let statue = {};
let oldStatue = null;

let mug = {};
let oldMug = null;

let statuesList = [];
let mugsList = [];


//independantly load forms (show form)...............................
function showForm() {

    let type = document.getElementById("typeSelector").value;

    // hide all first
    document.getElementById("artsForm").style.display = "none";
    document.getElementById("statuesForm").style.display = "none";
    document.getElementById("mugsForm").style.display = "none";

    document.getElementById("artsTable").style.display = "none";
    document.getElementById("statuesTable").style.display = "none";
    document.getElementById("mugsTable").style.display = "none";

    //show the selected sections
    if (type === "arts") {
        document.getElementById("artsForm").style.display = "block";
        document.getElementById("artsTable").style.display = "block";

    } else if (type === "statues") {
        document.getElementById("statuesForm").style.display = "block";
        document.getElementById("statuesTable").style.display = "block";

    } else if (type === "mugs") {
        document.getElementById("mugsForm").style.display = "block";
        document.getElementById("mugsTable").style.display = "block";
    }
}


//**************************************************************************************
//******************************** ARTS SECTION ***********************************
//**************************************************************************************

//paintings form elements
let textArtistNameElement = document.querySelector("#textArtistName");
let textArtItemCodeElement = document.querySelector("#textArtItemCode");
let selectArtMediumElement = document.querySelector("#selectArtMedium");
let imgArtImageElement = document.querySelector("#imgArtImage");
let textArtDescriptionElement = document.querySelector("#textArtDescription");
let textArtPriceElement = document.querySelector("#textArtPrice");


//difine function for refresh art table.............................................
const refreshArtsTable = () => {

    //cach the database data
    products = getServiceRequest("/product/alldata?type=art");

    let propertyList = [
        { dataType: "string", propertyName: "name" },
        { dataType: "string", propertyName: "itemcode" },
        { dataType: "string", propertyName: "medium" },
        { dataType: "string", propertyName: "image" },
        { dataType: "string", propertyName: "artdescription" },
        { dataType: "string", propertyName: "price" }
    ];

    //call fill data into table
    fillDataIntoTable(tableBodyArts, products, propertyList, refillArtsForm, deleteArt, printArt);

    //user anuwa privilage wens weddi update and delete button desable weemata
    for (const index in products) {
        if (!userPrivi.privi_update)
            tableBodyArts.children[index].children[7].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodyArts.children[index].children[7].children[1].style.disabled = "disabled";
    }
}


//define function for refill(edit) art form
const refillArtsForm = (dataOb) => {

    art = JSON.parse(JSON.stringify(dataOb));
    oldArt = JSON.parse(JSON.stringify(dataOb));

    textArtistNameElement.value = art.name;
    textArtItemCodeElement.value = art.itemcode;
    selectArtMediumElement.value = art.medium;
    imgArtImageElement.value = "";
    textArtDescriptionElement.value = art.artdescription;
    textArtPriceElement.value = art.price;

    buttonSubmitArt.style.display = "none";  // submit penne na
    buttonUpdateArt.style.display = "block";   // update penwa

}

//define function for check artist form  updates
const checkArtsFormUpdate = () => {

    let updates = "";

    if (art.name != oldArt.name) {
        updates = updates + "Artist Name Is Changed..! \n" + oldArt.name + " into " + art.name + "\n";
    }
    if (art.itemcode != oldArt.itemcode) {
        updates = updates + "Item Code Is Changed..! \n" + oldArt.itemcode + " into " + art.itemcode + "\n";
    }
    if (art.medium != oldArt.medium) {
        updates = updates + "Paint Medium Is Changed..! \n" + oldArt.medium + " into " + art.medium + "\n";
    }
    if (art.artdescription != oldArt.artdescription) {
        updates = updates + "Description Is Changed..! \n" + oldArt.artdescription + " into " + art.artdescription + "\n";
    }
    if (art.price != oldArt.price) {
        updates = updates + "Price Is Changed..! \n" + oldArt.price + " into " + art.price + "\n";
    }

    return updates;
}


//define function for update art
const updateArt = () => {

    let errors = checkArtsFormError();

    if (errors == "") {

        let updates = checkArtsFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");
        } else {
            swal({
                title: "Are You Sure To Update This Art Details..?",
                text: "Following Art Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willUpdate) => {
                    if (willUpdate) {
                        let serviceResponse = getHTTPServiceRequest("/product/update", "PUT", art);

                        if (serviceResponse == "OK") {
                            swal("Update Completed..!", { icon: "success" });
                            refreshArtsTable();
                            refreshArtsForm();
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


// define function for delete artist
const deleteArt = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This Art Details..?",
        text: "Following Art Details Will Be Deleted..! \n" +
            "Artist Name : " + dataOb.name +
            "\n Item Code : " + dataOb.itemcode +
            "\n Medium : " + dataOb.medium +
            "\n Description : " + dataOb.artdescription +
            "\n Price : " + dataOb.price,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                let serviceResponse = getHTTPServiceRequest("/product/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {
                    swal("Delete Completed..!", { icon: "success" });
                    refreshArtsTable();
                } else {
                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");
                }
            }
        });
}


//define function for print artist
const printArt = (dataOb) => {

    art = dataOb;
    let newWindow = window.open();

    newWindow.document.write(
        "<html><head><title> Print Art Details </title></head><body>" +
        "<h2> __________Art Details__________ </h2>" +
        "<p><strong>Artist Name : </strong> " + art.name + "</p>" +
        "<p><strong>Item Code : </strong>" + art.itemcode + "</p>" +
        "<p><strong>Medium : </strong> " + art.medium + "</p>" +
        "<p><strong>Description : </strong>" + art.artdescription + "</p>" +
        "<p><strong>Price : </strong>" + art.price + "</p>" +
        "</body></html>"
    );

    setInterval(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1000);
}


//refresh artist form.........................................................
const refreshArtsForm = () => {

    artsForm.reset();
    buttonUpdateArt.disabled = "disabled";

    art = {
        producttype: "art",
        name: null,
        itemcode: null,
        medium: null,
        image: null,
        artdescription: null,
        price: null
    }

    textArtistNameElement.style.border = "1px solid #ced4da";
    textArtItemCodeElement.style.border = "1px solid #ced4da";
    selectArtMediumElement.style.border = "1px solid #ced4da";
    imgArtImageElement.style.border = "1px solid #ced4da";
    textArtDescriptionElement.style.border = "1px solid #ced4da";
    textArtPriceElement.style.border = "1px solid #ced4da";
}

//artist name validation
textArtistNameElement.addEventListener("keyup", () => {
    let name = textArtistNameElement.value;
    let regPattern = new RegExp("^[A-Za-z\\s]{3,50}$");

    if (regPattern.test(name)) {
        art.name = name;
        textArtistNameElement.style.border = "2px solid green";
    } else {
        art.name = null;
        textArtistNameElement.style.border = "2px solid red";
    }
});

//itm code validation
textArtItemCodeElement.addEventListener("keyup", () => {
    let itemcode = textArtItemCodeElement.value;

    if (itemcode.trim().length >= 3) {
        art.itemcode = itemcode;
        textArtItemCodeElement.style.border = "2px solid green";
    } else {
        art.itemcode = null;
        textArtItemCodeElement.style.border = "2px solid red";
    }
});

//medium validation
selectArtMediumElement.addEventListener("change", () => {
    if (selectArtMediumElement.value != "") {
        art.medium = selectArtMediumElement.value;
        selectArtMediumElement.style.border = "2px solid green";
    } else {
        art.medium = null;
        selectArtMediumElement.style.border = "2px solid red";
    }
});

//image validation
imgArtImageElement.addEventListener("change", () => {
    if (imgArtImageElement.value != "") {
        art.image = imgArtImageElement.value;
        imgArtImageElement.style.border = "2px solid green";
    } else {
        art.image = null;
        imgArtImageElement.style.border = "2px solid red";
    }
});

//discription validation
textArtDescriptionElement.addEventListener("keyup", () => {
    let artdescription = textArtDescriptionElement.value;
    let regPattern = new RegExp("^[A-Za-z:/,. 0-9]{7,350}$");

    if (regPattern.test(artdescription)) {
        art.artdescription = artdescription;
        textArtDescriptionElement.style.border = "2px solid green";
    } else {
        art.artdescription = null;
        textArtDescriptionElement.style.border = "2px solid red";
    }
});

//price validation
textArtPriceElement.addEventListener("keyup", () => {
    let price = textArtPriceElement.value;

    if (price != "" && Number(price) > 0) {
        art.price = Number(price);
        textArtPriceElement.style.border = "2px solid green";
    } else {
        art.price = null;
        textArtPriceElement.style.border = "2px solid red";
    }
});


//check art form errors..............
const checkArtsFormError = () => {

    let errors = "";

    if (art.name == null) errors = errors + "Please Enter Valid Artist Name ..! \n";
    if (art.itemcode == null) errors = errors + "Please Enter Valid Item Code ..! \n";
    if (art.medium == null) errors = errors + "Please Select Medium ..! \n";
    if (art.artdescription == null) errors = errors + "Please Enter Description About The Art ..! \n";
    if (art.price == null) errors = errors + "Please Enter Valid Price ..! \n";

    return errors;
}


//define function for submit art form...........
const submitArtsForm = () => {

    let errors = checkArtsFormError();

    if (errors == "") {
        swal({
            title: "Are You Sure To Save This Art Details..?",
            text: "Added Art Details Will Be Saved..! ",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willSave) => {
                if (willSave) {
                    let serviceResponse = getHTTPServiceRequest("/product/save", "POST", art);

                    if (serviceResponse == "OK") {
                        swal("Save Completed..!", { icon: "success" });
                        refreshArtsTable();
                        refreshArtsForm();
                    } else {
                        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + serviceResponse, "error");
                    }
                }
            });
    } else {
        swal("Save Not Completed..!", "Form Has Some Errors..!\n" + errors, "error");
    }
}


//*************************************************************************************
//******************************** STATUES SECTION ************************************
//*************************************************************************************

function updateStatueItemCode() {
    if (!selectStatueNameElement.value) return;
    const selectedItem = JSON.parse(selectStatueNameElement.value);
    statue.statue_id = selectedItem;
    document.getElementById("textStatueItemCode").value = selectedItem ? selectedItem.code : "";
}

//statues form elements
let textStatueSupplierNameElement = document.querySelector("#textStatueSupplierName");
let selectStatueNameElement = document.querySelector("#selectStatueName");
let textStatueItemCodeElement = document.querySelector("#textStatueItemCode");
let imgStatueImageElement = document.querySelector("#imgStatueImage");
let textStatuePriceElement = document.querySelector("#textStatuePrice");


//difine function for refresh statue table.............................................
const refreshStatuesTable = () => {

    statues = getServiceRequest("/product/alldata?type=statue");

    let propertyList = [
        { dataType: "string", propertyName: "name" },
        { dataType: "function", propertyName: (data) => data.statue_id ? data.statue_id.name : "" },
        { dataType: "string", propertyName: "itemcode" },
        { dataType: "string", propertyName: "image" },
        { dataType: "string", propertyName: "price" }
    ];

    fillDataIntoTable(tableBodyStatues, statues, propertyList, refillStatuesForm, deleteStatue, printStatue);

    for (const index in statues) {
        if (!userPrivi.privi_update)
            tableBodyStatues.children[index].children[6].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodyStatues.children[index].children[6].children[1].style.disabled = "disabled";
    }
}

//define function for refill(edit) statue form
const refillStatuesForm = (dataOb) => {

    statue = JSON.parse(JSON.stringify(dataOb));
    oldStatue = JSON.parse(JSON.stringify(dataOb));

    textStatueSupplierNameElement.value = statue.name;
    selectStatueNameElement.value = statue.statue_id ? JSON.stringify(statue.statue_id) : "";
    textStatueItemCodeElement.value = statue.itemcode;
    imgStatueImageElement.value = "";
    textStatuePriceElement.value = statue.price;

    buttonSubmitStatue.style.display = "none";
    buttonUpdateStatue.style.display = "block";
}

//define function for check statue form  updates
const checkStatuesFormUpdate = () => {

    let updates = "";

    if (statue.name != oldStatue.name) {
        updates = updates + "Supplier Name Is Changed..! \n" + oldStatue.name + " into " + statue.name + "\n";
    }
    if (JSON.stringify(statue.statue_id) != JSON.stringify(oldStatue.statue_id)) {
        updates = updates + "Statue Name Is Changed..! \n";
    }
    if (statue.itemcode != oldStatue.itemcode) {
        updates = updates + "Statue Item Code Is Changed..! \n" + oldStatue.itemcode + " into " + statue.itemcode + "\n";
    }
    if (statue.price != oldStatue.price) {
        updates = updates + "Statue Price Is Changed..! \n" + oldStatue.price + " into " + statue.price + "\n";
    }

    return updates;
}

//define function for update statue
const updateStatue = () => {

    let errors = checkStatuesFormError();

    if (errors == "") {

        let updates = checkStatuesFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");
        } else {
            swal({
                title: "Are You Sure To Update This Statue..?",
                text: "Following Statue Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willUpdate) => {
                    if (willUpdate) {
                        let serviceResponse = getHTTPServiceRequest("/product/update", "PUT", statue);

                        if (serviceResponse == "OK") {
                            swal("Update Completed..!", { icon: "success" });
                            refreshStatuesTable();
                            refreshStatuesForm();
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

// define function for delete statue
const deleteStatue = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This Statue..?",
        text: "Following Statue Details Will Be Deleted..! \n" +
            "Supplier Shop Name : " + dataOb.name +
            "\n Item Code : " + dataOb.itemcode +
            "\n Price : " + dataOb.price,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                let serviceResponse = getHTTPServiceRequest("/product/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {
                    swal("Delete Completed..!", { icon: "success" });
                    refreshStatuesTable();
                } else {
                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");
                }
            }
        });
}

//define function for print statue
const printStatue = (dataOb) => {

    statue = dataOb;
    let newWindow = window.open();

    newWindow.document.write(
        "<html><head><title> Print Statue Details </title></head><body>" +
        "<h2> __________Statue Details__________ </h2>" +
        "<p><strong>Supplier Shop Name : </strong> " + statue.name + "</p>" +
        "<p><strong>Statue Name : </strong> " + (statue.statue_id ? statue.statue_id.name : "") + "</p>" +
        "<p><strong>Item Code : </strong> " + statue.itemcode + "</p>" +
        "<p><strong>Price : </strong> " + statue.price + "</p>" +
        "</body></html>"
    );

    setInterval(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1000);
}


//refresh statue form.........................................................
const refreshStatuesForm = () => {

    statuesForm.reset();
    buttonUpdateStatue.disabled = "disabled";

    statue = {
        producttype: "statue",
        name: null,
        statue_id: null,
        itemcode: null,
        image: null,
        price: null
    }

    textStatueSupplierNameElement.style.border = "1px solid #ced4da";
    selectStatueNameElement.style.border = "1px solid #ced4da";
    textStatueItemCodeElement.style.border = "1px solid #ced4da";
    imgStatueImageElement.style.border = "1px solid #ced4da";
    textStatuePriceElement.style.border = "1px solid #ced4da";
}

//supplier name validation
textStatueSupplierNameElement.addEventListener("keyup", () => {
    let name = textStatueSupplierNameElement.value;
    let regPattern = new RegExp("^[A-Za-z\\s]{3,50}$");

    if (regPattern.test(name)) {
        statue.name = name;
        textStatueSupplierNameElement.style.border = "2px solid green";
    } else {
        statue.name = null;
        textStatueSupplierNameElement.style.border = "2px solid red";
    }
});

//statue name validation
selectStatueNameElement.addEventListener("change", () => {
    if (selectStatueNameElement.value != "") {
        selectStatueNameElement.style.border = "2px solid green";
    } else {
        statue.statue_id = null;
        selectStatueNameElement.style.border = "2px solid red";
    }
});

//item code validation
textStatueItemCodeElement.addEventListener("keyup", () => {
    let itemcode = textStatueItemCodeElement.value;

    if (itemcode.trim().length >= 3) {
        statue.itemcode = itemcode;
        textStatueItemCodeElement.style.border = "2px solid green";
    } else {
        statue.itemcode = null;
        textStatueItemCodeElement.style.border = "2px solid red";
    }
});

//image validation
imgStatueImageElement.addEventListener("change", () => {
    if (imgStatueImageElement.value != "") {
        statue.image = imgStatueImageElement.value;
        imgStatueImageElement.style.border = "2px solid green";
    } else {
        statue.image = null;
        imgStatueImageElement.style.border = "2px solid red";
    }
});

//price validation
textStatuePriceElement.addEventListener("keyup", () => {
    let price = textStatuePriceElement.value;

    if (price != "" && Number(price) > 0) {
        statue.price = Number(price);
        textStatuePriceElement.style.border = "2px solid green";
    } else {
        statue.price = null;
        textStatuePriceElement.style.border = "2px solid red";
    }
});


//check statue form errors..............
const checkStatuesFormError = () => {

    let errors = "";

    if (statue.name == null) errors = errors + "Please Enter Valid Supplier Name ..! \n";
    if (!statue.statue_id) errors = errors + "Please Select Statue Name ..! \n";
    if (statue.itemcode == null) errors = errors + "Please Enter Valid Item Code ..! \n";
    if (statue.price == null) errors = errors + "Please Enter Valid Price ..! \n";
    if (statue.image == null) errors = errors + "Please Upload An Image ..! \n";

    return errors;
}


//define function for submit statue form...........
const submitStatuesForm = () => {

    let errors = checkStatuesFormError();

    if (errors == "") {
        swal({
            title: "Are You Sure To Save This Statue..?",
            text: "Added Statue Details Will Be Saved..! ",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willSave) => {
                if (willSave) {
                    let serviceResponse = getHTTPServiceRequest("/product/save", "POST", statue);

                    if (serviceResponse == "OK") {
                        swal("Save Completed..!", { icon: "success" });
                        refreshStatuesTable();
                        refreshStatuesForm();
                    } else {
                        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + serviceResponse, "error");
                    }
                }
            });
    } else {
        swal("Save Not Completed..!", "Form Has Some Errors..!\n" + errors, "error");
    }
}


//**********************************************************************************
//******************************** MUGS SECTION ************************************
//**********************************************************************************

function updateMugItemCode() {
    if (!selectMugNameElement.value) return;
    const selectedItem = JSON.parse(selectMugNameElement.value);
    mug.mug_id = selectedItem;
    document.getElementById("textMugItemCode").value = selectedItem ? selectedItem.code : "";
}

//mug form elements
let textMugSupplierNameElement = document.querySelector("#textMugSupplierName");
let selectMugNameElement = document.querySelector("#selectMugName");
let textMugItemCodeElement = document.querySelector("#textMugItemCode");
let imgMugImageElement = document.querySelector("#imgMugImage");
let textMugPriceElement = document.querySelector("#textMugPrice");

//difine function for refresh mug table.............................................
const refreshMugsTable = () => {

    mugs = getServiceRequest("/product/alldata?type=mug");

    let propertyList = [
        { dataType: "string", propertyName: "name" },
        { dataType: "function", propertyName: (data) => data.mug_id ? data.mug_id.name : "" },
        { dataType: "string", propertyName: "itemcode" },
        { dataType: "string", propertyName: "image" },
        { dataType: "string", propertyName: "price" }
    ];

    fillDataIntoTable(tableBodyMugs, mugs, propertyList, refillMugsForm, deleteMug, printMug);

    for (const index in mugs) {
        if (!userPrivi.privi_update)
            tableBodyMugs.children[index].children[6].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodyMugs.children[index].children[6].children[1].style.disabled = "disabled";
    }
}

//define function for refill(edit) mug form
const refillMugsForm = (dataOb) => {

    mug = JSON.parse(JSON.stringify(dataOb));
    oldMug = JSON.parse(JSON.stringify(dataOb));

    textMugSupplierNameElement.value = mug.name;
    selectMugNameElement.value = mug.mug_id ? JSON.stringify(mug.mug_id) : "";
    textMugItemCodeElement.value = mug.itemcode;
    imgMugImageElement.value = "";
    textMugPriceElement.value = mug.price;

    buttonSubmitMugs.style.display = "none";
    buttonUpdateMugs.style.display = "block";
}

//define function for check mug form  updates
const checkMugsFormUpdate = () => {

    let updates = "";

    if (mug.name != oldMug.name) {
        updates = updates + "Mug Supplier Shop Name Is Changed..! \n" + oldMug.name + " into " + mug.name + "\n";
    }
    if (JSON.stringify(mug.mug_id) != JSON.stringify(oldMug.mug_id)) {
        updates = updates + "Mug Name Is Changed..! \n";
    }
    if (mug.itemcode != oldMug.itemcode) {
        updates = updates + "Mug Item Code Is Changed..! \n" + oldMug.itemcode + " into " + mug.itemcode + "\n";
    }
    if (mug.price != oldMug.price) {
        updates = updates + "Mug Price Is Changed..! \n" + oldMug.price + " into " + mug.price + "\n";
    }

    return updates;
}

//define function for update mug
const updateMug = () => {

    let errors = checkMugsFormError();

    if (errors == "") {

        let updates = checkMugsFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");
        } else {
            swal({
                title: "Are You Sure To Update This Mug Details..?",
                text: "Following Mug Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willUpdate) => {
                    if (willUpdate) {
                        let serviceResponse = getHTTPServiceRequest("/product/update", "PUT", mug);

                        if (serviceResponse == "OK") {
                            swal("Update Completed..!", { icon: "success" });
                            refreshMugsTable();
                            refreshMugsForm();
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

// define function for delete mug
const deleteMug = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This Mug Details..?",
        text: "Following Mug Details Will Be Deleted..! \n" +
            "Supplier Shop Name : " + dataOb.name +
            "\n Item Code : " + dataOb.itemcode +
            "\n Price : " + dataOb.price,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                let serviceResponse = getHTTPServiceRequest("/product/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {
                    swal("Delete Completed..!", { icon: "success" });
                    refreshMugsTable();
                } else {
                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");
                }
            }
        });
}

//define function for print mug
const printMug = (dataOb) => {

    mug = dataOb;
    let newWindow = window.open();

    newWindow.document.write(
        "<html><head><title> Print Mug Details </title></head><body>" +
        "<h2> __________Mug Details__________ </h2>" +
        "<p><strong>Supplier Shop Name : </strong> " + mug.name + "</p>" +
        "<p><strong>Mug Name : </strong> " + (mug.mug_id ? mug.mug_id.name : "") + "</p>" +
        "<p><strong>Item Code : </strong> " + mug.itemcode + "</p>" +
        "<p><strong>Price : </strong> " + mug.price + "</p>" +
        "</body></html>"
    );

    setInterval(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1000);
}


//refresh mug form.........................................................
const refreshMugsForm = () => {

    mugsForm.reset();
    buttonUpdateMugs.disabled = "disabled";

    mug = {
        producttype: "mug",
        name: null,
        mug_id: null,
        itemcode: null,
        image: null,
        price: null
    }

    textMugSupplierNameElement.style.border = "1px solid #ced4da";
    selectMugNameElement.style.border = "1px solid #ced4da";
    textMugItemCodeElement.style.border = "1px solid #ced4da";
    imgMugImageElement.style.border = "1px solid #ced4da";
    textMugPriceElement.style.border = "1px solid #ced4da";
}

//supplier name validation
textMugSupplierNameElement.addEventListener("keyup", () => {
    let name = textMugSupplierNameElement.value;
    let regPattern = new RegExp("^[A-Za-z\\s]{3,50}$");

    if (regPattern.test(name)) {
        mug.name = name;
        textMugSupplierNameElement.style.border = "2px solid green";
    } else {
        mug.name = null;
        textMugSupplierNameElement.style.border = "2px solid red";
    }
});

//mug name validation
selectMugNameElement.addEventListener("change", () => {
    if (selectMugNameElement.value != "") {
        selectMugNameElement.style.border = "2px solid green";
    } else {
        mug.mug_id = null;
        selectMugNameElement.style.border = "2px solid red";
    }
});

//item code validation
textMugItemCodeElement.addEventListener("keyup", () => {
    let itemcode = textMugItemCodeElement.value;

    if (itemcode.trim().length >= 3) {
        mug.itemcode = itemcode;
        textMugItemCodeElement.style.border = "2px solid green";
    } else {
        mug.itemcode = null;
        textMugItemCodeElement.style.border = "2px solid red";
    }
});

//image validation
imgMugImageElement.addEventListener("change", () => {
    if (imgMugImageElement.value != "") {
        mug.image = imgMugImageElement.value;
        imgMugImageElement.style.border = "2px solid green";
    } else {
        mug.image = null;
        imgMugImageElement.style.border = "2px solid red";
    }
});

//price validation
textMugPriceElement.addEventListener("keyup", () => {
    let price = textMugPriceElement.value;

    if (price != "" && Number(price) > 0) {
        mug.price = Number(price);
        textMugPriceElement.style.border = "2px solid green";
    } else {
        mug.price = null;
        textMugPriceElement.style.border = "2px solid red";
    }
});


//check mug form errors..............
const checkMugsFormError = () => {

    let errors = "";

    if (mug.name == null) errors = errors + "Please Enter Valid Supplier Name ..! \n";
    if (!mug.mug_id) errors = errors + "Please Select Valid Mug Name ..! \n";
    if (mug.itemcode == null) errors = errors + "Please Enter Valid Item Code ..! \n";
    if (mug.price == null) errors = errors + "Please Enter Valid Mug Price ..! \n";
    if (mug.image == null) errors = errors + "Please Upload An Image ..! \n";

    return errors;
}

//define function for submit mug form...........
const submitMugsForm = () => {

    let errors = checkMugsFormError();

    if (errors == "") {
        swal({
            title: "Are You Sure To Save This Mug Details..?",
            text: "Added Mug Details Will Be Saved..! ",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willSave) => {
                if (willSave) {
                    let serviceResponse = getHTTPServiceRequest("/product/save", "POST", mug);

                    if (serviceResponse == "OK") {
                        swal("Save Completed..!", { icon: "success" });
                        refreshMugsTable();
                        refreshMugsForm();
                    } else {
                        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + serviceResponse, "error");
                    }
                }
            });
    } else {
        swal("Save Not Completed..!", "Form Has Some Errors..!\n" + errors, "error");
    }
}
