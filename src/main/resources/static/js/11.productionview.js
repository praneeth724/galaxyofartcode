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

    // read-only view: no edit/delete, but keep a print action, so pass no-op handlers for edit/delete and printOnly=true
    fillDataIntoTable(tableBodyProductionView, productions, propertyList, () => {}, () => {}, printProductionView, true, true);
}


//define function for print, mirrors printProduction() in 10.production.js
const printProductionView = (dataOb) => {

    let newWindow = window.open();

    newWindow.document.writeln(
        "<html><head><title> Print Production Job </title></head><body>" +
        "<h1> __________Production Job__________ </h1>" +
        "<p><strong> Job ID : </strong> " + dataOb.jobid + "</p>" +
        "<p><strong> Customer : </strong> " + dataOb.customername + "</p>" +
        "<p><strong> Product : </strong> " + (dataOb.product_id ? dataOb.product_id.name : "") + "</p>" +
        "<p><strong> Ordered Date : </strong> " + dataOb.ordereddate + "</p>" +
        "<p><strong> Delivery Date : </strong> " + dataOb.deliverydate + "</p>" +
        "<p><strong> Total : </strong> " + dataOb.total + "</p>" +
        "<p><strong> Balance : </strong> " + dataOb.balance + "</p>" +
        "<p><strong> Status : </strong> " + dataOb.jobstatus + "</p>" +
        "</body></html>"
    );

    setInterval(() => {
        newWindow.stop();
        newWindow.print();
        newWindow.close();
    }, 1000);
}
