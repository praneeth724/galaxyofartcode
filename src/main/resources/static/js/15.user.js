const selectEmployeeElement = document.querySelector("#selectEmployee");
const textUsernameElement = document.querySelector("#textUsername");
const textPasswordElement = document.querySelector("#textPassword");
const textReTypePasswordElement = document.querySelector("#textReTypePassword");
const textEmailElement = document.querySelector("#textEmail");
const textNoteElement = document.querySelector("#textNote");
const checkUserStatusElement = document.querySelector("#checkUserStatus");
const lblUserStatusElement = document.querySelector("#lblUserStatus");

//access browser load event......................................................
window.addEventListener("load", () => {

    //call table refresh function
    refreshUserTable();

    //call form refresh function
    refreshUserForm();

});



//*********************************************************************************************
//********************************************************************************************* 

//define function to refresh user table.............................................
const refreshUserTable = () => {

    //cach the database data 
    users = getServiceRequest("/user/alldata");

    //string--->string/text/date/number
    //function---> object/arry/boolean/ if direct property not exist [me function yatin define karanna oni] 

    // table column count = property count 
    let propertyList = [
        { dataType: "function", propertyName: getEmployee },
        { dataType: "string", propertyName: "username" },
        { dataType: "string", propertyName: "useremail" },
        { dataType: "function", propertyName: getRoles },
        { dataType: "function", propertyName: getUserStatus },
    ];


    //call filldatainto table
    fillDataIntoTable(tableBodyUser, users, propertyList, formRefill, userDelete, printUser);

}

//define function to get employee name
const getEmployee = (dataOb) => {
    return dataOb.employee_id.fullname;
}

//define function to get role 
const getRoles = (dataOb) => {
    let userRoles = getServiceRequest("/roles/byuser/" + dataOb.id);
    let roles = "";
    userRoles.forEach(role => {
        roles = roles + role.name + ", ";
    });
    return roles;
}


//define function to get user status (boolean nisa let dala gnna oni)
const getUserStatus = (dataOb) => {

    if (dataOb.status == true) {
        return "Active";
    } else {
        return "Inactive";
    }
}


//define function for formRefill
const formRefill = (dataOb) => {

    user = getServiceRequest("/user/byid?id=" + dataOb.id)
    oldUser = getServiceRequest("/user/byid?id=" + dataOb.id)

    // show the modal form
    //$("#modalFormUser").modal("show");


    let employees = getServiceRequest("/employee/alldata");
    fillDataIntoSelect(selectEmployeeElement, "Select Employee..!", employees, "fullname");
    selectEmployeeElement.value = JSON.stringify(user.employee_id);

    textUsernameElement.value = user.username;
    textPasswordElement.value = "" //to avoid password show;
    textReTypePasswordElement.value = "" //to avoid password show;
    textEmailElement.value = user.useremail;

    if (user.note != undefined)
        textNoteElement.value = user.note;

    if (user.status) {
        chkUserStatusElement.checked = true;
        lblUserStatusElement.innerText = "User Account is Active ..!";
    } else {
        chkUserStatusElement.checked = false;
        lblUserStatusElement.innerText = "User Account is Inactive ..!";
    }


    //get role list
    let roles = getServiceRequest("/role/alldatawithoutadmin");

    divRole.innerHTML = "";  //avoid duplication
    roles.forEach(role => {

        let div = document.createElement("div");
        div.className = "form-check form-check-inline";

        let inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        inputElement.className = "form-check-input ";

        // role eka agta ena , eka ain krnna oni nisa
        inputElement.onchange = (event) => {
            if (inputElement.checked) {
                user.roles.push(role);
            } else {
                let extIndex = user.roles.map(rl => rl.name).indexOf(role.name);
                if (extIndex > -1) {
                    user.roles.splice(extIndex, 1);
                }
            }
            // log wena kenge role eka auto fill wenna (check user roles when refill form)
            let extIndex = user.roles.map(rl => rl.name).indexOf(role.name);
            if (extIndex > -1) {
                inputElement.checked = true;
            }



            let labelElement = document.createElement("label");
            labelElement.className = "form-check-label fw-bold ";
            labelElement.innerText = role.name;

            div.appendChild(inputElement);
            div.appendChild(labelElement);
            divRole.appendChild(div);
        }
    });

    buttonSubmit.style.display = "none";
    buttonUpdate.style.display = "block";
}



//define function for check form update
const checkFormUpdate = () => {
    let updates = "";

    if (user.employee_id.id != oldUser.employee_id.id) {
        updates = updates + "Employee is Changed ..! \n" + oldUser.employee_id.id + " into " + employee_id.id + "\n";
    }

    if (user.username != oldUser.username) {
        updates = updates + "User Name is Changed ..! \n";
    }

    if (user.useremail != oldUser.useremail) {
        updates = updates + "Email is Changed ..! \n";
    }

    if (user.note != oldUser.note) {
        updates = updates + "Note is Changed ..! \n";
    }

    if (user.status != oldUser.status) {
        updates = updates + "Status is Changed ..! \n";
    }

    if (user.employee_id.id != oldUser.employee_id.id) {
        updates = updates + "Employee is Changed ..! \n";
    }

    if (user != null && oldUser != null) {

        function findChangedValues(arr1, arr2) {
            const addedValues = arr2.filter(item => !arr1.includes(item));
            return addedValues
        }

        const changes = findChangedValues(oldUser.roles, user.roles);

        if (changes != null) {
            updates = updates + "Role is Changed ..! \n";
        }

    }

    return updates;

}


