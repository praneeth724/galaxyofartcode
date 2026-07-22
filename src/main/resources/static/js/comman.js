

//define finction for request get services.................................................
const getServiceRequest = (url) => {

  let getResponces = [];

  $.ajax({
    url: url, // The URL to which the request is sent
    type: "GET", // The type of request (GET, POST, PUT, etc.)
    async: false,
    dataType: "json", // The type of data expected back from the server

    //data: { name: "value" } // Data to be sent to the server


    success: function (response) {
      // Code to run if the request succeeds
      console.log("Data receved:", response);
      getResponces = response;  // update the DOM with the recevied data
    },

    error: function (jqXHR, textStatus, errorThrown) {
      // Code to run if the request fails
      console.error("Error:", textStatus, errorThrown);
    },

    always: function () {
      // Code to run when the request finishes, regardless of success or failure
      console.log("Request complete");
    }
  });

  return getResponces;

}


//define function for request POST,PUT,DELETE services............................................
const getHTTPServiceRequest = (url, method, data) => {

  let servicesResponces = "";

  // CSRF token, rendered into every page via topnavbar.html's meta tags
  let csrfToken = document.querySelector('meta[name="_csrf"]');
  let csrfHeader = document.querySelector('meta[name="_csrf_header"]');

  let ajaxSettings = {
    url: url, // The URL to which the request is sent
    type: method, // The type of request (GET, POST, PUT, etc.)
    async: false,
    data: JSON.stringify(data),
    contentType: "application/json", // The expected data type of the request type


    success: function (response) {
      // Code to run if the request succeeds
      console.log("Data receved:", response);
      servicesResponces = response;  // update the DOM with the recevied data
    },

    error: function (jqXHR, textStatus, errorThrown) {
      // Code to run if the request fails
      console.error("Error:", textStatus, errorThrown);
      servicesResponces = "Error:" + textStatus + "," + errorThrown;
    },

    complete: function () {
      // Code to run when the request finishes, regardless of success or failure
      console.log("Request complete");
    }
  };

  if (csrfToken && csrfHeader) {
    ajaxSettings.headers = {};
    ajaxSettings.headers[csrfHeader.content] = csrfToken.content;
  }

  $.ajax(ajaxSettings);

  return servicesResponces;

}


//define function for uploading a file and getting back its stored path...........
const uploadFileServiceRequest = (url, file) => {

  let servicesResponces = null;

  let csrfToken = document.querySelector('meta[name="_csrf"]');
  let csrfHeader = document.querySelector('meta[name="_csrf_header"]');

  let formData = new FormData();
  formData.append("file", file);

  let ajaxSettings = {
    url: url,
    type: "POST",
    async: false,
    data: formData,
    processData: false,
    contentType: false,

    success: function (response) {
      servicesResponces = response;
    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Upload Error:", textStatus, errorThrown);
      servicesResponces = null;
    }
  };

  if (csrfToken && csrfHeader) {
    ajaxSettings.headers = {};
    ajaxSettings.headers[csrfHeader.content] = csrfToken.content;
  }

  $.ajax(ajaxSettings);

  return servicesResponces;

}


//define common text element validation function....................
const textValidator = (element, pattern, object, property) => {

  let elementValue = element.value;
  let regOb = new RegExp(pattern, "u");


  if (elementValue != "") {
    if (regOb.test(elementValue)) {
      element.style.border = "2px solid green";
      object[property] = elementValue;

    } else {
      element.style.border = "2px solid red";
      object[property] = null;

    }
  } else {
    if (element.required) {
      element.style.border = "2px solid red";
    } else {
      element.style.border = "2px solid #dee2e6";
    }
    object[property] = null;
  }
}



//remove object border coler when refresh.................
const clearElement = (elementList) => {

  elementList.forEach(element => {
    element.style.border = "2px solid #dee2e6";
  });
}



//define function to fill data into table..................
const fillDataIntoTable = (tableBodyElement, dataList, propertyList, editFunction, deleteFunction, printFunction, buttonVisibility = true, printOnly = false) => {

  tableBodyElement.innerHTML = "";

  dataList.forEach((data, index) => {
    let tr = document.createElement("tr");

    let tdIndex = document.createElement("td");
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);

    //property list ekn property argnwa data list eke property name ekata adala value eka ganna 
    propertyList.forEach((property, proIndex) => {
      let td = document.createElement("td");
      if (property.dataType == "string") {
        td.innerText = data[property.propertyName];
      }
      if (property.dataType == "function") {
        td.innerHTML = property.propertyName(data);
      }
      tr.appendChild(td);
    });


    let tdModify = document.createElement("td");
    tdModify.className = "d-flex justify-content-center align-items-center gap-2";
    if (buttonVisibility) {
      tr.appendChild(tdModify);
    }

    if (!printOnly) {
      //edit
      let buttonEdit = document.createElement("button");
      buttonEdit.type = "button";
      buttonEdit.innerHTML = '<i class="fa-solid fa-edit" </i>';

      buttonEdit.onclick = () => {
        console.log("Edit", data);
        editFunction(data);
      }

      buttonEdit.className = "btn edit  fw-bold ms-1 me-1";
      tdModify.appendChild(buttonEdit);

      //delete
      let buttonDelete = document.createElement("button");
      buttonDelete.type = "button";
      buttonDelete.innerHTML = '<i class="fa-solid fa-trash" ></i>';

      buttonDelete.onclick = () => {
        deleteFunction(data);
      }

      buttonDelete.className = "btn delete fw-bold ms-1 me-1";
      tdModify.appendChild(buttonDelete);
    }

    // print
    let buttonPrint = document.createElement("button");
    buttonPrint.type = "button";
    buttonPrint.innerHTML = '<i class="fa-solid fa-print" </i>';

    buttonPrint.onclick = () => {
      printFunction(data);
    }

    buttonPrint.className = "btn print fw-bold ms-1 me-1";
    tdModify.appendChild(buttonPrint);

    tableBodyElement.appendChild(tr);


  });

 
}



//define common function for fill data into select element
const fillDataToSelect = (element, message, dataList, property) => {

  element.innerHTML = "";


  //generate option msg
  let optionMsg = document.createElement("option");
  optionMsg.selected = "selected";
  optionMsg.disabled = "disabled";
  optionMsg.value = "";
  optionMsg.innerText = message;
  element.appendChild(optionMsg);



  //generate option with name parts
  dataList.forEach(dataOb => {
    let option = document.createElement("option");
    option.value = JSON.stringify(dataOb);
    option.innerText = dataOb[property];
    element.appendChild(option);

  });

}

