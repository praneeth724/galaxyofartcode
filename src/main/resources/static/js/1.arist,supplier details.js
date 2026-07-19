
//access browser onload event..................................
window.addEventListener("load", () => {

    userPrivi = getHTTPServiceRequest("/userprivilagebymodule?modulename=artistsupplierDetails")

    //call refresh tbl function ( whenbrowser refresh, when submid end, when update end, when delete end)
    refreshArtistTable();
    refreshSupplierTable();


    //call refresh form function ( whenbrowser refresh, when submid end, when update end, when cler end)
    refreshArtistForm();
    refreshSupplierForm();

});

// object for binding data
let artist = {};
let oldArtist = null;

let supplier = {};
let oldSupplier = null;


//independantly load forms (show form)...............................
function showForm() {

    let type = document.getElementById("typeSelector").value;

    document.getElementById("artistForm").style.display = "none";
    document.getElementById("supplierForm").style.display = "none";

    document.getElementById("artistTable").style.display = "none";
    document.getElementById("supplierTable").style.display = "none";

    //show the selected sections
    if (type == "artist") {

        artist.type = "artist";

        document.getElementById("artistForm").style.display = "block";
        document.getElementById("artistTable").style.display = "block";
    }

    if (type == "supplier") {

        supplier.type = "supplier";

        document.getElementById("supplierForm").style.display = "block";
        document.getElementById("supplierTable").style.display = "block";
    }

}



//**************************************************************************************
//******************************** ARTIST SECTION **************************************
//**************************************************************************************


//artist form elements
let textNameElement = document.querySelector("#textName");
let textNICElement = document.querySelector("#textNIC");
let textContactElement = document.querySelector("#textContact");
let textEmailElement = document.querySelector("#textEmail");

let textBeneficiaryElement = document.querySelector("#textBeneficiary");
let textBankElement = document.querySelector("#textBank");
let textAccountElement = document.querySelector("#textAccount");

let buttonArtistSubmitElement = document.querySelector("#buttonArtistSubmit");
let buttonArtistUpdateElement = document.querySelector("#buttonArtistUpdate");


//difine function for refresh artist table.............................................
const refreshArtistTable = () => {


    //cach the database data 
    let artists = getServiceRequest("/artistsupplierdetails/artists");

    //string--->string/text/date/number
    //function---> object/arry/boolean/ if direct property not exist

    // table column count = property count 
    let propertyList = [
        { dataType: "string", propertyName: "name" },
        { dataType: "string", propertyName: "nic" },
        { dataType: "string", propertyName: "contact" },
        { dataType: "string", propertyName: "email" },
        { dataType: "string", propertyName: "beneficiary" },
        { dataType: "string", propertyName: "bank" },
        { dataType: "string", propertyName: "account" }
    ];


    //call fill data into table
    fillDataIntoTable(tableBodyArtist, artists, propertyList, refillArtistForm, deleteArtist, printArtist);

    //user anuwa privilage wens weddi update and delete button desable weemata
    for (const index in artists) {
        if (!userPrivi.privi_update)
            tableBodyArtist.children[index].children[8].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodyArtist.children[index].children[8].children[1].style.disabled = "disabled";
    }

}


//define function for refill(edit) artist form
const refillArtistForm = (dataOb) => {

    artist = JSON.parse(JSON.stringify(dataOb));
    oldArtist = JSON.parse(JSON.stringify(dataOb));

    textNameElement.value = artist.name;
    textNICElement.value = artist.nic;
    textContactElement.value = artist.contact;
    textEmailElement.value = artist.email;
    textBeneficiaryElement.value = artist.beneficiary;
    textBankElement.value = artist.bank;
    textAccountElement.value = artist.account;

    buttonArtistSubmitElement.style.display = "none";  // submit penne na
    buttonArtistUpdateElement.style.display = "inline-block";   // update penwa
    buttonArtistUpdateElement.disabled = false;   // Important


}


