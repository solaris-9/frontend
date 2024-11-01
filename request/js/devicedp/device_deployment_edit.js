/* for BoengRule_edit.html */


function show_hide(){ 	         
    show_hide_by_value('field_managed_by_hc', 'Yes', 'flag_managed_by_hc');
    show_root_update_method();
    show_boeng_rule();
    show_mesh_extended();
    show_extender_update_method();
} 

var global_id = decode_id(location.search);

//var nwcc_saas = new Map();
//var global_csv_file = '';
var global_file_uploaded = {
    field_waiver: "",
    field_csv_file: "",
    field_extender_waiver: ""
};

var dd_boeng_options = {
    field_boeng_option_tr069: 'TR069', 
    field_boeng_option_3rd_party: '3rd party USP', 
    field_boeng_option_hc: 'Home Controller USP'
};

var dd_fields = {
    field_customer: {type: 'list'},
    field_root_device: {type: 'list'},
    field_product_variant: {type: 'list'},
    field_managed_by_hc: {type: 'list'},
    field_home_controller: {type: 'list'},
    field_speedtest_needed: {type: 'list'},
    field_speedtest: {type: 'list'},
    field_activate_container: {type: 'list'},
    field_container_devices: {type: 'multi'},
    field_root_update_method: {type: 'list'},
    field_separate_license: {type: 'list'},
    field_auto_ota: {type: 'list'},
    field_waiver: {type: 'file'},
    field_boeng_rule: {type: 'list'},
    field_whitelisting_method: {type: 'list'},
    field_ip_ranges: {type: 'text'},
    field_customer_id: {type: 'text'},
    field_csv_file: {type: 'file'},
    field_boeng_options: {type: 'checkbox', child: dd_boeng_options},
    field_acs_url: {type: 'text'},
    field_acs_username: {type: 'text'},
    field_acs_password: {type: 'text'},
    field_usp_addr: {type: 'text'},
    field_usp_port: {type: 'text'},
    field_mesh_extended: {type: 'list'},
    field_extender_beacon: {type: 'list'},
    field_extender_update_method: {type: 'list'},
    field_extender_separate_license: {type: 'list'},
    field_extender_auto_ota: {type: 'list'},
    field_extender_waiver: {type: 'file'},
    field_additional: {type: 'text'}
};

window.onload = initialize_page();

function initialize_page() {
    //document.body.style.cursor='wait';

    fetch_customer(document.formxl.field_customer);
    fetch_device([document.formxl.field_root_device], "all");
    render_beacon([document.formxl.field_extender_beacon]);
    fetch_nwcc_saas();
    // fetch_opid();
    if (global_id.length > 0) {
        fetch_devicedp();
    }
    
    $("#preloader").hide();
    $("#mainpart").show();

    show_hide();

    //document.body.style.cursor='default';
}
function fetch_devicedp() {
    $.getJSON("../gpi/allocate/devicedp_list",{
        "ID": global_id, 
        'type': 'single', 
        level: $.cookie(cookie_level), 
        mail: $.cookie(cookie_mail)}, function (data) {
            for ([key, attr] of Object.entries(dd_fields)) {
                let ttype = attr.type;
                let val = data.data.items[0][key];
                switch(ttype) {
                    case "text":
                        document.formxl[key].value = val;
                        break;
                    case "list":
                        if (key == "field_root_device") {
                            render_product_variant(val);
                        } else if (key == "field_customer") {
                            render_nwcc(val, document.formxl.field_home_controller);
                        };
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
            render_product_variant(document.formxl.field_product_variant.value);
            show_hide();
        }
    );
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
                    if (id == childs[0].id) {
                        count++;
                        $parent.css({"border": "2px dashed red"});
                    };
                };
            } else {
                if (id != "field_additional") {
                    let val = $elem.val();
                    if (val) {
                        if (id == "field_customer_id") {
                            count += check_pattern(id, /^10\d{8}$/);
                        } else {
                            $elem.css({"border": ""});
                        };
                    } else {
                        count++;
                        $elem.css({"border": "2px dashed red"});
                    };
                };
            };
        };
    });
    // for ([key, attr] of Object.entries(dd_fields)) {
    //     let ttype = attr.type;
    //     obj = $("#"+key).closest("div[id|='field']");
    //     obj.each(function(){
    //         console.log(this.id);
    //     });
    //     switch(ttype) {
    //         case "text":
    //             //document.formxl[key].value = val;
    //             break;
    //         case "list":
    //             break;
    //     };
    // };
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
    const url = '../gpi/allocate/new_customer_add';
    var data = {
        uname: uname,
        Customer: customer,
        Description: $("#new_customer_desc").val(),
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
    render_nwcc(customer, document.formxl.field_home_controller);
    $('#field_customer').val(customer);
    $('#customerModal').modal('toggle');
};

