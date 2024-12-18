/*
 * for BoengRule.html
 *
 */


var FR ={};
var rowData = [];

function onCellDoubleClick() {
    const selectedRows = gridOptions.api.getSelectedRows();
    if (cookie_grades.Edit == "Yes") {
        document.querySelector('#selectedRows').innerHTML =
            selectedRows.length === 1 ? selectedRows[0].ID : '';	
        location.href = "nwcc_edit.html?ID="+selectedRows[0].ID;
        document.body.style.cursor = 'wait';
    };
};

const columnDefs = [ 
    { 
        field: 'ID', 
        width: 240, 
        headerName: 'Id',
        headerCheckboxSelection: false,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
        onCellDoubleClicked: onCellDoubleClick
        /*function(event) {
            const selectedRows = gridOptions.api.getSelectedRows();
            if (cookie_grades.Edit == "Yes") {
                document.querySelector('#selectedRows').innerHTML =
                    selectedRows.length === 1 ? selectedRows[0].ID : '';	
                location.href = "device_deployment_edit.html?ID="+selectedRows[0].ID;
                document.body.style.cursor = 'wait';
            };
        }*/
    }, 
    { field: 'field_customer', width: 220, headerName: 'Customer', onCellDoubleClicked: onCellDoubleClick}, 
    { field: 'field_customer_id', width: 200, headerName: 'Customer Id', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_status', width: 200, headerName: 'Status', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_assignee', width: 200, headerName: 'Assignee', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_country', width: 200, headerName: 'Country', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_hosted_by', width: 200, headerName: 'Hosting Platform', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_tenant_type', width: 200, headerName: 'Tenant Type', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_hc_type', width: 200, headerName: 'Home Controller Type', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_alive_date', width: 200, headerName: 'Tenant Alive Date', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_dedicated_region', width: 200, headerName: 'Hosting Region', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_dedicated_legal_clearance', width: 200, headerName: 'Legal Clearance', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_multi_region', width: 200, headerName: 'Host Region (multi)', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_multi_legal_clearance', width: 200, headerName: 'Legal Clearance (multi)', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_trial_type', width: 200, headerName: 'Trial Instance Type', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_trial_tenant', width: 200, headerName: 'Trial Tenant', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_trial_other_tenant', width: 200, headerName: 'Trial Other Tenant', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_trial_date', width: 200, headerName: 'Trial Duration', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_trial_device_number', width: 200, headerName: 'Trial Device Number', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_trial_test_plan', width: 200, headerName: 'Trial Test Plan', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_3_month', width: 200, headerName: '3 Months Number', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_6_month', width: 200, headerName: '6 Months Number', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_12_month', width: 200, headerName: '12 Months Number', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_committed_1st_year', width: 200, headerName: 'Commited 1 Year Volume', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_fcc_compilance', width: 200, headerName: 'FCC Compilance', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_support_level', width: 200, headerName: 'Support Level', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_deploy_region', width: 200, headerName: 'Deploy Region', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_integration_corteca', width: 200, headerName: 'HDM Integration with Corteca', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_hdm_po', width: 200, headerName: 'HDM PO', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_advance_fingerprinting', width: 200, headerName: 'Device Fingerprinting', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_customer_responsible', width: 200, headerName: 'Customer Responsible', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_wbs_billing', width: 200, headerName: 'WBS Billing', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_additional', width: 200, headerName: 'Addtional Info', onCellDoubleClicked: onCellDoubleClick},
    { field: 'creator', width: 150, headerName: 'Creator', onCellDoubleClicked: onCellDoubleClick},
    { field: 'createon', width: 150, headerName: 'Created On', onCellDoubleClicked: onCellDoubleClick},
    { field: 'modifier', width: 150, headerName: 'Modifier', onCellDoubleClicked: onCellDoubleClick},
    { field: 'modifiedon', width: 150, headerName: 'Modified On', onCellDoubleClicked: onCellDoubleClick},
    { field: 'field_jira_id', width: 200, headerName: 'Jira Id', hide: true},
];

