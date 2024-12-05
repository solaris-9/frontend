function show_hide(){ 	         
    show_hc_type();
    show_other_tenant_instance();
    show_flag_a();
    show_flag_b();
} 

//var global_id = decode_id(location.search);
var global_id = global_url_param.get('ID');

var global_status_value = {};

//var nwcc_saas = new Map();
//var global_csv_file = '';
var global_file_uploaded = {
    field_trial_test_plan: "",
};

var nwcc_fields = {
    field_customer: {type: 'list', flag: false},
    field_status: {type: 'text', flag: false},
    field_assignee: {type: 'text', flag: false},
    field_mail: {type: 'text', flag: false},
    field_jira_id: {type: 'text', flag: false},
    field_customer_id: {type: 'text', flag: false},
    field_country: {type: 'text', flag: false},
    field_tenant_type: {type: 'list', flag: false},
    field_hc_type: {type: 'list', flag: false},
    field_alive_date: {type: 'text', flag: false},
    field_dedicated_region: {type: 'list', flag: false},
    field_dedicated_legal_clearance: {type: 'list', flag: false},
    field_multi_region: {type: 'list', flag: false},
    field_multi_legal_clearance: {type: 'list', flag: false},
    field_trial_tenant: {type: 'list', flag: false},
    field_trial_other_tenant: {type: 'text', flag: false},
    field_trial_date: {type: 'text', flag: false},
    field_trial_device_number: {type: 'text', flag: false},
    field_trial_test_plan: {type: 'file', flag: false},
    field_3_month: {type: 'text', flag: false},
    field_6_month: {type: 'text', flag: false},
    field_12_month: {type: 'text', flag: false},
    field_committed_1st_year: {type: 'text', flag: false},
    field_fcc_compilance: {type: 'list', flag: false},
    field_support_level: {type: 'list', flag: false},
    field_deploy_region: {type: 'text', flag: false},
    field_integration_corteca: {type: 'list', flag: false},
    field_hdm_po: {type: 'text', flag: false},
    field_advance_fingerprinting: {type: 'list', flag: false},
    field_customer_responsible: {type: 'text', flag: false},
    field_wbs_billing: {type: 'text', flag: false},
    field_additional: {type: 'text', flag: false}
};

window.onload = initialize_page();

function initialize_page() {
    fetch_customer(document.formxl.field_customer);
    //fetch_device([document.formxl.field_root_device], "all");
    // render_beacon([document.formxl.field_extender_beacon]);
    //fetch_nwcc_saas();
    //fetch_customer_contacts();
    // fetch_opid();
    if (global_id.length > 0) {
        fetch_nwcc();
    }
    
    $("#preloader").hide();
    $("#mainpart").show();

    show_hide();

    //document.body.style.cursor='default';
}

function fetch_nwcc() {
    $.getJSON("../gpi/nwcc/list",{
        "ID": global_id, 
        'type': 'single', 
        level: $.cookie(cookie_level), 
        mail: $.cookie(cookie_mail)}, function (data) {
            for ([key, attr] of Object.entries(nwcc_fields)) {
                let ttype = attr.type;
                let val = data.data.items[0][key];
                switch(ttype) {
                    case "text":
                        document.formxl[key].value = val;
                        if (key == "field_assignee") {
                            global_status_value = {};
                            global_status_value[document.formxl.field_status.value] = val;
                        }
                        break;
                    case "list":
                        document.formxl[key].value = val;
                        break;
                    case "radio":
                        switch(val) {
                            case "":
                                break;
                            case "Yes":
                                let elem_y = key + "_yes";
                                $("#" + elem_y).prop("checked", true);
                                break;
                            case "No":
                                let elem_n = key + "_no";
                                $("#" + elem_n).prop("checked", true);
                                break;
                        };
                        break;
                    case "multi":
                        if (val) {
                            val.split(",").forEach(v => {
                                $("#" + key + " option[value='" + v + "']").prop("selected", true);
                            });
                        };
                        break;
                    case "file":
                        //
                        if (val.length > 0) {
                            let html = '<p><a href="../gpi/allocate/file_download?file=' +
                                val + '" download>' + val.split('____')[1] + '</a></p>';
                            $("#" + key.replace("field_", "url_")).html(html);
                            global_file_uploaded[key] = val;
                        };
                        
                        break;
                    case "checkbox":
                        if (val.length > 0) {
                            let obj = attr.child;
                            val.split(';').forEach(v => {
                                let elem = get_key_by_val(obj, v);
                                $("#"+elem).prop("checked", true);
                            });
                        }
                        break;
                };
            };

            show_hide();
        }
    );
    document.formxl.title_id.value = global_id;
};

