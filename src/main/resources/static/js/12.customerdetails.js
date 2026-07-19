//access browser onload event..................................
window.addEventListener("load", () => {

    userPrivi = getHTTPServiceRequest("/userprivilagebymodule?modulename=customerdetails")


    //call refresh tbl function ( whenbrowser refresh, when submid end, when update end, when delete end)
    refreshCustomerDetailsTable();

    //call refresh form function ( whenbrowser refresh, when submid end, when update end, when cler end)
    refreshCustomerDetailsForm();


});

//*********************************************************************************************
//*********************************************************************************************




let textNameElement = document.querySelector("#textName");
let textContactElement = document.querySelector("#textContact");
let textEmailElement = document.querySelector("#textEmail");
let textAddressElement = document.querySelector("#textAddress");
let textNoteElement = document.querySelector("#textNote");


//define function for refresh employee table................................................
const refreshCustomerDetailsTable = () => {


    //cach the database data
    customers = getServiceRequest("/customerdetails/alldata");


    //console.log(customerdetails, "data");

    //string--->string/text/date/number
    //function---> object/arry/boolean/ if direct property not exist

    // table column count = property count
    let propertyList = [
        { dataType: "string", propertyName: "name" },
        { dataType: "string", propertyName: "contact" },
        { dataType: "string", propertyName: "email" },
        { dataType: "string", propertyName: "address" },
        { dataType: "string", propertyName: "note" }

    ];


    //call filldatainto table
    fillDataIntoTable(tableBodyCustomerDetails, customers, propertyList, refillCustomerDetailsForm, deleteCustomer, printCustomer); //tablebodyid, arraydatalist, propertylist........

    //user anuwa privilage wens weddi update and delete button desable weemata
    for (const index in customers) {
        if (!userPrivi.privi_update)
            tableBodyCustomerDetails.children[index].children[6].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodyCustomerDetails.children[index].children[6].children[1].style.disabled = "disabled";
    }
}


//define function for refill(edit) form
const refillCustomerDetailsForm = (dataOb) => {

    customer = JSON.parse(JSON.stringify(dataOb));
    oldCustomer = JSON.parse(JSON.stringify(dataOb));

    textNameElement.value = customer.name;
    textContactElement.value = customer.contact;
    textEmailElement.value = customer.email;
    textAddressElement.value = customer.address;
    textNoteElement.value = customer.note || "";


    buttonSubmit.style.display = "none";  // submit penne na
    buttonUpdate.style.display = "block";   // update penwa
}


//define function for  check form updates (mg ena eka wage )
const checkCustomerDetailsFormUpdate = () => {

    let updates = "";

    if (customer.name != oldCustomer.name) {
        updates = updates + "Customer Name Is Changed..! \n" + oldCustomer.name + " into " + customer.name + "\n";
    }

    if (customer.email != oldCustomer.email) {
        updates = updates + "Email Is Changed..! \n" + oldCustomer.email + " into " + customer.email + "\n";
    }

    if (customer.contact != oldCustomer.contact) {
        updates = updates + "Contact No Is Changed..! \n" + oldCustomer.contact + " into " + customer.contact + "\n";
    }

    if (customer.address != oldCustomer.address) {
        updates = updates + "Address Is Changed..! \n" + oldCustomer.address + " into " + customer.address + "\n";
    }

    if (customer.note != oldCustomer.note) {
        updates = updates + "Note Is Changed..! \n" + oldCustomer.note + " into " + customer.note + "\n";
    }

    return updates;
}


