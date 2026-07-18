
let textFullNameElement = document.querySelector("#textFullName");
let selectCallingnameElement = document.querySelector("#selectCallingname");
let nameInisialElement = document.querySelector("#nameInisial");

let textNICElement = document.querySelector("#textNIC");
let radioMaleElement = document.querySelector("#radioMale");
let radioFemaleElement = document.querySelector("#radioFemale");
//let textAgeElement = document.querySelector("#textAge");
let dateDateOfBirthElement = document.querySelector("#dateDateOfBirth");
let selectDesignationElement = document.querySelector("#selectDesignation");
let selectEmployeeStatusElement = document.querySelector("#selectEmployeeStatus");
let textMobileNoElement = document.querySelector("#textMobileNo");
let textEmailElement = document.querySelector("#textEmail");
let textLandNoElement = document.querySelector("#textLandNo");
let selectCivilStatusElement = document.querySelector("#selectCivilStatus");
let textAddressElement = document.querySelector("#textAddress");
let textNoteElement = document.querySelector("#textNote");


//access browser onload event..................................

window.addEventListener("load", () => {

    userPrivi = getHTTPServiceRequest("/userprivilagebymodule?modulename=employee")


    //call refresh tbl function ( whenbrowser refresh, when submid end, when update end, when delete end)
    refreshEmployeeTable();

    //call refresh form function ( whenbrowser refresh, when submid end, when update end, when cler end)
    refreshEmployeeForm();


});


//*********************************************************************************************
//********************************************************************************************* 


//define function for refresh employee table................................................
const refreshEmployeeTable = () => {


    //cach the database data 
    employees = getServiceRequest("/employee/alldata");


    //console.log(employees, "data");

    //string--->string/text/date/number
    //function---> object/arry/boolean/ if direct property not exist

    // table column count = property count 
    let propertyList = [
        { dataType: "string", propertyName: "fullname" },
        { dataType: "string", propertyName: "nic" },
        { dataType: "string", propertyName: "email" },
        { dataType: "string", propertyName: "mobilenumber" },
        { dataType: "function", propertyName: getDesignation },
        { dataType: "function", propertyName: getEmployeeStatus }
        // { dataType: "function", propertyName: "getBirthYear" } //direct data nethi nisa function gnwa.

    ];


    //call filldatainto table
    fillDataIntoTable(tableBodyEmployee, employees, propertyList, formRefill, employeeDelete, printEmployee); //tablebodyid, arraydatalist, propertylist........

    //user anuwa privilage wens weddi update and delete button desable weemata
    for (const index in employees) {
        if (!userPrivi.privi_update)
            tableBodyEmployee.children[index].children[7].children[0].style.disabled = "disabled";

        if (!userPrivi.privi_delete)
            tableBodyEmployee.children[index].children[7].children[1].style.disabled = "disabled";
    }
}

//define function for get designation value ( for refresh emp table)
const getDesignation = (dataOb) => {
    return dataOb.designation_table_id.name;
}


//define function for employee status  ( for refresh emp table)
const getEmployeeStatus = (dataOb) => {
    //status walata colur danwa
    if (dataOb.employee_status_id.name == "Working") {
        return "<p class= 'bg-success fw-bold text-center p-1'> " + dataOb.employee_status_id.name + "</p>";
    }
    if (dataOb.employee_status_id.name == "Resigned") {
        return "<p class= 'bg-danger fw-bold text-center p-1'> " + dataOb.employee_status_id.name + "</p>";
    }

}

/** 
//define function for birth yr ( for refresh emp table)
const getBirthYear = (dataOb) => {
    return new Data(dataOb.dob).getFullYear();
}
**/


