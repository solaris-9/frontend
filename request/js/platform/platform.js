/*
 * for BoengRule.html
 *
 */


var FR ={};
var rowData = [];

function onCellDoubleClick(event) {
    if (cookie_grades.Edit == "Yes") {
        const query = new URLSearchParams(event.data).toString();
        console.log("query = ", query);
        location.href = "platform_edit.html?"+query;
    };
};

const columnDefs = [ 
    { field: 'ID',}, 
    { field: 'field_platform', headerName: 'Platform'}, 
    { field: 'field_type', headerName: 'Type'}, 
    { field: 'field_customer_trials', headerName: 'Customer/Trials'}, 
    { field: 'field_public_cloud', headerName: 'Public Cloud'}, 
    { field: 'field_cloud_sw', headerName: 'Cloud SW'}, 
    { field: 'field_region', headerName: 'Region'}, 
    { field: 'creator', hide: true}, 
    { field: 'createon', hide: true}, 
    { field: 'modifier', hide: true}, 
    { field: 'modifiedon', hide: true}, 
];

// let the grid know which columns and what data to use
const gridOptions = {
    defaultColDef: {
        sortable: true,
        resizable: true,	
        //wrapText: true,
        autoHeight: true, 
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
    rowSelection: {
        mode: "multiRow",
        headerCheckbox: true,
    },
    //rowMultiSelectWithClick: true,  
    onSelectionChanged: onSelectionChanged,
    onCellDoubleClicked: onCellDoubleClick,
    pagination: true,
    paginationAutoPageSize: true,
    //paginationPageSizeSelector: [10, 20, 50, 100],
    //paginationPageSize: 5,

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
        fileName: 'Corteca_Platform-' + year + month + date+ hour + minutes + '.xlsx',
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
       
    $.ajax({
        url: "../gpi/platform/list",
        type: "GET",
        dataType: "json",
        data: {mail: $.cookie(cookie_mail), level: $.cookie(cookie_level), type: "all"},
        contentType: "application/json; charset=utf-8",
        success: function(result){      	
            gridApi.setGridOption("rowData", result.data.items);
            gridApi.setGridOption("loading", false);
        },
        error: function (xhr, status, error) {
            console.error("Failed to load data:", error);
        }
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
            const url = '../gpi/platform/delete';
            const data = {                               
                type: 'delete',                
                mail: mail,
                level: level, 
                grade: grade,
                ids: Deletelist                
            };
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });            
            const result = await response.json();
            const code = result.code;                    
            if (code === 20000) {
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

