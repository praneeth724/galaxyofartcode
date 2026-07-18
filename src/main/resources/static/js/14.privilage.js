const selectRoleElement = document.querySelector("#selectRole");
const selectModuleElement = document.querySelector("#selectModule");

const checkBoxSelectElement = document.querySelector("#chkSelect");
const checkBoxInsertElement = document.querySelector("#chkInsert");
const checkBoxUpdateElement = document.querySelector("#chkUpdate");
const checkBoxDeleteElement = document.querySelector("#chkDelete");

const lableSelectElement = document.querySelector("lblSelect");
const lableInsertElement = document.querySelector("lblInsert");
const lableUpdateElement = document.querySelector("lblUpdate");
const lableDeleteElement = document.querySelector("lblDelete");



//access browser onload event..................................
window.addEventListener("load", () => {

    //call refresh tbl function ( whenbrowser refresh, when submid end, when update end, when delete end)
    refreshPrivilageTable();



    //call refresh form function ( whenbrowser refresh, when submid end, when update end, when cler end)
    refreshPrivilageForm();


})



//*********************************************************************************************
//********************************************************************************************* 

//define function for refresh table area.....................................................
const refreshPrivilageTable = () => {

    //create an array
    privilages = new Array();

    privilages = getServiceRequest("/privilage/alldata");

    //table eke display krna tika
    //string--->string/text/date/number
    //function---> object/arry/boolean/ if direct property not exist

    // table column count = property count 
    let propertyList = [

        { dataType: "function", propertyName: getRole },
        { dataType: "function", propertyName: getModule },
        { dataType: "function", propertyName: getSelect },
        { dataType: "function", propertyName: getInsert },
        { dataType: "function", propertyName: getUpdate },
        { dataType: "function", propertyName: getDelete },

    ];

    //call data into table function
    fillDataIntoTable(tableBodyPrivilage, privilages, propertyList, refillPrivilage, deletePrivilage, printPrivilage);

}

//role
const getRole = (dataOb) => {

    return dataOb.role_id.name;
}

//module
const getModule = (dataOb) => {

    return dataOb.module_id.name;
}

//select
const getSelect = (dataOb) => {
    if (dataOb.privi_select) {
        return "Granted..! ";
    } else {
        return "Not-Granted..! ";
    }

}

//insert
const getInsert = (dataOb) => {
    if (dataOb.privi_insert) {
        return "Granted..! ";
    } else {
        return "Not-Granted..! ";
    }

}

//update
const getUpdate = (dataOb) => {
    if (dataOb.privi_update) {
        return "Granted..! ";
    } else {
        return "Not-Granted..! ";
    }

}

//delete
const getDelete = (dataOb) => {
    if (dataOb.privi_delete) {
        return "Granted..! ";
    } else {
        return "Not-Granted..! ";
    }

}


//define function for edit (refill)
const refillPrivilage = (dataOb) => {

    privilage = JSON.parse(JSON.stringify(dataOb));
    oldPrivilage = JSON.parse(JSON.stringify(dataOb));

    selectRoleElement.disabled = "disabled";   //disable for update
    selectModuleElement.disabled = "disabled";  ////disable for update


    selectRoleElement.value = JSON.stringify(privilage.role_id);
    selectModuleElement.value = JSON.stringify(privilage.module_id);

    if (privilage.privi_select) {
        checkBoxSelectElement.checked = true;
        lableSelectElement.innerText = "Granted..!";
    } else {
        checkBoxSelectElement.checked = false;
        lableSelectElement.innerText = "Not-Granted..!";
    }

    if (privilage.privi_insert) {
        checkBoxInsertElement.checked = true;
        lableInsertElement.innerText = "Granted..!";
    } else {
        checkBoxInsertElement.checked = false;
        lableInsertElement.innerText = "Not-Granted..!";
    }

    if (privilage.privi_update) {
        checkBoxUpdateElement.checked = true;
        lableUpdateElement.innerText = "Not-Granted..!";
    } else {
        checkBoxUpdateElement.checked = false;
        lableUpdateElement.innerText = "Not-Granted..!";
    }

    if (privilage.privi_delete) {
        checkBoxDeleteElement.checked = true;
        lableDeleteElement.innerText = "Not-Granted..!";
    } else {
        checkBoxDeleteElement.checked = false;
        lableDeleteElement.innerText = "Not-Granted..!";
    }


    buttonSubmit.style.display = "none";  // submit penne na
    buttonUpdate.style.display = "block";   // update penwa

}

//define function for check update
const checkFormUpdate = () => {

    let updates = "";

    if (privilage.role_id.name != oldPrivilage.role_id.name) {
        updates = updates + "Role is Changed..! \n" + oldPrivilage.role_id.name + "into" + privilage.role_id.name + " \n";
    }

    if (privilage.module_id.name != oldPrivllage.module_id.name) {
        updates = updates + "Module is Changed..! \n" + oldPrivilage.module_id.name + "into" + privilage.module_id.name + "\n";
    }

    if (privilage.privi_select != oldPrivilage.privi_select) {
        updates = updates + "Select Privilage is Changed..! \n";
    }

    if (privilage.privi_insert != oldPrivilage.privi_insert) {
        updates = updates + "Insert Privilage is Changed..! \n";
    }

    if (privilage.privi_updatee != oldPrivilage.privi_update) {
        updates = updates + "Update Privilage is Changed..! \n";
    }

    if (privilage.privi_delete != oldPrivilage.privi_delete) {
        updates = updates + "Delete Privilage is Changed..! \n";
    }

    return updates;
}