//define function for check artist form  updates
const checkArtistFormUpdate = () => {

    let updates = "";

    if (artist.name != oldArtist.name) {
        updates = updates + "Artist Name Is Changed..! \n" + oldArtist.name + "into" + artist.name + "\n";
    }

    if (artist.nic != oldArtist.nic) {
        updates = updates + "NIC  Is Changed..! \n" + oldArtist.nic + "into" + artist.nic + "\n";
    }


    if (artist.contact != oldArtist.contact) {
        updates = updates + "Contact No. Is Changed..! \n" + oldArtist.contact + "into" + artist.contact + "\n";
    }


    if (artist.email != oldArtist.email) {
        updates = updates + "Email Is Changed..! \n" + oldArtist.email + "into" + artist.email + "\n";
    }

    if (artist.beneficiary != oldArtist.beneficiary) {
        updates = updates + "Beneficiary Name Is Changed..! \n" + oldArtist.beneficiary + "into" + artist.beneficiary + "\n";
    }

    if (artist.bank != oldArtist.bank) {
        updates = updates + "Bank Name Is Changed..! \n" + oldArtist.bank + "into" + artist.bank + "\n";
    }

    if (artist.account != oldArtist.account) {
        updates = updates + "Email Is Changed..! \n" + oldArtist.account + "into" + artist.account + "\n";
    }


    return updates;

}


//define function for update artist
const updateArtist = () => {

    //need to check errors
    let errors = checkArtistFormError();

    if (errors == "") {
        //swal("Update Not Completed..!", " Form Hasn't Any Changes..! \n", "error");

        let updates = checkArtistFormUpdate();

        if (updates == "") {

            swal("No Changes Found..!", "", "warning");

        } else {

            swal({
                title: "Are You Sure To Update This Artist..?",
                text: "Following Artist Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })

                .then((willUpdate) => {

                    if (willUpdate) {

                        let serviceResponse = getHTTPServiceRequest("/artist/update", "PUT", artist);

                        if (serviceResponse == "OK") {

                            swal("Update Completed..!", {
                                icon: "success",
                            });

                            refreshArtistTable();
                            refreshArtistForm();

                            // Hide the modal form
                            //$("#modalEmployeeForm").modal("hide");

                        } else {

                            swal("Update Not Completed..!", " Form Hasn't Any Changes..! \n" + serviceResponse, "error");

                        }

                    }

                });

        }

    } else {

        swal("Update Not Completed..!", "Form Has Errors..! \n", errors, "error");

    }

}


// define function for delete artist
const deleteArtist = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This Artist..?",
        text: "Following Artist Details Will Be Deleted..! \n" +
            "Artist Name" + dataOb.name +
            "\n Artist NIC" + dataOb.nic +
            "\n Artist Email" + dataOb.email +
            "\n Artist Contact No" + dataOb.contact +
            "\n Beneficiary Name" + dataOb.beneficiary +
            "\n Bank Name" + dataOb.bank +
            "\n Account No" + dataOb.account,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })

        .then((willDelete) => {

            if (willDelete) {

                let serviceResponse = getHTTPServiceRequest("/artistsupplierdetails/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {

                    swal("Delete Completed..!", {
                        icon: "success",
                    });

                    refreshArtistTable();

                } else {

                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");

                }

            }

        });

}


//define function for print artist
const printArtist = (dataOb) => {

    artist = dataOb;

    //option 1- open new print tab to print
    let newWindow = window.open();

    newWindow.document.write(
        "<html><head><title> Print Artist Details </title></head><body>" +
        "<h2> __________Artist Details__________ </h2>" +
        "<p><strong> Artist Name : <strong> " + artist.name + "</p>" +
        "<p><strong> NIC : <strong>" + artist.nic + "</p>" +
        "<p><strong> Contact : <strong> " + artist.contact + "</p>" +
        "<p><strong> Email : <strong> " + artist.email + "</p>" +
        "</body></html>"
    );

    setInterval(() => {

        // Stops the loading of content in the 'newWindow'
        newWindow.stop();

        // Triggers the print dialog for the content within 'newWindow'
        newWindow.print();

        // Closes the 'newWindow' after the print dialog is initiated (or closed by the user)
        newWindow.close();

    }, 1000);

}