$(".form-control-file").change(function(e){
    upload(this.id);
});

function upload(id) {
    let cfile=$("#" + id)[0].files[0];
    if (cfile.name.length <= 0) {
        return;
    }
    let data = new FormData();
    data.append('file', cfile);
    //global_csv_file = cfile.name;

    // var html = '<p><a href="../gpi/allocate/file_download?file=' +
    //     global_csv_file + '">' + global_csv_file + '</a></p>';
    let old_file_name = cfile.name;

    $.ajax({
        url: "../gpi/allocate/file_upload",
        type: "POST",
        data: data,
        contentType: false,
        cache: false,
        processData: false,
        success: function(msg) {
            global_file_uploaded[id] = msg.data.name;
            let html = '<p><a href="../gpi/allocate/file_download?file=' +
                msg.data.name + '" download>' + old_file_name + '</a></p>';
            $("#" + id.replace("field_", "url_")).html(html);
            $("#" + id.replace("field_", "label_")).text(old_file_name + " uploaded OK.");
        }
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
                //console.log(id);
                let $parent = $elem.parent().parent();
                let flag = false;
                let childs = $parent.find(":input:visible");
                for (let i=0; i < childs.length; i++) {
                    if(childs[i].checked) {
                        flag = true;
                    };
                };
                if (flag) {
                    $parent.css({"border": ""});
                } else {
                    let m_by_hc = $("#field_managed_by_hc").val();
                    if (m_by_hc == "Yes") { 
                        if (id == childs[0].id) {
                            count++;
                            $parent.css({"border": "2px dashed red"});
                        };
                    }else {
                        $parent.css({"border": ""});
                    };
                };
            } else {
                if (id != "field_additional") {
                    let val = $elem.val();
                    if (val) {
                        // if (id == "field_customer_id") {
                        //     count += check_pattern(id, /^10\d{8}$/);
                        // } else {
                        $elem.css({"border": ""});
                        // };
                    } else {
                        if (id == "field_status" || id == "field_assignee") {
                            $elem.css({"border": ""});
                        } else {
                            count++;
                            $elem.css({"border": "2px dashed red"});
                        };
                    };
                };
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

function customerAdd() {
    if (!customer_pre_validation()) {
        return;
    };
    let mail = $.cookie(cookie_mail);
    let uname = $.cookie(cookie_name);
    let customer = $("#new_customer_name").val();
    if (!confirm("Please confirm if you want the new customer '" + customer + "' be saved into database?")) {
        return;
    }
    $("#customerAdd").html('<i class="fa fa-spinner fa-pulse"></i>Add');
    const url = '../gpi/allocate/new_customer_add';
    var data = {
        uname: uname,
        Customer: customer,
        Id: $("#new_customer_id").val(),
        ONT: $("#new_ont_plm").val(),
        NWF: $("#new_nwf_plm").val(),
        FWA: $("#new_fwa_plm").val(),
        Local: $("#new_local_contact").val(),
        Description: "",
        //Description: $("#new_customer_desc").val(),
        Source: "local",
        AddedBy: mail,
        AddedOn: get_ts()
    };
    sendPost(url, data, "Add New Customer");

    global_customers.set(
        customer,
        customer
    );
    clear_options(document.formxl.field_customer);
    render_customer(document.formxl.field_customer);
    $('#field_customer').val(customer);
    
    //$('#customerModal').modal('toggle');
};

function customer_pre_validation() {
    let count = 0;
    if ( $("#new_customer_name").val().length > 0) {
        $("#new_customer_name").css({"border": ""});
    } else {
        count++;
        $("#new_customer_name").css({"border": "2px dashed red"});
    };

    if (count > 0) {
        $("#error_all_customer").text("You have " + count + " error(s) in this form!");
        $("#error_all_customer").show();
        return false;
    } else {
        $("#error_all_customer").text("");
        $("#error_all_customer").hide();
        return true;
    };
};
function clear_all_new_customer_values() {
    $("#customerForm").find(":input").each(function() {
        let id = this.id;
        let $elem = $(this);
        if (id.startsWith('new_')) {
            $elem.val("");
        };
    });
};


function save(flag = false) {
    let res = pre_validation();
    if (!res) {
        return false;
    };
    $("#btn_submit").html('<i class="fa fa-spinner fa-pulse"></i>Submit');
    mail = $.cookie(cookie_mail);
    const url = '../gpi/nwcc/edit';
    
    var data = {
        mail: mail
    };

    for ([key, attr] of Object.entries(nwcc_fields)) {
        let ttype = attr.type;
        //let val = data.data.items[0][key];
        let res = "";
        switch(ttype) {
            case "text":
                
                if (key == "field_status" && (document.formxl[key].value == "" || document.formxl[key].value == "New")) {
                    data[key] = "New";
                    let cus = document.formxl.field_customer.value;
                    if (!document.formxl.field_assignee.value) {
                        if (global_customer_contacts.has(cus)) {
                            document.formxl.field_assignee.value = global_customer_contacts.get(cus).cplm;
                        };
                    };
                } else if (key == "field_jira_id") {
                    if ( global_customers.has(document.formxl.field_customer.value)) {
                        data[key] = global_customers.get(document.formxl.field_customer.value).key;
                    } else {
                        data[key] = "";
                    };
                } else {
                    data[key] = document.formxl[key].value;
                };
                break;
            case "list":
                data[key] = document.formxl[key].value;
                break;
            case "radio":
                res = "";
                ["yes", "no"].forEach(v => {
                    let elem = key + "_" + v;
                    if ($("#" + elem).is(':checked')) {
                        res = v[0].toUpperCase() + v.slice(1);
                    };
                });
                data[key] = res;
                break;
            case "multi":
                //data[key] = document.formxl[key].value;
                let val = $("#"+key).val();
                if (val) {
                    data[key] = val.join(",");
                } else {
                    data[key] = '';
                };
                break;
            case "file":
                data[key] = global_file_uploaded[key]; //document.formxl[key].value;
                break;
            case "checkbox":
                let obj = attr.child;
                res = "";
                for ([k, v] of Object.entries(obj)) {
                    if ($("#" + k).is(':checked')) {
                        res += v + ";";
                    }; 
                };
                data[key] = res;
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
    if (flag) {
        return sendPostSync(url, data, action, flag);
    } else {
        return sendPost(url, data, action, flag);
    };
};


async function sendPost(url, data, action, flag = false) {
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
                if (!flag) {
                    window.location = document.referrer;
                };
            } else {
                window.location.reload(history.back());
            };
        } else {
            $('#customerModal').modal('toggle');
            clear_all_new_customer_values();
        };
        return true;
    }else{
        alert(resp);
        return false;
    }

};

function sendPostSync(url, data, action, flag = false) {
    try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, false); // `false` makes the request synchronous
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));

        if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            const resp = result.data.status;

            if (resp.includes('successful')) {
                alert(action + " OK!");
                if (action !== "Add New Customer") {
                    if ('referrer' in document) {
                        if (!flag) {
                            window.location = document.referrer;
                        }
                    } else {
                        window.location.reload(history.back());
                    }
                } else {
                    $('#customerModal').modal('toggle');
                    clear_all_new_customer_values();
                };
                return true;
            } else {
                alert(resp);
                return false;
            };
        } else {
            alert(`Error: ${xhr.status} - ${xhr.statusText}`);
            return false;
        };
    } catch (error) {
        console.error("Synchronous request failed", error);
        alert("An unexpected error occurred.");
        return false;
    };
};