//define function for print (poduwe beri nisa table refresh eke meka dala methna function eka define krnwa)
const printEmployee = (dataOb) => {

    employee = dataOb;

    //option 1- open new print tab to print
    let newWindow = window.open();

    newWindow.document.writeln(
        "<html><head><title> Print Employee Details </title></head><body>" +
        "<h1> __________Employee Details__________ </h1>" +
        "<p><strong> Full Name : </strong> " + employee.fullname + "</p>" +
        "<p><strong> Calling Name: </strong> " + employee.callingname + "</p>" +
        "<p><strong> Name With Initial : </strong> " + employee.nameWithInisial + "</p>" +
        "<p><strong> NIC : </strong> " + employee.nic + "</p>" +
        "<p><strong> Gender : </strong> " + employee.gender + "</p>" +
        "<p><strong> Date of Birth : </strong> " + employee.dob + "</p>" +
        "<p><strong> Email : </strong> " + employee.email + "</p>" +
        "<p><strong> Civil Status : </strong> " + employee.civilstatus + "</p>" +
        "<p><strong> Mobile No : </strong> " + employee.mobilenumber + "</p>" +
        "<p><strong> Land No : </strong> " + employee.landno + "</p>" +
        "<p><strong> Address : </strong> " + employee.address + "</p>" +
        "<p><strong> Note : </strong> " + employee.note + "</p>" +
        "<p><strong> Designation : </strong> " + employee.designation + "</p>" +
        "<p><strong> Employee Status : </strong> " + employee.employeestatus + "</p>" +
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


/** 
  //option 2- print modal
  // html eke model ekk hadnna oni. td walin thiynne id. html eke yatama enna oni.

 <div class="modal fade" id="modalPrint" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">

            <div class="modal-header">
                <h1 class="modal-title fs-5">Print Employee</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body" id="printModal">

                <div class="row m-2">
                    <div class="col-6 text-start">
                        <h5>Calling Name</h5>
                        <h4 id="tdCallingname"></h4>
                    </div>
                </div>
                <table class="table mt-2">
                    <tr>
                        <th>Employee Id</th>
                        <td id="tdEmployeeId"></td>
                    </tr>
                    <tr>
                        <th>Full Name</th>
                        <td id="tdFullname"></td>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <td id="tdAddress"></td>
                    </tr>
                    <tr>
                        <th>NIC</th>
                        <td id="tdNIC"></td>
                    </tr>
                    <tr>
                        <th>Gender</th>
                        <td id="tdGender"></td>
                    </tr>
                    <tr>
                        <th>Date of Birth</th>
                        <td id="tdFdob"></td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td id="tdemail"></td>
                    </tr>
                    <tr>
                        <th>Mobile Number</th>
                        <td id="tdmobileno"></td>
                    </tr>
                    <tr>
                        <th>Land Number</th>
                        <td id="tdlandno"></td>
                    </tr>
                    <tr>
                        <th>Civil Status</th>
                        <td id="tdcivilstatus"></td>
                    </tr>
                    <tr>
                        <th>Designation</th>
                        <td id="tddesignation"></td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td id="tdStatus"></td>
                    </tr>
                    <tr>
                        <th>Note</th>
                        <td id="tdNote"></td>
                    </tr>
                </table>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="printEmployeeButton();">Print</button>
            </div>

        </div>
    </div>
 </div>
 


   tdFullName.innerText = employee.fullname;
   tdCallingName.innerText = employee.callingname;
   tdNameWithInisial.innerText = employee.nameWithInisial;
   tdNIC.innerText = employee.nic;
   tdGender.innerText = employee.gender;
   tdDateOfBirth.innerText = employee.dob;
   tdEmail.innerText = employee.email;
   tdCivilStatus.innerText = employee.civilstatus;
   tdMobileNo.innerText = employee.mobileno;
   tdLandNo.innerText = employee.landno;
   tdAddress.innerText = employee.address;
   tdNote.innerText = employee.note;
   tdDesignation.innerText = employee.designation;
   tdEmployeeStatus.innerText = employee.employeestatus;
   
   //open model
   const myModalAlternative = new bootstrap.Modal('#modalPrint')
   myModalAlternative.show();

  //define function for print - for option 2
  const printEmployeeButton = (dataOb) => {

   

  let printView = "<html><head><link rel='icon' href='Images/tabiconnew.png'><title>Gold\'s Gym | Print</title> <link rel='stylesheet' " +
        "href='Other Resources/Bootstrap v5.2.3/css/bootstrap.min.css'><script src='Other Resources/Bootstrap v5.2.3/js/bootstrap.bundle.min.js'></script></head><body>" +
        printModal.outerHTML + "</body><html>"

    newWindow.document.write(printView)


    // Sets a timer to execute a series of actions after a specified delay.(The delay in milliseconds) 1.5s
    setTimeout(() => {
        // Stops the loading of content in the 'newWindow'
        newWindow.stop();

        // Triggers the print dialog for the content within 'newWindow'
        newWindow.print();

        // Closes the 'newWindow' after the print dialog is initiated (or closed by the user)
        newWindow.close();
    }, 1500);
  }

*/



//define function for refill(edit) form (poduwe beri nisa table refresh eke meka dala methna function eka define krnwa)
const formRefill = (dataOb) => {

    //employee = dataOb and oldEmployee = dataOb kiyala thiyaddi dekama ekai. e nisa mehema liynwa. 
    // e kiynne direct samana kloth refrence variable wenwa. ekk change kloth denma chnge wenwa. mehema denma refrnce wenne na, refrenc gelwila separate object bawta path wenwa.    
    employee = getServiceRequest("/employee/byid?id=" + dataOb.id);
    oldEmployee = getServiceRequest("/employee/byid?id=" + dataOb.id);

    textFullNameElement.value = employee.fullname;

    //clear sellect calling name elemant inner tag
    selectCallingnameElement.innerHTML = "";

    //generate option msg
    let optionMsg = document.createElement("option");

    optionMsg.selected = "selected";
    optionMsg.disabled = "disabled";
    optionMsg.value = "";
    optionMsg.innerText = "Select Callingname";

    selectCallingnameElement.appendChild(optionMsg);

    let nameParts = employee.fullname.split(" ");

    //generate option with name parts
    nameParts.forEach(namePart => {
        let option = document.createElement("option");
        option.value = namePart;
        option.innerText = namePart;
        selectCallingnameElement.appendChild(option);

    });

    selectCallingnameElement.value = employee.callingname;
    nameInisialElement.value = employee.namewithinitial;

    textNICElement.value = employee.nic;

    if (employee.gender == "Male") {
        radioMaleElement.checked = true;
    } else {
        radioFemaleElement.checked = true;
    }

    textMobileNoElement.value = employee.mobilenumber;

    textLandNoElement.value = employee.landno;

    if (employee.landno == null) {
        textLandNoElement.value = "";
    } else {
        textLandNoElement.value = employee.landno;
    }

    selectCivilStatusElement.value = employee.civilstatus;

    textAddressElement.value = employee.address;

    textEmailElement.value = employee.email;

    dateDateOfBirthElement.value = employee.dob;

    textNoteElement.value = employee.note;

    if (employee.note == null) {
        textNoteElement.value = "";
    } else {
        textNoteElement.value = employee.note;
    }

    selectDesignationElement.value = JSON.stringify(employee.designation_table_id);
    selectEmployeeStatusElement.value = JSON.stringify(employee.employee_status_id);

    buttonSubmit.style.display = "none";  // submit penne na
    buttonUpdate.style.display = "inline-block";   // update penwa
    buttonUpdate.disabled = false;   // Important
}


//define function for  check form updates (mg ena eka wage )
const checkFormUpdate = () => {

    let updates = "";

    if (employee.fullname != oldEmployee.fullname) {
        updates = updates + "Full Name Is Changed..! \n" + oldEmployee.fullname + " into " + employee.fullname + "\n";
    }

    if (employee.callingname != oldEmployee.callingname) {
        updates = updates + "Calling Name Is Changed..! \n" + oldEmployee.callingname + " into " + employee.callingname + "\n";
    }

    if (employee.nameWithInisial != oldEmployee.nameWithInisial) {
        updates = updates + "Name With Initial Is Changed..! \n" + oldEmployee.nameWithInisial + " into " + employee.nameWithInisial + "\n";
    }

    if (employee.nic != oldEmployee.nic) {
        updates = updates + "NIC Is Changed..! \n" + oldEmployee.nic + " into " + employee.nic + "\n";
    }

    if (employee.dob != oldEmployee.dob) {
        updates = updates + "Date of Birth Is Changed..! \n" + oldEmployee.dob + " into " + employee.dob + "\n";
    }

    if (employee.email != oldEmployee.email) {
        updates = updates + "Email Is Changed..! \n" + oldEmployee.email + " into " + employee.email + "\n";
    }

    if (employee.civilstatus != oldEmployee.civilstatus) {
        updates = updates + "Civil Status Is Changed..! \n" + oldEmployee.civilstatus + " into " + employee.civilstatus + "\n";
    }

    if (employee.mobilenumber != oldEmployee.mobilenumber) {
        updates = updates + "Mobile No Is Changed..! \n" + oldEmployee.mobilenumber + " into " + employee.mobilenumber + "\n";
    }

    if (employee.landno != oldEmployee.landno) {
        updates = updates + "Land Number Is Changed..! \n" + oldEmployee.landno + " into " + employee.landno + "\n";
    }

    if (employee.address != oldEmployee.address) {
        updates = updates + "Address Is Changed..! \n" + oldEmployee.address + " into " + employee.address + "\n";
    }

    if (employee.note != oldEmployee.note) {
        updates = updates + "Note Is Changed..! \n" + oldEmployee.note + " into " + employee.note + "\n";
    }

    if (employee.designation_id.name != oldEmployee.designation_id.name) {
        updates = updates + "Designation Is Changed..! \n" + oldEmployee.designation_id.name + " into " + employee.designation_id.name + "\n";
    }

    if (employee.employeestatus_id.name != oldEmployee.employeestatus_id.name) {
        updates = updates + "Employee Status Is Changed..! \n" + oldEmployee.employeestatus_id.name + " into " + employee.employeestatus_id.name + "\n";
    }

    return updates;
}

//define function for update Employee
/** 
const updateEmployee = () => {

    let errors = checkFormError();

    if (errors == "") {
        let update = checkFormUpdate();

        if (updates == "") {
            window.alert("Form Hasn't Any Change..!");
        } else {
            let userConfirm = window.confirm("Are You Sure to Apply Above Changes..? \n" + updates);

            if (userConfirm) {
                let servicesResponce = getHTTPServiceRequest("/employee/update", "PUT", employee);
                if (servicesResponce == "OK") {
                    window.alert("Update Completed..!");

                    //refresh form area
                    refreshEmployeeForm();
                    $("#modalEmployeeForm").modal("hide");

                    //refresh table area
                    refreshEmployeeTable();
                } else {
                    window.alert("Update Not Completed..! \n Form Has Some Errors ..! \n" + servicesResponce);
                }
            }
        }
    } else {
        window.alert("Form Has Following Errors..! \n" + formErrors);
    }
}
**/


const updateEmployee = () => {
    console.log(employee);

    //need to check errors
    let errors = checkFormError();

    if (errors == "") {
        // swal("Update Not Completed..!", " Form Hasn't Any Changes..! \n", "error");

        let updates = checkFormUpdate();

        if (updates == "") {
            swal("No Changes Found..!", "", "warning");

        } else {
            swal({
                title: "Are You Sure To Update This Employee..?",
                text: "Following Employee Details Will Be Changed..! \n" + updates,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })


                .then((willUpdate) => {

                    if (willUpdate) {

                        let serviceResponse = getHTTPServiceRequest("/employee/update", "PUT", employee);

                        if (serviceResponse == "OK") {
                            swal("Update Completed..!", {
                                icon: "success",
                            });


                            //refresf table area
                            refreshEmployeeTable();

                            //refresf form area
                            refreshEmployeeForm();

                            // Hide the modal form
                            //$("#modalEmployeeForm").modal("hide");


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

//define function for emp delete
const employeeDelete = (dataOb) => {

    swal({
        title: "Are You Sure To Delete This Employee..?",
        text: "Following Employee Details Will Be Deleted..! \n" +
            "Employee Fullname" + dataOb.fullname +
            "\n Employee NIC" + dataOb.nic +
            "\n Employee Email" + dataOb.email +
            "\n Employee Mobile No" + dataOb.mobilenumber +
            "\n Employee Designation" + dataOb.designation +
            "\n Employee Status" + dataOb.employeestatus,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })


        .then((willDelete) => {

            if (willDelete) {

                let serviceResponse = getHTTPServiceRequest("/employee/delete", "DELETE", dataOb);

                if (serviceResponse == "OK") {

                    swal("Delete Completed..!", {
                        icon: "success",
                    });


                    //refresf table area
                    refreshEmployeeTable();

                } else {
                    swal("Delete Not Completed..!", "Form Has Some Errors..! \n" + serviceResponse, "error");

                };
            }


        });


}



//*********************************************************************************************
//********************************************************************************************* 


//define function for refresh employee form.....................................................
const refreshEmployeeForm = () => {

    formEmployee.reset(); //clear static element value


    //visibility remove   ------>  buttonUpdate.style.visibility = "hidden";
    //visibility remv klma ena spce eka nethi krnna ---> buttonUpdate.style.display = "none";
    // button eka vivibility thiynwa 

    //if (!userPrivi.privi_insert) { //update ekdi submit disable
    //  buttonSubmit.disabled = "disabled";
    //}


    buttonUpdate.disabled = "disabled";   //update eka disable
    //buttonUpdate.style.visibility = "hidden";

    //create empty object
    employee = new Object();

    let designation = getServiceRequest("/designation/alldata");
    fillDataToSelect(selectDesignationElement, "Select Designation..!", designation, "name");


    let employeestatuses = getServiceRequest("/employeestatus/alldata");
    fillDataToSelect(selectEmployeeStatusElement, "Select Employee Status..!", employeestatuses, "name");

    //cler all element (border colur)
    clearElement([textFullNameElement, selectCallingnameElement, nameInisialElement, textNICElement, radioMaleElement, radioFemaleElement, selectCivilStatusElement, textAddressElement, textEmailElement, textLandNoElement,
        dateDateOfBirthElement, selectDesignationElement, selectEmployeeStatusElement, textMobileNoElement]);
}


//fullname validation
textFullNameElement.addEventListener("keyup", () => {

    let fullName = textFullNameElement.value;
    let regPattern = new RegExp("^([A-Z][a-z]{2,20}[\\s])+([d][e][\\s])?([A-Z][a-z]{2,20}[\\s])*([A-Z][a-z]{2,25})$");

    if (regPattern.test(fullName)) {

        textFullNameElement.style.border = "2px solid green";
        //textFullNameElement.classList.add
        //textFullNameElement.classList.remove
        employee.fullname = fullName;

        //clear sellect calling name elemant inner tag
        selectCallingnameElement.innerHTML = "";

        //generate option msg
        let optionMsg = document.createElement("option");

        optionMsg.selected = "selected";
        optionMsg.disabled = "disabled";
        optionMsg.value = "";
        optionMsg.innerText = "Select Calling Name";
        selectCallingnameElement.appendChild(optionMsg);

        //split fullname into name parts
        let nameParts = employee.fullname.split(" ");
        //let nameParts = fullName.trim().split(/\s+/);

        //generate option with name parts - add name parts to dropdown
        nameParts.forEach(namePart => {
            let option = document.createElement("option");

            if (namePart.length > 2) {
                option.value = namePart;
                option.innerText = namePart;
                selectCallingnameElement.appendChild(option);
            }

        });

        //genarte name with inisial
        let nameWithInisial = "";
        nameParts.forEach((namePart, index) => {
            if (index < nameParts.length - 1) {
                nameWithInisial = nameWithInisial + namePart.charAt(0).toUpperCase() + ".";
            }
        });

        //last name
        nameWithInisial = nameWithInisial + nameParts[nameParts.length - 1].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].substring(1);
        //let lastName = nameParts[nameParts.length - 1];
        //nameWithInisial += lastName.charAt(0).toUpperCase() + lastName.substring(1);

        nameInisialElement.value = nameWithInisial;
        nameInisialElement.style.border = "2px solid green";
        employee.namewithinisial = nameWithInisial;

    } else {
        textFullNameElement.style.border = "2px solid red";
        employee.fullname = null;
        selectCallingnameElement.innerHTML = "";
        employee.callingname = null;
        selectCallingnameElement.style.border = "#dee2e6";

        nameInisialElement.value = "";
        nameInisialElement.style.border = "2px solid #dee2e6";
        employee.namewithinisial = null;


    }
});


/** 
textFullNameElement.addEventListener("keyup", () => {
 
    let fullName = textFullNameElement.value.trim();
 
    // Improved regex (more flexible)
    let regPattern = /^([A-Z][a-z]{2,20})(\s[A-Z][a-z]{2,20})+$/;
 
    if (regPattern.test(fullName)) {
 
        textFullNameElement.style.border = "2px solid green";
        employee.fullname = fullName;
 
        // Clear dropdown
        selectCallingnameElement.innerHTML = "";
 
        // Default option
        let optionMsg = document.createElement("option");
        optionMsg.selected = true;
        optionMsg.disabled = true;
        optionMsg.value = "";
        optionMsg.innerText = "Select Calling Name";
        selectCallingnameElement.appendChild(optionMsg);
 
        // Split name parts (remove extra spaces)
        let nameParts = fullName.split(/\s+/);
 
        // Add name parts to dropdown
        nameParts.forEach(namePart => {
            let option = document.createElement("option");
            option.value = namePart;
            option.innerText = namePart;
            selectCallingnameElement.appendChild(option);
        });
 
        // Generate name with initials
        let nameWithInisial = "";
 
        nameParts.forEach((namePart, index) => {
            if (index < nameParts.length - 1) {
                nameWithInisial += namePart.charAt(0).toUpperCase() + ". ";
            }
        });
 
        // Last name (full)
        let lastName = nameParts[nameParts.length - 1];
        nameWithInisial += lastName.charAt(0).toUpperCase() + lastName.slice(1);
 
        // Set value
        nameInisialElement.value = nameWithInisial;
        nameInisialElement.style.border = "2px solid green";
        employee.nameWithInisial = nameWithInisial;
 
    } else {
 
        textFullNameElement.style.border = "2px solid red";
        employee.fullname = null;
 
        selectCallingnameElement.innerHTML = "";
        employee.callingname = null;
        selectCallingnameElement.style.border = "#dee2e6";
 
        nameInisialElement.value = "";
        nameInisialElement.style.border = "2px solid #dee2e6";
        employee.nameWithInisial = null;
    }
});
*/

//nic validation and age gender generation
textNICElement.addEventListener("keyup", () => {

    let nicno = textNICElement.value;
    let regOb = new RegExp("^(([0-9]{9}[VvXx])|([0-9]{12}))$");

    if (regOb.test(nicno)) {

        employee.nic = nicno;
        textNICElement.style.border = "2px solid green";


        let birthYear = "";
        let noOfDates = "";
        if (nicno.length == 10) {
            birthYear = "19" + nicno.substring(0, 2);
            noOfDates = nicno.substring(2, 5);

        } else {
            birthYear = nicno.substring(0, 4);
            noOfDates = nicno.substring(4, 7);
        }


        // genarate gender 
        if (parseInt(noOfDates) > 500) {
            radioFemaleElement.checked = true;
            employee.gender = "female";

        } else {
            radioMaleElement.checked = true;
            employee.gender = "male";
        }

        /**calculate age
        let currentYear = new Date().getFullYear();
        textAgeElement.value = parseInt(currentYear) - parseInt(birthYear);
        textAgeElement.style.border = "2px solid green";
        employee.age = textAgeElement.value; //data binding- only if data pass to the database **/

    } else {
        employee.nic = null;
        employee.gender = null;
        //employee.age = null;

        textNICElement.style.border = "2px solid red";
        //textAgeElement.style.border = "2px solid #dee2e6";

        radioFemaleElement.checked = false;
        radioMaleElement.checked = false;

        //textAgeElement.value = "";
    }

});


//date of birth validation.........................
function setMaxDate(input) {
    const today = new Date().toISOString().split("T")[0];
    input.max = today;
}

function handleDOB(input) {

    const selectedDate = new Date(input.value);
    const today = new Date();

    if (selectedDate > today) {
        alert("Future dates are not allowed!");
        input.value = "";
        input.style.border = "2px solid red";
        return;
    }

    // Optional: Age validation (e.g. minimum 18 years)
    //const age = today.getFullYear() - selectedDate.getFullYear();
    //if (age < 18) {
    /// alert("Employee must be at least 18 years old.");
    // input.value = "";
    // input.style.border = "2px solid red";
    // return;
    // }

    // Valid
    input.style.border = "2px solid green";

    // Your object assignment
    employee.dob = input.value;
}


//define function check form error.........................
const checkFormError = () => {
    let errors = "";

    if (employee.fullname == null) {
        errors = errors + "Please Enter Valid Full Name ..!\n";
    }

    if (employee.callingname == null) {
        errors = errors + "Please Enter Valid Calling Name ..!\n";
    }

    if (employee.nic == null) {
        errors = errors + "Please Enter Valid NIC ..!\n";
    }

    if (employee.dob == null) {
        errors = errors + "Please Select Date of Birth ..!\n";
    }

    if (employee.mobilenumber == null) {
        errors = errors + "Please Enter Valid Mobile number ..!\n";
    }

    if (employee.email == null) {
        errors = errors + "Please Enter Valid Email ..!\n";
    }

    if (employee.civilstatus == null) {
        errors = errors + "Please Select Civil Status ..!\n";
    }

    if (employee.address == null) {
        errors = errors + "Please Enter Valid Address ..!\n";
    }

    if (employee.designation_table_id == null) {
        errors = errors + "Please Select Designation ..!\n";
    }

    if (employee.employee_status_id == null) {
        errors = errors + "Please Select Employee Status ..!\n";
    }

    return errors;

}

//define method for submit emp form......................
const submitEmployee = () => {

    //check all required element has valid value
    let errors = checkFormError();


    if (errors == "") {

        swal({
            title: "Are You Sure To Save This Employee..?",
            text: " Added Employee Details Will Be Saved..! ",

            icon: "warning",
            buttons: true,
            dangerMode: true,
        })


            .then((willSave) => {

                if (willSave) {

                    let serviceResponse = getHTTPServiceRequest("/employee/save", "POST", employee);

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
























