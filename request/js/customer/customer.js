/*
 * for BoengRule.html
 *
 */


var FR ={};
var rowData = [];
const columnDefs = [ 
    { 
        field: 'field_customer_name', 
        width: 160, 
        headerName: 'Customer',
        headerCheckboxSelection: false,
        checkboxSelection: false,
        showDisabledCheckboxes: false,
        onCellDoubleClicked: function(event) {
            const selectedRows = gridOptions.api.getSelectedRows();
            if (cookie_grades.Edit == "Yes") {
                document.querySelector('#selectedRows').innerHTML =
                    selectedRows.length === 1 ? selectedRows[0].field_jira_id : '';	
                location.href = "customer_edit.html?ID="+selectedRows[0].field_jira_id;
                document.body.style.cursor = 'wait';
            };
        }
    },  
    { field: 'field_customer_id', width: 200, headerName: 'Customer Id'},
    { field: 'field_customer_olcs', width: 200, headerName: 'Customer OLCS'},
    { field: 'field_customer_impact', width: 200, headerName: 'Customer Impact'},
    { field: 'field_ont_plm', width: 200, headerName: 'ONT PLM'},
    { field: 'field_nwf_plm', width: 200, headerName: 'NWF PLM'},
    { field: 'field_fwa_plm', width: 200, headerName: 'FWA PLM'},
    { field: 'field_local_contact', width: 200, headerName: 'Local Contact'},
    { field: 'field_jira_id', width: 200, headerName: 'Id', hide: true},
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
        fileName: 'Customer-' + year + month + date+ hour + minutes + '.xlsx',
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
        
    $.getJSON("../gpi/allocate/jira_customer_list",{mail: $.cookie(cookie_mail), level: $.cookie(cookie_level), type: "all"},function(data){      	
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

// function deleteitem(){ 
//     sendPostDelete()                    
// };

// async function sendPostDelete() {
//     mail = $.cookie(cookie_mail)    
//     grade = $.cookie(cookie_grade)
//     level = $.cookie(cookie_level)           
//     if (document.formxl.ID.value == ""){
//         alert ("No item selected for deletion!")
//     } else {
//         if (confirm("Are you sure you want to delete item(s) selected?")) {             
//             Deletelist = document.formxl.ID.value;
//             const url = '../gpi/allocate/devicedp_edit';
//             const data = {                               
//                 type: 'delete',                
//                 mail: mail,
//                 level: level, 
//                 grade: grade,
//                 deletelist: Deletelist                
//             };
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(data)
//             });            
//             const result = await response.json();
//             resp = result.data.status;                    
//             if (resp.includes('successful')) {
//                 alert("Delete successful!");
//                 window.location.reload();	
//             }else{
//                 alert("Delete failure!");
//             }
//         } //else {
//         //     alert ("Delete cancelled!")
//         // }
//     }
// };


function show_div(){
    // if (cookie_grades.Add == "Yes") {
    //     $("#grade_Add").show();
    // }else{
    //     $("#grade_Add").hide();
    // };
    // if (cookie_grades.Delete == "Yes") {
    //     $("#grade_Delete").show();
    // }else{
    //     $("#grade_Delete").hide();
    // };
    if (cookie_grades.Export == "Yes") {
        $("#grade_Export").show();
    }else{
        $("#grade_Export").hide();
    };
};

window.addEventListener("beforeload",function(e){
    document.body.className = "page-loading";
},false);
