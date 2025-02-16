/*
 * for BoengRule.html
 *
 */


var FR ={};
var rowData = [];
const columnDefs = [ 
    { 
        field: 'Customer', 
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
                location.href = "BoengRule_edit.html?B_ID="+selectedRows[0].B_ID;
                document.body.style.cursor = 'wait';
            };
        }
    },  
    { field: 'device', width: 160, headerName: 'Device Model'}, 
    { field: 'OPID', width: 100, headerName: 'OPID'},
    { field: 'whitelistmethod', width: 200, headerName: 'Whitelisting method'},
    { field: 'countryid', width: 150, headerName: 'Country Id' },
    { field: 'iprange', width: 200, headerName: 'IP Ranges'},        
    { field: 'customer_name', width: 300, headerName: 'Customer Name in Auto Whitelisting' },
    { field: 'csv_file', width: 200, headerName: 'Serial Numbers CSV'},
    { field: 'tr069', width: 160, headerName: 'TR-069/ACS' },
    { field: 'home_controller', width: 160, headerName: 'Home Controller USP Agent'},		
    { field: 'rd_party_controller', width: 160, headerName: '3rd Party USP Controller' },
    { field: 'acs_url', width: 200, headerName: 'ACS URL'},
    { field: 'acs_username', width: 160, headerName: 'ACS Username'},        
    { field: 'acs_password', width: 160, headerName: 'ACS Password'},	
    { field: 'tenant_ref', width: 160, headerName: 'Reference to tenant hosting ticket'},	
    { field: 'usp_addr', width: 200, headerName: 'USP Controller address'},
    { field: 'usp_port', width: 160, headerName: 'USP Controller port'},
    { field: 'auto_upgrade', width: 160, headerName: 'Automatic SW updates with OTA'},         
    { field: 'separate_license', width: 160, headerName: 'Separate license for OTA'},
    { field: 'used_as_extender', width: 160, headerName: 'Extender to other root Beacons'},
    { field: 'root_beacon_extender_1', width: 200, headerName: 'Root Beacon Extender #1'},
    { field: 'root_beacon_extender_2', width: 200, headerName: 'Root Beacon Extender #2'},
    { field: 'root_beacon_extender_3', width: 200, headerName: 'Root Beacon Extender #3'},
    { field: 'root_beacon_extender_4', width: 200, headerName: 'Root Beacon Extender #4'},
    { field: 'root_beacon_extender_5', width: 200, headerName: 'Root Beacon Extender #5'},
    { field: 'root_beacon_extender_6', width: 200, headerName: 'Root Beacon Extender #6'},
    { field: 'root_beacon_extender_7', width: 200, headerName: 'Root Beacon Extender #7'},
    { field: 'root_beacon_extender_8', width: 200, headerName: 'Root Beacon Extender #8'},
    { field: 'root_beacon_extender_9', width: 200, headerName: 'Root Beacon Extender #9'},
    { field: 'root_beacon_extender_10', width: 200, headerName: 'Root Beacon Extender #10'},
    { field: 'additional', width: 200, headerName: 'Commnents'},
    { field: 'creator', width: 150, headerName: 'Creator'},
    { field: 'createon', width: 150, headerName: 'Created On'},
    { field: 'modifier', width: 150, headerName: 'Modifier'},
    { field: 'modifiedon', width: 150, headerName: 'Modified On'},
    { field: 'B_ID',width: 120, headerName: 'Item' }     
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
        fileName: 'BoENG_request-' + year + month + date+ hour + minutes + '.xlsx',
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
        
    $.getJSON("../gpi/allocate/boeng_list",{mail: $.cookie(cookie_mail), level: $.cookie(cookie_level), type: "all"},function(data){      	
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
            const url = '../gpi/allocate/boeng_edit';
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
