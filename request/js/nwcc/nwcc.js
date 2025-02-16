/*
 * for BoengRule.html
 *
 */


var rowData = [];

function onCellDoubleClick(event) {
    if (cookie_grades.Edit == "Yes") {
        const query = new URLSearchParams(event.data).toString();
        console.log("query = ", query);
        location.href = "nwcc_edit.html?"+query;
    };
};

const columnDefs = [ 
    { field: 'ID', }, 
    { field: 'field_customer', headerName: 'Customer'}, 
    { field: 'field_customer_id', headerName: 'Customer Id'},
    { field: 'field_status', headerName: 'Status'},
    { field: 'field_assignee', headerName: 'Assignee'},
    { field: 'field_country', headerName: 'Country'},
    { field: 'field_hosted_by', headerName: 'Hosting Platform'},
    { field: 'field_tenant_type', headerName: 'Tenant Type'},
    { field: 'field_hc_type', headerName: 'Home Controller Type'},
    { field: 'field_alive_date', headerName: 'Tenant Alive Date'},
    { field: 'field_dedicated_region', headerName: 'Hosting Region'},
    { field: 'field_dedicated_legal_clearance', headerName: 'Legal Clearance'},
    { field: 'field_multi_region', headerName: 'Host Region (multi)'},
    { field: 'field_multi_legal_clearance', headerName: 'Legal Clearance (multi)'},
    { field: 'field_trial_type', headerName: 'Trial Instance Type'},
    { field: 'field_trial_tenant', headerName: 'Trial Tenant'},
    { field: 'field_trial_other_tenant', headerName: 'Trial Other Tenant'},
    { field: 'field_trial_date', headerName: 'Trial Duration'},
    { field: 'field_trial_device_number', headerName: 'Trial Device Number'},
    { field: 'field_trial_test_plan', headerName: 'Trial Test Plan'},
    { field: 'field_3_month', headerName: '3 Months Number'},
    { field: 'field_6_month', headerName: '6 Months Number'},
    { field: 'field_12_month', headerName: '12 Months Number'},
    { field: 'field_committed_1st_year', headerName: 'Commited 1 Year Volume'},
    { field: 'field_fcc_compilance', headerName: 'FCC Compilance'},
    { field: 'field_support_level', headerName: 'Support Level'},
    { field: 'field_deploy_region', headerName: 'Deploy Region'},
    { field: 'field_integration_corteca', headerName: 'HDM Integration with Corteca'},
    { field: 'field_hdm_po', headerName: 'HDM PO'},
    { field: 'field_advance_fingerprinting', headerName: 'Device Fingerprinting'},
    { field: 'field_customer_responsible', headerName: 'Customer Responsible'},
    { field: 'field_wbs_billing', headerName: 'WBS Billing'},
    { field: 'field_additional', headerName: 'Addtional Info'},
    { field: 'creator'},
    { field: 'createon'},
    { field: 'modifier'},
    { field: 'modifiedon'},
    { field: 'field_jira_id', headerName: 'Jira Id', hide: true},
];

// let the grid know which columns and what data to use
const gridOptions = {
    defaultColDef: {
        sortable: true,
        resizable: true,	
        autoHeight: true, 
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
    rowSelection: {
        mode: "multiRow",
        headerCheckbox: true,
    },
    onSelectionChanged: onSelectionChanged,
    onCellDoubleClicked: onCellDoubleClick,
    pagination: true,
    paginationAutoPageSize: true,
    columnDefs: columnDefs,
    rowData: rowData,
    loading: true,
    autoSizeStrategy: {
        type: 'fitCellContents'
    },
};


function onSelectionChanged(event) {
    var selectedRows = event.api.getSelectedRows();
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
    gridApi.exportDataAsExcel(excelParams);
};

var gridApi;
// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid');
    gridApi = agGrid.createGrid(gridDiv, gridOptions);
    mail = $.cookie(cookie_mail)
    level = $.cookie(cookie_level)

    $.getJSON("../gpi/nwcc/list",{mail: $.cookie(cookie_mail), level: $.cookie(cookie_level), type: "all"},function(result){      	
        gridApi.setGridOption("rowData", result.data.items);
        gridApi.setGridOption("loading", false);
    });
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
        }
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