// let the grid know which columns and what data to use
const gridOptions = {
    defaultColDef: {
        sortable: true,
        resizable: true,	
        //wrapText: true,
        //autoHeight: true, 
        //floatingFilter: true,
        autoHeight: true,
        filter: true,
        menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        filterParams: {
            applyMiniFilterWhileTyping: true,
        },
    },
    rowHeight: 30,
    suppressMenuHide: true,
    suppressAutoSize: true,
    //rowSelection: 'single',
    rowSelection: 'multiple',
    //rowMultiSelectWithClick: true,  
    onSelectionChanged: onSelectionChanged,
    pagination: true,
    paginationAutoPageSize: true,
    //paginationPageSizeSelector: [10, 20, 50, 100],
    //paginationPageSize: 5,

    columnDefs: columnDefs,
    rowData: rowData
};

function onSelectionChanged() {
    var selectedRows = gridOptions.api.getSelectedRows();
    var selectedRowsString = '';

    selectedRows.forEach(function (item, index) {        
        //console.log(item, index)
        if (index > 0) {
            selectedRowsString += ',';
        }
        selectedRowsString += item.ID;
    });

    document.formxl.ID.value =selectedRowsString;
};

function onBtExport() {
    var d = new Date();
    let year=d.getFullYear();                 
    let month=d.getMonth() + 1;                   
    let date=d.getDate();
    let hour=d.getHours();                    
    let minutes=d.getMinutes();      
    var excelParams = {
        fileName: 'NWCC_Deployment-' + year + month + date+ hour + minutes + '.xlsx',
        sheetName: 'request',	   
    }
    gridOptions.api.exportDataAsExcel(excelParams);
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    mail = $.cookie(cookie_mail)
    level = $.cookie(cookie_level)
    // fetch_customer("");
    $.ajaxSetup({
            async: false
        });       
        
    $.getJSON("../gpi/nwcc/list",{mail: $.cookie(cookie_mail), level: $.cookie(cookie_level), type: "all"},function(data){      	
        $(data.data.items).each(function(){
            // if (global_customers.has(this.field_customer)) {
            //     this.field_customer_id = global_customers.get(this.field_customer).cid;
            // } else {
            //     this.field_customer_id = '';
            // }
            FRT = JSON.stringify(this);	
            FRT = FRT.replace("[{", "{");
            FRT = FRT.replace("}]", "}");	
            FR=JSON.parse(FRT); 
            rowData.push(FR);
        })	  
        gridOptions.api.setRowData(rowData);

    });
    $.ajaxSetup({
            async: true
        });       
        
    $("#preloader").hide();
    $("#mainpart").show();
});

function deleteitem(){ 
    sendPostDelete()                    
};

async function sendPostDelete() {
    mail = $.cookie(cookie_mail)    
    grade = $.cookie(cookie_grade)
    level = $.cookie(cookie_level)           
    if (document.formxl.ID.value == ""){
        alert ("No item selected for deletion!")
    } else {
        if (confirm("Are you sure you want to delete item(s) selected?")) {             
            Deletelist = document.formxl.ID.value;
            const url = '../gpi/nwcc/edit';
            const data = {                               
                type: 'delete',                
                mail: mail,
                level: level, 
                grade: grade,
                deletelist: Deletelist                
            };
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });            
            const result = await response.json();
            resp = result.data.status;                    
            if (resp.includes('successful')) {
                alert("Delete successful!");
                window.location.reload();	
            }else{
                alert("Delete failure!");
            }
        } //else {
        //     alert ("Delete cancelled!")
        // }
    }
};


function show_div(){
    if (cookie_grades.Add == "Yes") {
        $("#grade_Add").show();
    }else{
        $("#grade_Add").hide();
    };
    if (cookie_grades.Delete == "Yes") {
        $("#grade_Delete").show();
    }else{
        $("#grade_Delete").hide();
    };
    if (cookie_grades.Export == "Yes") {
        $("#grade_Export").show();
    }else{
        $("#grade_Export").hide();
    };
};

window.addEventListener("beforeload",function(e){
    document.body.className = "page-loading";
},false);
