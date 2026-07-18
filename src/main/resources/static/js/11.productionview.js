//access browser onload event..................................
window.addEventListener("load", () => {

    refreshProductionViewTable();

});

//colored status pill, mirrors the pattern used elsewhere in the app
const getJobStatusBadge = (data) => {

    let colorClass = "secondary";
    if (data.jobstatus == "Completed") colorClass = "success";
    else if (data.jobstatus == "Printing") colorClass = "warning";
    else if (data.jobstatus == "Pending") colorClass = "danger";

    return '<span class="badge bg-' + colorClass + '">' + (data.jobstatus || "") + '</span>';
}

//define function for refresh table (read-only)................................................
const refreshProductionViewTable = () => {

    productions = getServiceRequest("/productionview/alldata");

    let propertyList = [
        { dataType: "string", propertyName: "jobid" },
        { dataType: "string", propertyName: "customername" },
        { dataType: "function", propertyName: (data) => data.product_id ? data.product_id.name : "" },
        { dataType: "string", propertyName: "ordereddate" },
        { dataType: "string", propertyName: "deliverydate" },
        { dataType: "string", propertyName: "total" },
        { dataType: "string", propertyName: "balance" },
        { dataType: "function", propertyName: getJobStatusBadge }
    ];

    // read-only view: no edit/delete/print actions, so pass no-op handlers and hide the modify column
    fillDataIntoTable(tableBodyProductionView, productions, propertyList, () => {}, () => {}, () => {}, false);
}
