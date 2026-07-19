//access browser onload event..................................
window.addEventListener("load", () => {

    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    if (id) {
        let production = getServiceRequest("/production/byid?id=" + id);
        fillProductionJobDetails(production);
    }

    document.querySelector("#buttonPrintJob").addEventListener("click", () => {
        window.print();
    });

});


//fill the read-only job details card with the submitted production data
const fillProductionJobDetails = (production) => {

    document.querySelector("#viewJobId").innerText = production.jobid || "";
    document.querySelector("#viewCustomerName").innerText = production.customername || "";
    document.querySelector("#viewContact").innerText = production.contact || "";
    document.querySelector("#viewJobStatus").innerText = production.jobstatus || "";
    document.querySelector("#viewOrderedDate").innerText = production.ordereddate || "";
    document.querySelector("#viewDeliveryDate").innerText = production.deliverydate || "";
    document.querySelector("#viewProduct").innerText = production.product_id ? production.product_id.name : "";
    document.querySelector("#viewDesignCategory").innerText = production.designcategory || "";
    document.querySelector("#viewDesignFormat").innerText = production.designformat || "";
    document.querySelector("#viewPrintArea").innerText = production.printarea || "";
    document.querySelector("#viewColorMode").innerText = production.colormode || "";
    document.querySelector("#viewDesignSize").innerText = production.designsize || "";
    document.querySelector("#viewQty").innerText = production.quantity != null ? production.quantity : "";
    document.querySelector("#viewUnitCost").innerText = production.unitcost != null ? production.unitcost : "";
    document.querySelector("#viewInkCost").innerText = production.inkcost != null ? production.inkcost : "";
    document.querySelector("#viewPaperCost").innerText = production.papercost != null ? production.papercost : "";
    document.querySelector("#viewDesignCost").innerText = production.designcost != null ? production.designcost : "";
    document.querySelector("#viewDiscount").innerText = production.discount != null ? production.discount : "";
    document.querySelector("#viewDiscountAmount").innerText = production.discountamount != null ? production.discountamount : "";
    document.querySelector("#viewTotalCost").innerText = production.total != null ? production.total : "";
    document.querySelector("#viewAdvance").innerText = production.advance != null ? production.advance : "";
    document.querySelector("#viewBalance").innerText = production.balance != null ? production.balance : "";
    document.querySelector("#viewApproved").innerText = production.approvedbymanager ? "Yes" : "No";
}