function render_product_variant(prod) {
    if (global_device.has(prod)) {
        let elem = document.formxl.field_product_variant;
        let codes = global_device.get(prod).Code.sort();
        clear_options(elem);
        for (let i=0; i<codes.length; i++) {
            let code = codes[i];
            if (code != "") {
                elem.options[elem.length]=new Option(code);
            }
        };
    };
};

$("#field_customer").change(function(){    
    show_customer_id();
});
function show_customer_id() {
    let cus = $("#field_customer").val();
    let cus_id = "";
    if (global_customers.has(cus)) {
        cus_id = global_customers.get(cus).cid;
    };
    $("#field_customer_id").val(cus_id);

};
$("#field_hc_type").change(function(){    
    show_hc_type(true);
    show_flag_a();
    show_flag_b();
});
function show_hc_type(flag = false) {
    let ttype = $("#field_hc_type").val();
    ['flag_dedicated_instance', 'flag_multi_instance', 'flag_trial_instance'].forEach(elem => {
        $("#"+elem).hide();
        if (flag) {
            clear_child_value(elem);
        };
    });
    if (ttype == "Dedicated instance") {
        $("#flag_dedicated_instance").show();
    } else if(ttype == "Multi-tenant instance") {
        $("#flag_multi_instance").show();
    } else if(ttype == "Trial instance") {
        $("#flag_trial_instance").show();
    }; 
};
$("#field_trial_tenant").change(function(){
    show_other_tenant_instance();
});
function show_other_tenant_instance() {
    let val = $("#field_trial_tenant").val();
    if (val == "Other") {
        $("#flag_other_tenant_instance").show();
    } else {
        $("#flag_other_tenant_instance").hide();
        clear_child_value("flag_other_tenant_instance");
    };
};
function show_flag_a() {
    let val1 = $("#field_dedicated_legal_clearance").val();
    let val2 = $("#field_multi_legal_clearance").val();
    if ( val1 == "Yes" || val2 == "Yes") {
        $("#flag_a").show();
        $("#flag_b").show();
    } else {
        $("#flag_a").hide();
        clear_child_value("flag_a");
        $("#flag_b").hide();
        clear_child_value("flag_b");
        $("#field_advance_fingerprinting").val("Disabled");
    };
};
$("#field_dedicated_legal_clearance").change(function() {
    show_flag_a();
});
$("#field_multi_legal_clearance").change(function() {
    show_flag_a();
});
function show_flag_b() {
    let val = $("#field_hc_type").val();
    
    if ( val === "Trial instance") {
        $("#flag_b").show();
    } else if (val === "") {
        $("#flag_b").hide();
        clear_child_value("flag_b");
        $("#field_advance_fingerprinting").val("Disabled");
    };
    show_hdm_po_license();
};
function show_hdm_po_license() {
    let val = $("#field_integration_corteca").val();
    if ( val == "Yes") {
        $("#flag_hdm_yes").show();
    } else {
        $("#flag_hdm_yes").hide();
        clear_child_value("flag_hdm_yes");
    };

};
$("#field_integration_corteca").change(function() {
    show_hdm_po_license();
});