//*********************************************************************************************
//********************************************************************************************* 



//refresh artist form.........................................................
const refreshArtistForm = () => {

    //clear static element
    formArtistSupplier.reset();

    //if (!userPrivi.privi_insert) { //update ekdi submit disable
        //buttonArtistSubmitElement.disabled = "disabled";
    //}

    buttonArtistUpdateElement.disabled = "disabled"; //submit eke update disable

    //create empty object
    //artist = new Object();
    artist = {
        type: "artist",
        name: "",
        nic: "",
        contact: "",
        email: "",
        beneficiary: "",
        bank: "",
        account: ""
    }
    
    textNameElement.style.border = "1px solid #ced4da";
    textNICElement.style.border = "1px solid #ced4da";
    textContactElement.style.border = "1px solid #ced4da";
    textEmailElement.style.border = "1px solid #ced4da";
    textBeneficiaryElement.style.border = "1px solid #ced4da";
    textBankElement.style.border = "1px solid #ced4da";
    textAccountElement.style.border = "1px solid #ced4da";

    //cler all element (border colur)
    //clearElement([textArtistNameElement, textNICElement, textContactElement, textEmailElement, textBeneficiaryElement, textBankElement, textAccountElement]);

}

//artist name validation
textNameElement.addEventListener("keyup", () => {

    let name = textNameElement.value;
    let regPattern = /^\p{L}[\p{L}0-9\s.,'&()-]{1,69}$/u;

    if (regPattern.test(name)) {

        artist.name = name;
        textNameElement.style.border = "2px solid green";

    } else {

        artist.name = null;
        textNameElement.style.border = "2px solid red";
    }

});


//nic validation
textNICElement.addEventListener("keyup", () => {

    let nic = textNICElement.value;
    let regPattern = new RegExp("^(([0-9]{9}[VvXx])|([0-9]{12}))$");

    if (regPattern.test(nic)) {

        artist.nic = nic;
        textNICElement.style.border = "2px solid green";

    } else {

        artist.nic = null;
        textNICElement.style.border = "2px solid red";
    }

});


//contact validation
textContactElement.addEventListener("keyup", () => {

    let contact = textContactElement.value;
    let regPattern = new RegExp("^[0]{1}[7][01245678]{1}[0-9]{7}$");

    if (regPattern.test(contact)) {

        artist.contact = contact;
        textContactElement.style.border = "2px solid green";

    } else {

        artist.contact = null;
        textContactElement.style.border = "2px solid red";
    }

});


//email validation
textEmailElement.addEventListener("keyup", () => {

    let email = textEmailElement.value;
    let regPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (regPattern.test(email)) {

        artist.email = email;
        textEmailElement.style.border = "2px solid green";

    } else {

        artist.email = null;
        textEmailElement.style.border = "2px solid red";
    }

});


//beneficiaryname validation
textBeneficiaryElement.addEventListener("keyup", () => {

    let beneficiary = textBeneficiaryElement.value;
    let regPattern = /^\p{L}[\p{L}'-]*(\s+\p{L}[\p{L}'-]*)+$/u;

    if (regPattern.test(beneficiary)) {

        artist.beneficiary = beneficiary
        textBeneficiaryElement.style.border = "2px solid green";

    } else {

        artist.beneficiary = null;
        textBeneficiaryElement.style.border = "2px solid red";
    }

});