//define function for update
const updateFormUser = () => {
    console.log(user);

    //need to check errors
    let errors = checkFormError();

    if (errors == "") {
        //swal("Update Not Completed..!", " Form Hasn't Any Changes..! \n", "error");

        let updates = checkFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");
        } else {
            swal({
                title: "Are You Sure To Update This File..?",
                text: "Following User Details will be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })


                .then((willUpdate) => {
                    if (willUpdate) {

                        let serviceResponse = getHTTPServiceRequest("/user/update", "PUT", user);
                        
                        if (serviceResponse == "OK") {

                            swal("Update Completed..!", {
                                icon: "success",
                            });


                            //refresf table area
                            refreshUserTable();

                            //refresf form area
                            refreshUserForm();

                            // Hide the modal form
                            //$("#modalFormUser").modal("hide");

                        } else {
                            swal("Update Not Completed..!", " Form Hasn't Any Changes..! \n" + serviceResponse, "error");

                        };
                    }


                });
        }


    } else {
         swal("Update Not Completed..!","Form Has Errors..! \n", errors, "error");
    }
}


//define function for user delete user account
const userDelete = (dataOb) => {


    //get user confirmation
    swal({
        title: "Are You Sure To Delete This File..?",
        text: "Following User Details Will Be Deleted..! \n" +
            "Employee Fullname :" + dataOb.employee_id.fullname +
            "\n User Name :" + dataOb.username,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    })


        .then((willDelete) => {
            if (willDelete) {

                let serviceResponse = getHTTPServiceRequest("/user/delete", "DELETE", dataOb);
                if (serviceResponse == "OK") {
                    swal("Delete Completed..!", {
                        icon: "success",
                    });


                    //refresf table area
                    refreshUserTable();

                } else {
                    swal("Delete Not Completed..!", " Form Has Some Errors..! \n" + serviceResponse, "error");

                };
            }


        });


}


//define function for print user 
const printUser = (dataOb) => {

    user = dataOb;

    //option 1- open new print tab to print
    let newWindow = window.open();

    newWindow.document.writeln("<html><head><title> Print User Details </title></head><body>" +
        "<h1> __________User Details__________ </h1>" +
        "<p><strong> Employee Name : </strong> " + user.employee + "</p>" +
        "<p><strong> User Name : </strong> " + user.username + "</p>" +
        "<p><strong> Role : </strong> " + user.roles + "</p>" +
        "<p><strong> Email : </strong> " + user.useremail + "</p>" +
        "<p><strong> Status : </strong> " + user.userstatus + "</p>" +
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


//define function to refresh user form......................................................
const refreshUserForm = () => {

    formUser.reset();  //reset form data

    buttonUpdate.disabled = "disabled";

    user = new object();
    user.roles = new Array();

    let users = getServiceRequest("/user/alldata");
    fillDataToSelect(selectEmployeeElement, "Select Employee..!", users, "fullname");

    //cler all element (border colur)
    clearElement([selectEmployeeElement, textUsernameElement, textPasswordElement, textReTypePasswordElement,
        textEmailElement, textNoteElement,]);

    chkUserStatusElement.checked = true;
    lblUserStatusElement.innerText = "User Account is Active ..!";
    user.status = true;


    //get role list
    let roles = getServiceRequest("/role/alldatawithoutadmin");

    divRole.innerHTML = "";  //avoid duplication
    roles.forEach(role => {

        let div = document.createElement("div");
        div.className = "form-check form-check-inline";

        let inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        inputElement.className = "form-check-input ";

        // role eka agta ena , eka ain krnna oni nisa
        inputElement.onchange = (event) => {
            if (inputElement.checked) {
                user.roles.push(role);
            } else {
                let extIndex = user.roles.map(rl => rl.name).indexOf(role.name);
                if (extIndex > -1) {
                    user.roles.splice(extIndex, 1);
                }
            }

            let labelElement = document.createElement("label");
            labelElement.className = "form-check-label fw-bold ";
            labelElement.innerText = role.name;

            div.appendChild(inputElement);
            div.appendChild(labelElement);
            divRole.appendChild(div);
        }
    });


}

//define function to check form error
const checkFormError = () => {
    let errors = "";

    if (user.employee_id == null) {
        errors = errors + "Please Select Employee ..! \n";
    }

    if (user.username == null) {
        errors = errors + "Please Enter Valid User Name ..! \n";
    }

    if (user.password == null) {
        errors = errors + "Please Enter Valid Password ..! \n";
    }

    if (user.useremail == null) {
        errors = errors + "Please Enter Valid Email ..! \n";
    }

    if (user.roles.length == 0) {
        errors = errors + "Please Select At Least One Role ..! \n";
    }

    return errors;
}

//define function for submit user form
const submitUser = () => {
    // console.log(user); //to verify data come when submit

    //need to check form error
    let errors = checkFormError();

    if (errors == "") {

        swal({
            title: "Are You Sure To Save This File..?",
            text: "Following Employee Record Will Be Saved..! \n" +
                "Employee Fullname :" + user.employee_id.fullname +
                "\n User Name :" + user.username,

            icon: "warning",
            buttons: true,
            dangerMode: true,
        })


            .then((willSave) => {

                if (willSave) {

                    let serviceResponse = getHTTPServiceRequest("/user/save", "POST", user);
                    
                    if (serviceResponse == "OK") {
                        swal("Save Completed..!", {
                            icon: "success",
                        });


                        //refresf table area
                        refreshUserTable();

                        //refresf form area
                        refreshUserForm();

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


//define function for retype password
const textPasswordRetypeValidator = (elementId) => {

    if (textPasswordElement.value === elementId.value) {
        //valid
        textPassword.style.border = " 2px solid green";
        elementId.style.border = " 2px solid green";
        user.password = elementId.value;
    } else {
        //invalid
        textPassword.style.border = " 2px solid red";
        elementId.style.border = " 2px solid red";
        user.password = null;
    }
}
