function show_status() {
    let $elem = $("#flag_status")
    if (global_id.length > 0) {
        $elem.show();
    } else {
        $elem.hide();
    }
};
$("#field_status").change(function(){
    status_change();
});

//var global_status = "";

$("#field_assignee").change(function(){
    let status = document.formxl.field_status.value;
    global_status_value[status] = this.value;
});

function status_change() {
    let val = document.formxl.field_status.value;
    status_toggle();
    get_assignee_by_status(val);
};
function get_assignee_by_status(status) {
    let cus = document.formxl.field_customer.value;
    let pre_assignee = document.formxl.field_assignee.value;
    let cplm = "";
    let local_contact = "";
    // if (global_status) {
    //     global_status_value[global_status] = pre_assignee;
    // }
    if (global_customer_contacts.has(cus)){
        cplm = global_customer_contacts.get(cus).cplm;
        local_contact = global_customer_contacts.get(cus).local_contact || "jaisankar.gunasekaran@nokia.com";
    };
    if (global_status_value.hasOwnProperty(status)) {
        document.formxl.field_assignee.value = global_status_value[status]
    } else {
        switch (status) {
            case "New":
                document.formxl.field_assignee.value = cplm;
                break;
            case "Accepted":
                document.formxl.field_assignee.value = local_contact;
                break;
            case "Implemented":
                document.formxl.field_assignee.value = cplm;
                break;
            case "Query":
                document.formxl.field_assignee.value = "";
                break;
            case "Rejected":
                document.formxl.field_assignee.value = "";
                break;
            case "Closed":
                document.formxl.field_assignee.value = "";
                break;
        };
    };
};
function status_toggle() {
    let val = $("#field_status").val();
    let flag = false;
    if (val == "New") {
        flag = true;
    };
    for ([key, attr] of Object.entries(nwcc_fields)) {
        let l_exceptions = ['field_status', 'field_assignee', 'field_additional'];
        if (l_exceptions.includes(key)) {
            continue;
        }
        if (attr.type == "checkbox") {
            let obj = attr.child;
            for ([k, v] of Object.entries(obj)) {
                $("#"+k).prop('disabled', !flag); 
            };
        } else {
            $("#"+key).prop('disabled', !flag);
        };
    };
    if (flag) {
        $('#btnModal').show();
    } else {
        $('#btnModal').hide();
    }
};


function addRootDevice() {
    if (confirm("Do you want to save all current configuration and go to Root Device Operation?")) {
        console.log("add root device...");
        const cus = document.formxl.field_customer.value;
        const val = "Yes"
        const url = `../devicedp/device_deployment_edit.html?ID=&field_customer=${cus}&field_managed_by_hc=${val}`;
        console.log("url = ", url);
        const ret = save(true);
        //setTimeout(() => {
            if (ret) {
                location.href = url;
            };
        //}, 5000);
    };
 };
 