//bank name validation
textBankElement.addEventListener("keyup", () => {

    let bank = textBankElement.value;
    let regPattern = /^\p{L}[\p{L}0-9\s.,'&()-]{1,49}$/u;

    if (regPattern.test(bank)) {

        artist.bank = bank;
        textBankElement.style.border = "2px solid green";

    } else {

        artist.bank = null;
        textBankElement.style.border = "2px solid red";
    }

});


//account no validation
textAccountElement.addEventListener("keyup", () => {

    let account = textAccountElement.value;
    let regPattern = new RegExp("^[0-9]{6,20}$");

    if (regPattern.test(account)) {

        artist.account = account;
        textAccountElement.style.border = "2px solid green";

    } else {

        artist.account = null;
        textAccountElement.style.border = "2px solid red";
    }

});


//check artist form errors..............
const checkArtistFormError = () => {

    let errors = "";

    if (artist.name == null) {
        errors = errors + "Please Enter Valid Artist Name ..! \n";
    }

    if (artist.nic == null) {
        errors = errors + "Please Enter Valid NIC ..! \n";
    }

    if (artist.contact == null) {
        errors = errors + "Please Enter Valid Contact No ..! \n";
    }

    if (artist.email == null) {
        errors = errors + "Please Enter Valid Email ..! \n";
    }

    if (artist.beneficiary == null) {
        errors = errors + "Please Enter Valid Beneficiary Name ..! \n";
    }

    if (artist.bank == null) {
        errors = errors + "Please Enter Valid Bank Name ..! \n";
    }

    if (artist.account == null) {
        errors = errors + "Please Enter Valid Account Number ..! \n";
    }

    return errors;

}

//define function for submit artist form...........
const submitArtistForm = () => {

    //check all required element has valid value
    let errors = checkArtistFormError();

    if (errors == "") {

        swal({
            title: "Are You Sure To Save This Artist..?",
            text: "Added Artist Details Will Be Saved..! ",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })

            .then((willSave) => {

                if (willSave) {

                    let serviceResponse = getHTTPServiceRequest("/artist/save", "POST", artist);

                    if (serviceResponse == "OK") {

                        swal("Save Completed..!", {
                            icon: "success",
                        });

                        //refresf table area
                        refreshArtistTable();

                        //refresf form area
                        refreshArtistForm();

                        // Hide the modal form
                        //$("#modalFormArtist").modal("hide");

                    } else {

                        swal("Save Not Completed..!", " Form Has Some Errors..! \n", serviceResponse, "error");
                    }

                }

            });

    } else {

        swal("Save Not Completed..!", "Form Has Some Errors..!", errors, "error");

    }

}






//**************************************************************************************
//******************************** SUPPLIER SECTION ************************************
//**************************************************************************************


//supplier form elements
let textSupplierNameElement = document.querySelector("#textSupplierName");
let textBrnElement = document.querySelector("#textBrn");
let textSupplierContactElement = document.querySelector("#textSupplierContact");
let textSupplierEmailElement = document.querySelector("#textSupplierEmail");
let textAddressElement = document.querySelector("#textAddress");
let selectProductTypeElement = document.querySelector("#selectProductType")
//let selectProductTypeElement = document.querySelector("#selectProductType");

let textSupplierBeneficiaryElement = document.querySelector("#textSupplierBeneficiary");
let textSupplierBankElement = document.querySelector("#textSupplierBank");
let textSupplierAccountElement = document.querySelector("#textSupplierAccount");

let buttonSupplierSubmitElement = document.querySelector("#buttonSupplierSubmit");
let buttonSupplierUpdateElement = document.querySelector("#buttonSupplierUpdate");



//define function for refresh supplier table.....................................................................
const refreshSupplierTable = () => {

    //cach the database data 
    let suppliers = getServiceRequest("/artistsupplierdetails/suppliers");

    let propertyList = [
        { dataType: "string", propertyName: "name" },
        { dataType: "string", propertyName: "brn" },
        { dataType: "string", propertyName: "contact" },
        { dataType: "string", propertyName: "email" },
        { dataType: "string", propertyName: "address" },
        { dataType: "string", propertyName: "beneficiary" },
        { dataType: "string", propertyName: "bank" },
        { dataType: "string", propertyName: "account" },
        { dataType: "string", propertyName: "producttype" }
    ];

    fillDataIntoTable(tableBodySupplier, suppliers, propertyList, refillSupplierForm, deleteSupplier, printSupplier);


    //user anuwa privilage wens weddi update and delete button desable weemata
    for (const index in suppliers) {
        if (!userPrivi.privi_update)
            tableBodySupplier.children[index].children[8].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodySupplier.children[index].children[8].children[1].style.disabled = "disabled";
    }

}


// define function for print supplier
const printSupplier = (dataOb) => {

    supplier = dataOb;

    //option 1- open new print tab to print
    let newWindow = window.open();

    newWindow.document.write(
        "<html><head><title> Print Supplier Details </title></head><body>" +
        "<h2> __________Supplier Details__________n</h2>" +
        "<p> Supplier Shop Name : " + dataOb.name + "</p>" +
        "<p> BRN : " + dataOb.brn + "</p>" +
        "<p> Contact No. : " + dataOb.contact + "</p>" +
        "<p> Email : " + dataOb.email + "</p>" +
        "<p> Address : " + dataOb.address + "</p>" +
        "<p> Product Type : " + dataOb.producttype + "</p>" +
        "</body></html>"
    );

    setInterval(() => {

        // Stops the loading of content in the 'newWindow'
        newWindow.stop();

        // Triggers the print dialog for the content within 'newWindow'
        newWindow.print();

        // Closes the 'newWindow' after the print dialog is initiated (or closed by the user)
        newWindow.close();

    }, 1000);

}

//define function for refill(edit) supplier form
const refillSupplierForm = (dataOb) => {

    supplier = JSON.parse(JSON.stringify(dataOb));
    oldSupplier = JSON.parse(JSON.stringify(dataOb));

    textSupplierNameElement.value = supplier.name;
    textBrnElement.value = supplier.brn;
    textSupplierContactElement.value = supplier.contact;
    textSupplierEmailElement.value = supplier.email;
    textAddressElement.value = supplier.address;
    selectProductTypeElement.value = supplier.producttype;

    textSupplierBeneficiaryElement.value = supplier.beneficiary;
    textSupplierBankElement.value = supplier.bank;
    textSupplierAccountElement.value = supplier.account;

    buttonSupplierSubmitElement.style.display = "none";  // submit penne na
    buttonSupplierUpdateElement.style.display = "block";   // update penwa

}


//define function for check supplier updates
const checkSupplierFormUpdate = () => {

    let updates = "";

    if (supplier.name != oldSupplier.name) {
        updates = updates + "Supplier Shop Name Is Changed..! \n" + oldSupplier.name + "into " + supplier.name + "\n";
    }

    if (supplier.brn != oldSupplier.brn) {
        updates = updates + "BRN Is Changed..! \n" + oldSupplier.brn + "into " + supplier.brn + "\n";
    }

    if (supplier.contact != oldSupplier.contact) {
        updates = updates + "Contact No Is Changed..! \n" + oldSupplier.contact + "into " + supplier.contact + "\n";
    }

    if (supplier.email != oldSupplier.email) {
        updates = updates + "Email Is Changed..! \n" + oldSupplier.email + "into " + supplier.email + "\n";
    }

    if (supplier.address != oldSupplier.address) {
        updates = updates + "Address Is Changed..! \n" + oldSupplier.address + "into " + supplier.address + "\n";
    }

    if (supplier.beneficiary != oldSupplier.beneficiary) {
        updates = updates + "Beneficiary Name Is Changed..! \n" + oldSupplier.beneficiary + "into " + supplier.beneficiary + "\n";
    }

    if (supplier.bank != oldSupplier.bank) {
        updates = updates + "Bank Name Is Changed..! \n" + oldSupplier.bank + "into " + supplier.bank + "\n";
    }

    if (supplier.account != oldSupplier.account) {
        updates = updates + "Account No Is Changed..! \n" + oldSupplier.account + "into " + supplier.account + "\n";
    }

    return updates;

}


//define function for update supplier
const updateSupplier = () => {

    //need to check errors
    let errors = checkSupplierFormError();

    if (errors == "") {
        // swal("Update Not Completed..!", " Form Hasn't Any Changes..! \n", "error"); 

        let updates = checkSupplierFormUpdate();

        if (updates == "") {

            swal("No Changes Found..!", "", "warning");

        } else {

            swal({
                title: "Are You Sure To Update This Supplier..?",
                text: "Following Supplier Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })

                .then((willUpdate) => {

                    if (willUpdate) {

                        let serviceResponse = getHTTPServiceRequest("/supplier/update", "PUT", supplier);

                        if (serviceResponse == "OK") {

                            swal("Update Completed..!", {
                                icon: "success",
                            });

                            refreshSupplierTable();
                            refreshSupplierForm();

                            // Hide the modal form
                            //$("#modalEmployeeForm").modal("hide");

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

//define function for delete supplier
const deleteSupplier = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This Supplier..?",
        text: "Following Supplier Details Will Be Deleted..! \n" +
            "Supplier Shop Name" + dataOb.name +
            "\n Business Reg NO" + dataOb.brn +
            "\n Email" + dataOb.email +
            "\n Contact No" + dataOb.contact +
            "\n Beneficiary Name" + dataOb.beneficiary +
            "\n Bank Name" + dataOb.bank +
            "\n Account No" + dataOb.account,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })

        .then((willDelete) => {

            if (willDelete) {

                let serviceResponse = getHTTPServiceRequest("/supplier/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {

                    swal("Delete Completed..!", {
                        icon: "success",
                    });

                    refreshSupplierTable();

                } else {

                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");

                }

            }

        });

}






//**************************************************************************************
//**************************************************************************************



//define function for refresh supplier form...........................................................
const refreshSupplierForm = () => {

    formArtistSupplier.reset(); //clr static element value


    //if (!userPrivi.privi_insert) { //update ekdi submit disable
       // buttonSupplierSubmitElement.disabled = "disabled";
   // }

    buttonSupplierUpdateElement.disabled = "disabled";   //update eka disable

    //create empty object
    //supplier = new Object();
    supplier = {
        type: "supplier",
        name: "",
        brn: "",
        contact: "",
        email: "",
        address: "",
        producttype: "",
        beneficiary: "",
        bank: "",
        account: ""
    }
    
    textSupplierNameElement.style.border = "1px solid #ced4da";
    textBrnElement.style.border = "1px solid #ced4da";
    textSupplierContactElement.style.border = "1px solid #ced4da";
    textSupplierEmailElement.style.border = "1px solid #ced4da";
    textAddressElement.style.border = "1px solid #ced4da";
    selectProductTypeElement.style.border = "1px solid #ced4da";
    textSupplierBeneficiaryElement.style.border = "1px solid #ced4da";
    textSupplierBankElement.style.border = "1px solid #ced4da";
    textSupplierAccountElement.style.border = "1px solid #ced4da";

}


//supplier validation
textSupplierNameElement.addEventListener("keyup", () => {

    let name = textSupplierNameElement.value;
    let regPattern = /^\p{L}[\p{L}0-9\s&().,'-]{1,69}$/u;

    if (regPattern.test(name)) {

        supplier.name = name;
        textSupplierNameElement.style.border = "2px solid green";

    } else {

        supplier.name = null;
        textSupplierNameElement.style.border = "2px solid red";

    }

});


//brn validation
textBrnElement.addEventListener("keyup", () => {

    let brn = textBrnElement.value;
    let regPattern = new RegExp("^(([0-9]{9})|([0-9]{12}))$");

    if (regPattern.test(brn)) {

        supplier.brn = brn;
        textBrnElement.style.border = "2px solid green";

    } else {

        supplier.brn = null;
        textBrnElement.style.border = "2px solid red";

    }

});


//contact validation
textSupplierContactElement.addEventListener("keyup", () => {

    let contact = textSupplierContactElement.value;
    let regPattern = new RegExp("^[0]{1}[7][01245678]{1}[0-9]{7}$");

    if (regPattern.test(contact)) {

        supplier.contact = contact;
        textSupplierContactElement.style.border = "2px solid green";

    } else {

        supplier.contact = null;
        textSupplierContactElement.style.border = "2px solid red";

    }

});


//email validation
textSupplierEmailElement.addEventListener("keyup", () => {

    let email = textSupplierEmailElement.value;
    let regPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (regPattern.test(email)) {

        supplier.email = email;
        textSupplierEmailElement.style.border = "2px solid green";

    } else {

        supplier.email = null;
        textSupplierEmailElement.style.border = "2px solid red";

    }

});


//address validation
textAddressElement.addEventListener("keyup", () => {

    let address = textAddressElement.value;
    let regPattern = /^[\p{L}0-9\s:/,.#-]{7,150}$/u;

    if (regPattern.test(address)) {

        supplier.address = address;
        textAddressElement.style.border = "2px solid green";

    } else {

        supplier.address = null;
        textAddressElement.style.border = "2px solid red";

    }

});


//product type validation
selectProductTypeElement.addEventListener("change", () => {

    if (selectProductTypeElement.value != "") {

        supplier.producttype = selectProductTypeElement.value;
        selectProductTypeElement.style.border = "2px solid green";

    } else {

        supplier.producttype = null;
        selectProductTypeElement.style.border = "2px solid red";

    }

});


//beneficiary validation
textSupplierBeneficiaryElement.addEventListener("keyup", () => {

    let beneficiary = textSupplierBeneficiaryElement.value;
    let regPattern = /^\p{L}[\p{L}'-]*(\s+\p{L}[\p{L}'-]*)+$/u;

    if (regPattern.test(beneficiary)) {

        supplier.beneficiary = beneficiary;
        textSupplierBeneficiaryElement.style.border = "2px solid green";

    } else {

        supplier.beneficiary = null;
        textSupplierBeneficiaryElement.style.border = "2px solid red";

    }

});


//bank validation
textSupplierBankElement.addEventListener("keyup", () => {

    let bank = textSupplierBankElement.value;
    let regPattern = /^\p{L}[\p{L}0-9\s.,'&()-]{1,49}$/u;

    if (regPattern.test(bank)) {

        supplier.bank = bank;
        textSupplierBankElement.style.border = "2px solid green";

    } else {

        supplier.bank = null;
        textSupplierBankElement.style.border = "2px solid red";
    }

});


//account validation
textSupplierAccountElement.addEventListener("keyup", () => {

    let account = textSupplierAccountElement.value;
    let regPattern = new RegExp("^[0-9]{6,20}$");

    if (regPattern.test(account)) {

        supplier.account = account;
        textSupplierAccountElement.style.border = "2px solid green";

    } else {

        supplier.account = null;
        textSupplierAccountElement.style.border = "2px solid red";
    }

});


//define function check form error.........................
const checkSupplierFormError = () => {

    let errors = "";

    if (supplier.name == null) {
        errors = errors + "Please Select Supplier Shop Name..! \n";
    }

    if (supplier.brn == null) {
        errors = errors + "Please Enter Valid BRN..! \n";
    }

    if (supplier.contact == null) {
        errors = errors + "Please Enter Valid Contact Number..! \n";
    }

    if (supplier.email == null) {
        errors = errors + "Please Enter Valid Email..! \n";
    }

    if (supplier.address == null) {
        errors = errors + "Please Enter Valid Address..! \n";
    }

    if (supplier.producttype == null) {
        errors = errors + "Please Select Product Type..! \n";
    }

    if (supplier.beneficiary == null) {
        errors = errors + "Please Enter Valid Beneficiary Name..! \n";
    }

    if (supplier.bank == null) {
        errors = errors + "Please Enter Valid Bank Name..! \n";
    }

    if (supplier.account == null) {
        errors = errors + "Please Enter Valid Account Number..! \n";
    }

    return errors;
}


//define method for submit emp form......................
const submitSupplierForm = () => {

    //check all required element has valid value
    let errors = checkSupplierFormError();

    if (errors == "") {

        swal({
            title: "Are You Sure To Save This Supplier..?",
            text: "Added Supplier Details Will Be Saved..! ",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })

            .then((willSave) => {

                if (willSave) {

                    let serviceResponse = getHTTPServiceRequest("/supplier/save", "POST", supplier);

                    if (serviceResponse == "OK") {

                        swal("Save Completed..!", {
                            icon: "success",
                        });

                        refreshSupplierTable();
                        refreshSupplierForm();

                        // Hide the modal form
                        //$("#modalFormUser").modal("hide");

                    } else {

                        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + serviceResponse, "error");

                    }

                }

            });

    } else {

        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + errors, "error");

    }

}











