/* for Grade_management.html */

var FR ={};
var rowData = [];
const columnDefs = [ 
    { 
        field: 'Grade', 
        width: 160, 
        headerName: 'Grade',
        headerCheckboxSelection: false,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
		onCellDoubleClicked: function(event) {
            const selectedRows = gridOptions.api.getSelectedRows();
            document.querySelector('#selectedRows').innerHTML =
		        selectedRows.length === 1 ? selectedRows[0].ID : '';	
		    location.href = "Grade_edit.html?B_ID="+selectedRows[0].GID;
            document.body.style.cursor = 'wait';
        }
    },  
    { field: 'Add', width: 120, headerName: 'Add', cellClass: cellClass}, 
    { field: 'Edit', width: 120, headerName: 'Edit', cellClass: cellClass},
    { field: 'Delete', width: 120, headerName: 'Delete', cellClass: cellClass},
    { field: 'Search', width: 120, headerName: 'Search' , cellClass: cellClass},
    { field: 'View', width: 120, headerName: 'View', cellClass: cellClass},        
    { field: 'Export', width: 120, headerName: 'Export' , cellClass: cellClass},
    { field: 'Download', width: 120, headerName: 'Download', cellClass: cellClass},
    { field: 'RecordTime', width: 150, headerName: 'Record Time'},
    { field: 'GID',width: 120, headerName: 'Record ID' }     
];

function cellClass(params) {
  return params.value === "Yes" ? "rag-green" : "rag-blue";
}

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
        selectedRowsString += item.GID;
    });

    document.formxl.ID.value =selectedRowsString;
}

function onBtExport() {
    var d = new Date();
    let year=d.getFullYear();                 
    let month=d.getMonth() + 1;                   
    let date=d.getDate();
    let hour=d.getHours();                    
    let minutes=d.getMinutes();      
    var excelParams = {
        fileName: 'Grade_Management-' + year + month + date+ hour + minutes + '.xlsx',
        sheetName: 'request',	   
    }
    gridOptions.api.exportDataAsExcel(excelParams);
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
const gridDiv = document.querySelector('#myGrid');
new agGrid.Grid(gridDiv, gridOptions);
    mail = $.cookie(cookie_mail)
    level = $.cookie(cookie_level)
    $.ajaxSetup({
            async: false
        });       
        
    $.getJSON("gpi/allocate/grade_fetch",{mail: mail,level: level, type: '1'},function(data){      	
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
}    

async function sendPostDelete() {
    mail = $.cookie(cookie_mail)    
    grade = $.cookie(cookie_grade)
    level = $.cookie(cookie_level)           
    if (document.formxl.ID.value == ""){
         alert ("No item selected for deletion!")
    } else {
        if (confirm("Are you sure you want to delete item(s) selected?")) {             
            Deletelist = document.formxl.ID.value;
            const url = 'gpi/allocate/grade_edit';
            const data = {                               
                type: '3',                
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
} 
 
    
function show_div(){
        
    $("#adm").show();        
        
    //if ($.cookie(cookie_level) > '4' && $.cookie(cookie_level) != 'undefined')
    //{      
    // $("#adm").show();
    //}  
    
}

window.addEventListener("beforeload",function(e){
    document.body.className = "page-loading";
},false);