function customer_pre_validation() {
    let count = 0;
    $("#customerForm").find(":input:visible").each(function() {
        let id = this.id;
        let $elem = $(this);
        if (id.startsWith('new_customer_')) {
            let val = $elem.val();
            if (val) {
                $elem.css({"border": ""});
            } else {
                count++;
                $elem.css({"border": "2px dashed red"});
            };
        };
    });
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

function save() {
    let res = pre_validation();
    if (!res) {
        return;
    };
    $("#btn_submit").html('<i class="fa fa-spinner fa-pulse"></i>Submit');
    mail = $.cookie(cookie_mail);
    const url = '../gpi/allocate/devicedp_edit';
    
    var data = {
        mail: mail
    };

    for ([key, attr] of Object.entries(dd_fields)) {
        let ttype = attr.type;
        //let val = data.data.items[0][key];
        let res = "";
        switch(ttype) {
            case "text":
                data[key] = document.formxl[key].value;
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
    let cus = $("#field_customer").val();

    //clear_options(document.formxl.field_product_variant);
    render_nwcc(cus, document.formxl.field_home_controller);
});

$("#field_root_device").change(function(){    
    var prod = ($("#field_root_device").val());

    //clear_options(document.formxl.field_product_variant);
    render_product_variant(prod);
});

$("#field_root_device").change(function(){    
    show_root_device();
});
function show_root_device() {
    let device = ($("#field_root_device").val());
    let elem = document.formxl.field_root_update_method;
    let old_value = elem.value;
    if (get_device_bl(device) == "ONT") {
        elem.options[elem.length]=new Option("OMCI");
        remove_option(elem, "OTA");
        elem.value = old_value;
    } else {
        remove_option(elem, "OMCI");
        remove_option(elem, "OTA");
        elem.options[elem.length]=new Option("OTA");
        elem.value = old_value;
    };

    show_root_update_method();
    show_boeng_rule();
    show_mesh_extended();
};

$("#field_managed_by_hc").change(function(){
    show_managed_by_hc();
});
function show_managed_by_hc() {
    //show_hide_by_value('field_managed_by_hc', 'Yes', 'flag_managed_by_hc');
    let val = document.formxl.field_managed_by_hc.value;
    let elem = document.formxl.field_root_update_method;
    let elem_extender = document.formxl.field_extender_update_method;
    let old_value_extender = elem_extender.value;
    let old_value = elem.value;
    let opt = "Home Controller";
    if (val == "Yes") {
        $("#flag_managed_by_hc").show();
        elem.options[elem.length]=new Option(opt);
        elem_extender.options[elem_extender.length]=new Option(opt);
    } else {
        $("#flag_managed_by_hc").hide();
        clear_child_value("flag_managed_by_hc");
        remove_option(elem, opt);
        elem.value = old_value;
        remove_option(elem_extender, opt);
        elem_extender.value = old_value_extender;
    };
    show_speedtest();
    show_activate_container();
    show_root_update_method();
    let boeng_elem = document.formxl.field_boeng_rule;
    //let wl_opt = 'Home Controller USP Agent';
    let boeng_value = boeng_elem.value;
    if (val == "Yes") {
        //wl_elem.options[wl_elem.length]=new Option(wl_opt);
        if (boeng_value == "Yes") {
            $("#flag_boeng_option_hc").show();
        } else {
            $("#flag_boeng_option_hc").hide();
        };
        $("#comment_boeng_option").show();
    } else {
        $("#flag_boeng_option_hc").hide();
        $("#comment_boeng_option").hide();
    };

};

function show_speedtest(){
    let val = $("#field_speedtest_needed").val();
    if (val == "Yes") {
        $("#flag_speedtest_needed").show();
    } else {
        $("#flag_speedtest_needed").hide();
        clear_child_value("flag_speedtest_needed");
    };
};

function show_activate_container() {
    let val = $("#field_activate_container").val();
    if (val == "Yes") {
        $("#flag_activate_container").show();
    } else {
        $("#flag_activate_container").hide();
        clear_child_value("flag_activate_container");
    };
};

$("#field_speedtest_needed").change(function(){
    show_speedtest();
});
$("#field_activate_container").change(function(){
    show_activate_container();
});

$("#field_root_update_method").change(function(){
    //show_hide_by_value('field_root_update_method', 'OTA', 'flag_ota');
    show_root_update_method();
});
function show_root_update_method() {
    let root_update_method = document.formxl.field_root_update_method.value;
    let root_device = document.formxl.field_root_device.value;
    let managed_by_hc = document.formxl.field_managed_by_hc.value;
    if (root_update_method == 'OTA') {
        if (managed_by_hc == "Yes") {
            $("#flag_root_update_method").hide();
            clear_child_value("flag_root_update_method");
        } else {
            if (managed_by_hc == "") {
                $("#flag_root_update_method").hide();
                clear_child_value("flag_root_update_method");
            } else {
                $("#flag_root_update_method").show();
            };
        };
        if (root_device.startsWith('Beacon')) {
            $("#flag_auto_ota").show();
            show_auto_ota_yes();
        }else {
            $("#flag_auto_ota").hide();
            clear_child_value("flag_auto_ota");
            $("#flag_auto_ota_yes").hide();
            clear_child_value("flag_auto_ota_yes");
        };
    } else {
        $("#flag_root_update_method").hide();
        clear_child_value("flag_root_update_method");
        $("#flag_auto_ota").hide();
        clear_child_value("flag_auto_ota");
        $("#flag_auto_ota_yes").hide();
        clear_child_value("flag_auto_ota_yes");
    };

};
function show_auto_ota_yes() {
    let val = $("#field_auto_ota").val();
    if (val == "Yes") {
        $("#flag_auto_ota_yes").show();
    } else {
        $("#flag_auto_ota_yes").hide();
        clear_child_value("flag_auto_ota_yes");
    };
};
$("#field_auto_ota").change(function(){
    show_auto_ota_yes();
});

$("#field_boeng_rule").change(function(){
    //show_hide_by_value('field_root_update_method', 'OTA', 'flag_ota');
    show_boeng_rule_detail();
});
function show_boeng_rule() {
    //show_hide_by_value('field_boeng_rule', 'Yes', 'flag_boeng_rule');
    let dev = document.formxl.field_root_device.value;
    if (dev.startsWith('Beacon')) {
        $("#flag_boeng_rule").show();
        show_boeng_rule_detail();
        
    } else {
        $("#flag_boeng_rule").hide();
        clear_child_value("flag_boeng_rule");
        $("#flag_boeng_rule_detail").hide();
        clear_child_value("flag_boeng_rule_detail");
        document.formxl.field_boeng_rule.value = "";
    };
    //show_boeng_rule_detail();
};
function show_boeng_rule_detail() {
    if (document.formxl.field_boeng_rule.value == "Yes") {
        $("#flag_boeng_rule_detail").show();
    } else {
        $("#flag_boeng_rule_detail").hide();
        clear_child_value("flag_boeng_rule_detail");
    };
    show_all_whitelisting_method();
    show_all_boeng_option();
};
$("#field_whitelisting_method").change(function(){
    show_whitelisting_method(this.value);
});
function show_whitelisting_method(value) {
    switch (value) {
        case "":
        case "Dedicated OPID":
            $("#flag_whitelisting_sn").hide();
            clear_child_value("flag_whitelisting_sn");
            $("#flag_whitelisting_ip_based").hide();
            clear_child_value("flag_whitelisting_ip_based");
            break;
        case "IP based":
            $("#flag_whitelisting_ip_based").show();
            $("#flag_whitelisting_sn").hide();
            clear_child_value("flag_whitelisting_sn");
            break;
        case "Serial number":
            $("#flag_whitelisting_sn").show();
            $("#flag_whitelisting_ip_based").hide();
            clear_child_value("flag_whitelisting_ip_based");
            break;
    };
};
function show_all_whitelisting_method() {
    let value = document.formxl.field_whitelisting_method.value;
    show_whitelisting_method(value);
};
$(".boeng-option").change(function(){
    show_boeng_option(this.id, this.checked);
});
function show_boeng_option(id, checked) {
    let flag_elem = id.replace("field_", "flag_");
    let elem = $("#"+flag_elem);
    if (checked) {
        if (elem.length > 0) {
            elem.show();
        };
    } else {
        if (elem.length > 0) {
            elem.hide();
            clear_child_value(flag_elem);
        };
    };
};
function show_all_boeng_option() {
    let whitelisting_elems = [
        "field_boeng_option_tr069",
        "field_boeng_option_3rd_party"
    ];

    whitelisting_elems.forEach(elem => {
        let flag = $("#"+elem).is(':checked');
        show_boeng_option(elem, flag);
    });
};

function show_mesh_extended() {
    //show_hide_by_value('field_boeng_rule', 'Yes', 'flag_boeng_rule');
    //let dev = document.formxl.field_root_device.value;
    //if (dev.startsWith('Beacon')) {
    $("#flag_mesh_extended").show();
    show_mesh_extended_detail();
    // } else {
    //     $("#flag_mesh_extended").hide();
    //     $("#flag_mesh_extended_yes").hide();
    //     // $("#field_mesh_extended_yes").prop('checked', false);
    //     // $("#field_mesh_extended_no").prop('checked', false);
    //     clear_child_value("flag_mesh_extended");
    //     clear_child_value("flag_mesh_extended_yes");
    // }
};
function show_mesh_extended_detail() {
    let val = $("#field_mesh_extended").val();
    if (val == "Yes") {
        $("#flag_mesh_extended_yes").show();
    } else {
        $("#flag_mesh_extended_yes").hide();
        clear_child_value("flag_mesh_extended_yes");
    }

};
$("#field_mesh_extended").change(function(){
    show_mesh_extended_detail();
    show_extender_update_method();
});

$("#field_separate_license").change(function(){
    show_extender_update_method();
});
$("#field_auto_ota").change(function(){
    show_extender_update_method();
});
$("#field_extender_update_method").change(function(){
    show_extender_update_method();
});
function show_extender_update_method() {
    if (document.formxl.field_extender_update_method.value == "OTA") {
        $("#flag_extender_ota").show();
    } else {
        $("#flag_extender_ota").hide();
        clear_child_value("flag_extender_ota");
    };
    show_extended_ota();
};
function show_extended_ota(){
    let elem_d = $("#field_separate_license");
    let elem_c = $("#field_auto_ota");
    let elem_root_update_method = $("#field_root_update_method");

    if (elem_d.val() == "No" || (elem_d.val() == "" && elem_root_update_method.val() != "OTA" && elem_root_update_method.val() != "")) {
        $("#flag_extender_separate_license").show();
    } else {
        $("#flag_extender_separate_license").hide();
        clear_child_value("flag_extender_separate_license");
    };
    if (elem_c.val() == "No" || (elem_c.val() == "" && elem_root_update_method.val() != "OTA" && elem_root_update_method.val() != "")) {
        $("#flag_extender_auto_ota").show();
        show_extended_ota_yes();
    } else {
        $("#flag_extender_auto_ota").hide();
        clear_child_value("flag_extender_auto_ota");
    };
};
function show_extended_ota_yes() {
    let val = $("#field_extender_auto_ota").val();
    if (val == "Yes") {
        $("#flag_extender_auto_ota_yes").show();
    } else {
        $("#flag_extender_auto_ota_yes").hide();
        clear_child_value("flag_extender_auto_ota_yes");
    };
};
$("#field_extender_auto_ota").change(function(){
    show_extended_ota_yes();
});

function flag_managed_by_hc_show_hide(base, target) {
    let val = document.formxl.field_managed_by_hc.value;
    if (val == "Yes") {
        $("#flag_managed_by_hc").show();
    } else {
        $("#flag_managed_by_hc").hide();
        clear_child_value("flag_managed_by_hc");
    };
}