//define function for update
const updateCustomer = () => {
    //console.log(customer);

    //need to check errors
    let errors = checkFormError();

    if (errors == "") {
        // swal("Update Not Completed..!", " Form Hasn't Any Changes..! \n", "error");

        let updates = checkCustomerDetailsFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");

        } else {
            swal({
                title: "Are You Sure To Update This Customer..?",
                text: "Following Customer Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })


                .then((willUpdate) => {

                    if (willUpdate) {

                        let serviceResponse = getHTTPServiceRequest("/customerdetails/update", "PUT", customer);

                        if (serviceResponse == "OK") {
                            swal("Update Completed..!", {
                                icon: "success",
                            });


                            //refresf table area
                            refreshCustomerDetailsTable();

                            //refresf form area
                            refreshCustomerDetailsForm();

                            // Hide the modal form
                            //$("#modalCustomerDetailsForm").modal("hide");


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
const deleteCustomer = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This Customer..?",
        text: "Following Customer Details Will Be Deleted..! \n" +
            "Customer Name" + dataOb.name +
            "\n  Email" + dataOb.email +
            "\n  Contact" + dataOb.contact +
            "\n  Address" + dataOb.address,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    })


        .then((willDelete) => {

            if (willDelete) {

                let serviceResponse = getHTTPServiceRequest("/customerdetails/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {

                    swal("Delete Completed..!", {
                        icon: "success",
                    });


                    //refresf table area
                    refreshCustomerDetailsTable();

                } else {
                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");

                };
            }


        });


}


//define function for print
const printCustomer = (dataOb) => {

    customer = dataOb;

    //option 1- open new print tab to print
    let newWindow = window.open();

    newWindow.document.writeln(
        "<html><head><title> Print Customer Details </title></head><body>" +
        "<h1> __________Customer Details__________ </h1>" +
        "<p><strong> Customer Name : </strong> " + customer.name + "</p>" +
        "<p><strong> Email : </strong> " + customer.email + "</p>" +
        "<p><strong> Contact No : </strong> " + customer.contact + "</p>" +
        "<p><strong> Address : </strong> " + customer.address + "</p>" +
        "<p><strong> Note : </strong> " + (customer.note || "") + "</p>" +
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


//define function for refresh  form.....................................................
const refreshCustomerDetailsForm = () => {

    formCustomerDetails.reset(); //clear static element value

    //if (!userPrivi.privi_insert) { //update ekdi submit disable
      //  buttonSubmit.disabled = "disabled";
   // }


     buttonUpdate.disabled = "disabled";    //update eka disable
    //buttonUpdate.style.visibility = "hidden";

    //create empty object
    customer = new Object();

    textNameElement.style.border = "1px solid #ced4da";
    textContactElement.style.border = "1px solid #ced4da";
    textEmailElement.style.border = "1px solid #ced4da";
    textAddressElement.style.border = "1px solid #ced4da";

    //cler all element (border colur)
    //clearElement([textNameElement,textContactElement,textEmailElement,textAddressElement]);


}


//customer name validation
textNameElement.addEventListener("keyup", () => {

    let name = textNameElement.value;
    let regPattern = /^\p{L}[\p{L}0-9\s.,'&()-]{1,69}$/u;

    if (regPattern.test(name)) {

        customer.name = name;
        textNameElement.style.border = "2px solid green";

    } else {

        customer.name = null;
        textNameElement.style.border = "2px solid red";
    }

});

//contact validation
textContactElement.addEventListener("keyup", (validateContact) => {

    let contact = textContactElement.value;
    let regPattern = new RegExp("^[0]{1}[7][01245678]{1}[0-9]{7}$");

    if (regPattern.test(contact)) {

        customer.contact = contact;
        textContactElement.style.border = "2px solid green";

    } else {

        customer.contact = null;
        textContactElement.style.border = "2px solid red";
    }

});

//email validation
textEmailElement.addEventListener("keyup", () => {

    let email = textEmailElement.value;
    let regPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (regPattern.test(email)) {

        customer.email = email;
        textEmailElement.style.border = "2px solid green";

    } else {

        customer.email = null;
        textEmailElement.style.border = "2px solid red";
    }

});

//address validation
textAddressElement.addEventListener("keyup", () => {

    let address = textAddressElement.value;
    let regPattern = /^[\p{L}0-9\s:/,.#-]{7,150}$/u;

    if (regPattern.test(address)) {

        customer.address = address;
        textAddressElement.style.border = "2px solid green";

    } else {

        customer.address = null;
        textAddressElement.style.border = "2px solid red";

    }

});

// note (optional, no validation required)
textNoteElement.addEventListener("keyup", () => {
    customer.note = textNoteElement.value || null;
});



//define function check form error.........................
const checkFormError = () => {

    let errors = "";

    if (customer.name == null) {
        errors = errors + "Please Enter Valid Name ..!\n";
    }

    if (customer.contact == null) {
        errors = errors + "Please Enter Valid Contact Number ..!\n";
    }

    if (customer.email == null) {
        errors = errors + "Please Enter Valid Email ..!\n";
    }

    if (customer.address == null) {
        errors = errors + "Please Enter Valid Address ..!\n";
    }

    return errors;

}


//define function for submit user form
const submitCustomer = () => {
    // console.log(customer); //to verify data come when submit

    //need to check form error
    let errors = checkFormError();

    if (errors == "") {

        swal({
            title: "Are You Sure To Save This File..?",
            text: "Following Customer Record Will Be Saved..! \n" +
                "\n Customer Name :" + customer.name +
                "\n Email :" + customer.email +
                " \n Contact :" + customer.contact +
                "\n Address :" + customer.address +
                "\n Note :" + (customer.note || ""),

            icon: "warning",
            buttons: true,
            dangerMode: true,
        })


            .then((willSave) => {

                if (willSave) {

                    let serviceResponse = getHTTPServiceRequest("/customerdetails/save", "POST", customer);

                    if (serviceResponse == "OK") {
                        swal("Save Completed..!", {
                            icon: "success",
                        });


                        //refresf table area
                        refreshCustomerDetailsTable();

                        //refresf form area
                        refreshCustomerDetailsForm();

                        // Hide the modal form
                        //$("#modalFormCustomerDetails").modal("hide");

                    } else {

                        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + serviceResponse, "error");

                    }
                }


            });

    } else {

        swal("Save Not Completed..!", " Form Has Some Errors..! \n" + errors, "error");
    }

}
