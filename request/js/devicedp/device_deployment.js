/*
 * for BoengRule.html
 *
 */


var FR ={};
var rowData = [];
const columnDefs = [ 
    { 
        field: 'field_customer', 
        width: 220, 
        headerName: 'Customer Name',
        headerCheckboxSelection: false,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
        onCellDoubleClicked: function(event) {
            const selectedRows = gridOptions.api.getSelectedRows();
            if (cookie_grades.Edit == "Yes") {
                document.querySelector('#selectedRows').innerHTML =
                    selectedRows.length === 1 ? selectedRows[0].ID : '';	
                location.href = "device_deployment_edit.html?ID="+selectedRows[0].ID;
                document.body.style.cursor = 'wait';
            };
        }
    },  
    { field: 'field_status', width: 200, headerName: 'Status'},
    { field: 'field_assignee', width: 200, headerName: 'Assignee'},
    { field: 'field_root_device', width: 200, headerName: 'Root Device'},
    { field: 'field_product_variant', width: 200, headerName: 'Product Variant'},
    { field: 'field_managed_by_hc', width: 200, headerName: 'Managed by Home Controller'},
    { field: 'field_home_controller', width: 200, headerName: 'Home Controller'},
    { field: 'field_speedtest_needed', width: 200, headerName: 'Speedtest Requested'},
    { field: 'field_speedtest', width: 200, headerName: 'Speedtest'},
    { field: 'field_activate_container', width: 200, headerName: 'Activate Contrainer'},
    { field: 'field_container_devices', width: 200, headerName: 'Containers'},
    { field: 'field_root_update_method', width: 200, headerName: 'Root Device Update Method'},
    { field: 'field_separate_license', width: 200, headerName: 'Separate License for OTA'},
    { field: 'field_auto_ota', width: 200, headerName: 'Auto OTA'},
    { field: 'field_waiver', width: 200, headerName: 'OTA Waiver'},
    { field: 'field_boeng_rule', width: 200, headerName: 'Configure Boeng Rule'},
    { field: 'field_whitelisting_method', width: 200, headerName: 'Whitelisting Method'},
    { field: 'field_ip_ranges', width: 200, headerName: 'IP Ranges'},
    { field: 'field_customer_id', width: 200, headerName: 'Customer Id'},
    { field: 'field_csv_file', width: 200, headerName: 'SN CSV'},
    { field: 'field_boeng_options', width: 200, headerName: 'Boeng Options'},
    { field: 'field_acs_url', width: 200, headerName: 'ACS URL'},
    { field: 'field_acs_username', width: 200, headerName: 'ACS Username'},
    { field: 'field_acs_password', width: 200, headerName: 'ACS Password'},
    { field: 'field_usp_addr', width: 200, headerName: 'USP Controller Address'},
    { field: 'field_usp_port', width: 200, headerName: 'USP Controller Port'},
    { field: 'field_mesh_extended', width: 200, headerName: 'Mesh Extended'},
    { field: 'field_extender_beacon', width: 200, headerName: 'Extender Beancon'},
    { field: 'field_extender_update_method', width: 200, headerName: 'Extender Update Mehtod'},
    { field: 'field_extender_separate_license', width: 200, headerName: 'Extender OTA License'},
    { field: 'field_extender_auto_ota', width: 200, headerName: 'Extender Auto OTA'},
    { field: 'field_extender_waiver', width: 200, headerName: 'Extender OTA Waiver'},
    { field: 'field_additional', width: 200, headerName: 'Addtional Info'},
    { field: 'additional', width: 200, headerName: 'Commnents'},
    { field: 'creator', width: 150, headerName: 'Creator'},
    { field: 'createon', width: 150, headerName: 'Created On'},
    { field: 'modifier', width: 150, headerName: 'Modifier'},
    { field: 'modifiedon', width: 150, headerName: 'Modified On'},
    { field: 'ID',width: 120, headerName: 'Item' },
    { field: 'field_jira_id', width: 200, headerName: 'Jira Id'} 
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
        selectedRowsString += item.B_ID;
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
        fileName: 'Device_Deployment-' + year + month + date+ hour + minutes + '.xlsx',
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
    $.ajaxSetup({
            async: false
        });       
        
    $.getJSON("../gpi/allocate/devicedp_list",{mail: $.cookie(cookie_mail), level: $.cookie(cookie_level), type: "all"},function(data){      	
        $(data.data.items).each(function(){
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
            const url = '../gpi/allocate/devicedp_edit';
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
