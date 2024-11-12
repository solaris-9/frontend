/* for BoengRule_edit.html */


function show_hide(){ 	         
    // show_hide_by_value('field_managed_by_hc', 'Yes', 'flag_managed_by_hc');
    // show_root_update_method();
    // show_boeng_rule();
    // show_mesh_extended();
    // show_extender_update_method();
    // show_status();
    // status_change();
} 

var global_id = decode_id(location.search);

//var nwcc_saas = new Map();
//var global_csv_file = '';
// var global_file_uploaded = {
//     field_waiver: "",
//     field_csv_file: "",
//     field_extender_waiver: ""
// };

// var dd_boeng_options = {
//     field_boeng_option_tr069: 'TR069', 
//     field_boeng_option_3rd_party: '3rd party USP', 
//     field_boeng_option_hc: 'Home Controller USP'
// };

var customer_fields = {
    field_jira_id: {type: 'text'},
    field_customer_name: {type: 'text'},
    field_description: {type: 'text'},
    field_customer_olcs: {type: 'text'},
    field_customer_impact: {type: 'text'},
    field_ont_plm: {type: 'text'},
    field_nwf_plm: {type: 'text'},
    field_fwa_plm: {type: 'text'},
    field_local_contact: {type: 'text'},
};

window.onload = initialize_page();

function initialize_page() {
    if (global_id.length > 0) {
        fetch_jira_customer();
    }
    
    $("#preloader").hide();
    $("#mainpart").show();

    show_hide();

    //document.body.style.cursor='default';
}
function fetch_jira_customer() {
    $.ajaxSetup({
        async: false
    });       

    $.getJSON("../gpi/allocate/jira_customer_list",{
        "ID": global_id, 
        'type': 'single', 
        level: $.cookie(cookie_level), 
        mail: $.cookie(cookie_mail)}, function (data) {
            for ([key, attr] of Object.entries(customer_fields)) {
                let ttype = attr.type;
                let val = data.data.items[0][key];
                switch(ttype) {
                    case "text":
                        document.formxl[key].value = val;
                        break;
                };
            };
        }
    );
    $.ajaxSetup({
        async: true
    });       
};


function pre_validation() {
    // make sure all input are not empty and valid
    var count = 0;
    
    // TODO
    //Traverse all visisble elements
    $("form[name='formxl']").find(":input:visible").each(function() {
        let id = this.id;
        let $elem = $(this);
        if (id.startsWith('field_')) {
            let ttype = $elem.attr('type');
            if (ttype == "checkbox" || ttype == "radio") {
            } else {
            };
        };
    });
    if (count > 0) {
        $("#error_all").text("You have " + count + " error(s) in this form!");
        $("#error_all").show();
        return false;
    } else {
        $("#error_all").text("");
        $("#error_all").hide();
        return true;
    };
};


function save() {
    let res = pre_validation();
    if (!res) {
        return;
    };
    $("#btn_submit").html('<i class="fa fa-spinner fa-pulse"></i>Submit');
    mail = $.cookie(cookie_mail);
    const url = '../gpi/allocate/jira_customer_edit';
    
    var data = {
        mail: mail
    };

    for ([key, attr] of Object.entries(customer_fields)) {
        let ttype = attr.type;
        //let val = data.data.items[0][key];
        let res = "";
        switch(ttype) {
            case "text":
                
                if (key == "field_status" && document.formxl[key].value == "") {
                    data[key] = "New";
                } else {
                    data[key] = document.formxl[key].value;
                };
                break;
            };
    };


    var action = ''
    if (global_id.length > 0) {
        // Edit mode
        data.type = 'edit';
        data.ID = global_id;
        data.modifier = mail;
        data.modifiedon = get_ts();
        action = 'Modify'
    } else {
        // Add mode
        data.type = 'add';
        data.creator = mail;
        data.createon = get_ts();
        action = 'Add'
    }
    
    sendPost(url, data, action);
};


async function sendPost(url, data, action) {
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
        alert(action + " OK!");
        if (action != "Add New Customer") {
            if ('referrer' in document) {
                window.location = document.referrer
            } else {
                window.location.reload(history.back());
            };
        };
    }else{
        alert(resp);
    }

};