//define function for update
const buttonPrivilageUpdate = () => {
    console.log(privilage);

    //need to check errors
    let errors = checkFormError();

    if (errors == "") {
        //swal("Update Not Completed..!", " Form Hasn't Any Changes..! \n", "error");

        let updates = checkFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");
        } else {
            swal({
                title: "Are You Sure to Update This File..?",
                text: "Following Privilage Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })


                .then((willUpdate) => {
                    if (willUpdate) {

                        let serviceResponse = getHTTPServiceRequest("/privilage/update", "PUT", privilage);

                        if (serviceResponse == "OK") {

                            swal("Update Completed..!", {
                                icon: "success",
                            });


                            //refresf table area
                            refreshPrivilageTable();

                            //refresf form area
                            refreshPrivilageForm();

                            // Hide the modal form
                            //$("#modalFormUser").modal("hide");

                        } else {
                            swal("Update Not Completed..!", " Form Hasn't Any Changes..! \n" + serviceResponse, "error");

                        };
                    }


                });
        }


    } else {
        swal("Update Not Completed..!", "Form Has Errors..! \n", errors, "error");

    }
}


//define function for delete
const deletePrivilage = (dataOb) => {

    swal({
        //get user confimation
        title: "Are You Sure To Delete This File..?",
        text: "Following Privilage Details Will Be Deleted..! \n" +
            "Role :" + dataOb.role_id +
            "\n Module" + dataOb.module_id,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    })


        .then((willDelete) => {
            if (willDelete) {

                let serviceResponse = getHTTPServiceRequest("/privilage/delete", "DELETE", dataOb);
                if (serviceResponse == "OK") {
                    swal("Delete Completed..!", {
                        icon: "success",
                    });


                    //refresf table area
                    refreshPrivilageTable();

                } else {
                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");

                };
            }


        });

}

//define function for print
const printPrivilage = (dataOb) => {

    employee = dataOb;

    //option 1- open new print tab to print
    let newWindow = window.open();

    newWindow.document.writeln("<html><head><title> Print Privilage Details </title></head><body>" +
        "<h1> __________Privilage Details__________ </h1>" +
        "<p><strong> Role : </strong> " + employee.role_id + "</p>" +
        "<p><strong> Module : </strong> " + employee.module_id + "</p>" +
        "<p><strong> Select : </strong> " + getSelect(dataObject) + "</p>" +
        "<p><strong> Insert : </strong> " + getinsert(dataObject) + "</p>" +
        "<p><strong> Update : </strong> " + getUpdate(dataObject) + "</p>" +
        "<p><strong> Delete : </strong> " + getDelete(dataObject) + "</p>" +
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


//define function for refresh form area........................................................
const refreshPrivilageForm = () => {

    //clear static element
    formPrivilage.reset();

    //if (!userPrivi.privi_insert) { //update ekdi submit disable
        //buttonSubmit.disabled = "disabled";
    //}

    buttonUpdate.disabled = "disabled"; //submit eke update disable

    //create empty object
    privilage = new Object();

    selectRoleElement.disabled = "";   // update ekta refill eke disable karapu nisa , methnadi enable krnwa
    selectModuleElement.disabled = ""; // update ekta refill eke disable karapu nisa , methnadi enable krnwa

    //get role list from database
    let roles = getServicesRequest("/role/alldatawithoutadmin")
    filDataIntoSelect(selectRoleElement, "Select Role..!", roles, "name");

    let modules = getServicesRequest("/module/alldata")
    filDataIntoSelect(selectModuleElement, "Select Module..!", modules, "name");


    checkBoxSelectElement.checked = false;
    lableSelectElement.innerText = "Select Privilage Not-Granted..!";

    checkBoxInsertElement.checked = false;
    lableInsertElement.innerText = "Insert Privilage Not-Granted..!";

    checkBoxUpdateElement.checked = false;
    lableUpdateElement.innerText = "Update Privilage Not-Granted..!";

    checkBoxDeleteElement.checked = false;
    lableDeleteElement.innerText = "Delete Privilage Not-Granted..!";

    //not granted ewth value pass wenna oni nisa, inisial situation eka fales dnwa.
    privilage.privi_select = false;
    privilage.privi_insert = false;
    privilage.privi_update = false;
    privilage.privi_delete = false;

    //clear all element (colour clear)
    clearElement(selectModuleElement, selectRoleElement)
}

//define function check form error....
const checkFormError = () => {
    let errors = "";

    if (privilage.role_id == null) {
        errors = errors + "Please Select Role ..!\n";
    }
    if (privilage.module_id == null) {
        errors = errors + "Please Select Module ..!\n";
    }

    return errors;
}


//define function for submit privilage form......
const buttonPrivilageSubmit = () => {

    console.log(privilage)  //to verify data come when submit

    //need to check form error
    let errors = checkFormError();

    if (errors == "") {
        
        swal({
            title: "Are You Sure To Save This File..?",
            text: "Following Privilage Details Will Be Saved..! \n" +
                "Role :" + privilage.role_id.name +
                "\n Module :" + privilage.module_id.name,

            icon: "warning",
            buttons: true,
            dangerMode: true,
        })


            .then((willSave) => {

                if (willSave) {

                    let serviceResponse = getHTTPServiceRequest("/privilage/save", "POST", privilage);
                    
                    if (serviceResponse == "OK") {
                        swal("Save Completed..!", {
                            icon: "success",
                        });


                        //refresf table area
                        refreshPrivilageTable();

                        //refresf form area
                        refreshPrivilageForm();

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

