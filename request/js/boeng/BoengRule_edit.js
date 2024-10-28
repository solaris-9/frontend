/* for BoengRule_edit.html */


function show_div(){ 	         
    hide_whitelisting_elements();
    hide_boeng_option_elements();
    hide_auto_ota();
} 

var flag = 0;
var b_id = decode_bid(location.search);


//alert(b_id)
function decode_bid(ss) {
    var id = decodeURI(ss).split('=')[1];
    return id
}

var device_elems = [
    document.formxl.device,
];
for (let r=1; r<=10; r++) {
    let elem = 'root_beacon_model' + r;
    device_elems.push(
        document.formxl[elem]
    );
};

window.onload = initialize_page();

function initialize_page() {
    //document.body.style.cursor='wait';

    show_div();
    fetch_customer(document.formxl.Customer);
    fetch_device(device_elems, 'beacon');
    fetch_nwcc_saas();
    fetch_opid();
    if (b_id.length > 0) {
        fetch_boengrule_info();
    }
    $("#preloader").hide();
    $("#mainpart").show();

    //document.body.style.cursor='default';
}
function fetch_boengrule_info() {
    $.getJSON("../gpi/allocate/boeng_list",{
        "B_ID": b_id, 
        'type': 'single', 
        level: $.cookie(cookie_level), 
        mail: $.cookie(cookie_mail)}, function (data) {
        //$("#Customer").prop('value', data.data.items[0].Customer)
        //$("#device").prop('value', data.data.items[0].device);
        let customer = data.data.items[0].Customer;
        document.formxl.Customer.value = customer;
        const l_device = String(data.data.items[0].device);
        document.formxl.device.value = l_device;
        // console.log('l_device=',l_device,'l_device.length=',l_device.length)
        // $("#device").val(l_device);

        render_nwcc(customer, document.formxl.tenant_ref);            
        $("#OPID").prop('value', data.data.items[0].OPID);
        $("#whitelistmethod").prop('value', data.data.items[0].whitelistmethod);
        if (data.data.items[0].country_id) {
            $("#country_id").hide();
        } else {
            $("#country_id").show();
        }
        $("#countryid").prop('value', data.data.items[0].countryid)
        if (data.data.items[0].ip_range) {
            $("#ip_range").hide();
        }  else {
            $("#ip_range").show();
        }
        $("#iprange").prop('value', data.data.items[0].iprange)
        if (data.data.items[0].serial_number) {
            $("#serial_number").hide();
        } else {
            $("#serial_number").show();
        }
        $("#customer_name").prop('value', data.data.items[0].customer_name)
        //$("#csv_file").prop('value', data.data.items[0].csv_file)
        global_csv_file = data.data.items[0].csv_file;
        var html = '<p><a href="../gpi/allocate/download?file=' +
            global_csv_file + '">' + global_csv_file + '</a></p>';
        if (data.data.items[0].csv_file.length > 0) {
            $("#csv_url").html(html);
        };
        if (data.data.items[0].tr069) {
            $("#tr069").prop('checked', true);
        }
        if (data.data.items[0].home_controller) {
            $("#home_controller").prop('checked', true);
        }
        if (data.data.items[0].rd_party_controller) {
            $("#rd_party_controller").prop('checked', true);
        }
        if (data.data.items[0].tr069_acs) {
            $("#tr069_acs").hide();
        } else {
            $("#tr069_acs").show();
        }
        $("#acs_url").prop('value', data.data.items[0].acs_url);
        $("#acs_username").prop('value', data.data.items[0].acs_username);
        $("#acs_password").prop('value', data.data.items[0].acs_password);
        if (data.data.items[0].home_controller_usp) {
            $("#home_controller_usp").hide();
        } else {
            $("#home_controller_usp").show();
        }
        $("#tenant_ref").prop('value', data.data.items[0].tenant_ref);
        if (data.data.items[0].rd_party_usp) {
            $("#rd_party_usp").hide();
        } else {
            $("#rd_party_usp").show();
        }
        $("#usp_addr").prop('value', data.data.items[0].usp_addr);
        $("#usp_port").prop('value', data.data.items[0].usp_port);
        if (data.data.items[0].auto_upgrade) {
            $("#auto_upgrade_1").prop('checked', true);
        } else {
            $("#auto_upgrade_2").prop('checked', true);
        }
        if (data.data.items[0].ota_yes_1) {
            $("#ota_yes_1").hide();
        } else {
            $("#ota_yes_1").show();
        }
        if (data.data.items[0].separate_license) {
            $("#separate_license").prop('value', 'Yes');
        } else {
            $("#separate_license").prop('value', 'No');
        }
        if (data.data.items[0].ota_yes_2) {
            $("#ota_yes_2").hide();
        } else {
            $("#ota_yes_2").show();
        }
        if (data.data.items[0].used_as_extender) {
            $("#used_as_extender_y").prop('checked', true);
        } else {
            $("#used_as_extender_n").prop('checked', true);
        }
        root_beacon_flags = data.data.items[0].root_beacon_flags.split('###')
        root_beacon_model = data.data.items[0].root_beacon_model.split('###')

        for (let i = 0; i < root_beacon_flags.length; i++) {
            if (root_beacon_flags[i] == '0') {
                let item_flag = "#root_beacon_" + (i+1)
                let item_value = "#root_beacon_model" + (i+1)
                $(item_flag).show();
                $(item_value).prop('value', root_beacon_model[i]);


                if (i == (root_beacon_flags.length - 1)) {
                    $("#add_beacon").attr('disabled', 'disabled');
                }
            };
        }

        $("#additional").prop('value', data.data.items[0].additional);
    });
}
 


function fetch_opid(){
    $.ajaxSetup({
        async: false
    });       
    $.getJSON("../gpi/allocate/opid_list", {"type": "4"}, function (data) {
        for(let i=0; i<data.data.items.length; i++){
            document.formxl.OPID.options[document.formxl.OPID.length]=new Option(
                data.data.items[i]['OPID'].trim()
            );
        };  
    });
    $.ajaxSetup({
        async: true
    });
}

$("#csv_file").change(function(e){
    //alert("CSV file");
    upload();
});

function upload() {
    var csv=$("#csv_file")[0].files[0];
    if (csv.name.length <= 0) {
        return;
    }
    var data = new FormData();
    data.append('file', csv);
    global_csv_file = csv.name;
    var html = '<p><a href="../gpi/allocate/download?file=' +
        global_csv_file + '">' + global_csv_file + '</a></p>';

    $.ajax({
        url: "../gpi/allocate/csv_upload",
        type: "POST",
        data: data,
        contentType: false,
        cache: false,
        processData: false,
        success: function(msg) {
            $("#csv_url").html(html);
            $("#csv_file_label").text(global_csv_file + " uploaded OK.");
        }
    });

};

function pre_validation() {
    // make sure all input are not empty and valid
    // const alert_html = '<font color="#FF0000" size="4">*</font>';
    // const pass_html = '';
    var count = 0;
    // if (document.formxl.Customer.value.trim().length <= 0) {
    //     $("#error_Customer").show();
    //     count++;
    // } else {
    //     $("#error_Customer").hide();
    // };

    [
        'Customer',
        'device',
        'OPID',
        'whitelistmethod'
    ].forEach(elem => {
        count += check_empty(elem);
    });
    
    // if (document.formxl.device.value.trim().length <= 0) {
    //     $("#error_device").show();
    //     count++;
    // } else {
    //     $("#error_device").hide();
    // };
    // if (document.formxl.OPID.value.trim().length <= 0) {
    //     $("#error_OPID").show();
    //     count++;
    // } else {
    //     $("#error_OPID").hide();
    // };
    // if (document.formxl.whitelistmethod.value.trim().length <= 0) {
    //     $("#error_whitelistmethod").show();
    //     count++;
    // } else {
    //     $("#error_whitelistmethod").hide();
    // };

    if (!($("#country_id").is(':hidden'))) {
        count += check_empty('countryid');
    };

    if (!($("#ip_range").is(':hidden'))) {
        count += check_empty('iprange');
    };

    if (!($("#serial_number").is(':hidden'))) {
        // if (!(document.formxl.customer_name.value.trim().length > 0 || 
        //     document.formxl.csv_file.value.trim().length > 0 ||
        //     global_csv_file.trim().length > 0
        // let customer_id = document.formxl.customer_name.value;
        // if (customer_id.length <= 0 ) {
        //     //$("#error_customer_name").show();
        //     $("#customer_name").css({"border": "2px dashed red"});
        //     count++;
        // } else {
        //     if (!(/^10\d{8}$/.test(customer_id))) {
        //         //$("#error_customer_name").show();
        //         $("#customer_name").css({"border": "2px dashed red"});
        //         count++;
        //     } else {
        //         //$("#error_customer_name").hide();
        //         $("#customer_name").css({"border": ""});
        //     };
        // };
        count += check_pattern('customer_name', /^10\d{8}$/);
    };

    if (!($("#tr069").is(':checked') || $("#home_controller").is(':checked') || $("#rd_party_controller").is(':checked'))) {
        $("#error_boeng_option").show();
        count++;
    } else {
        $("#error_boeng_option").hide();
    };

    if (!($("#tr069_acs").is(':hidden'))) {
        ['acs_url','acs_username','acs_password'].forEach(elem => {
            count += check_empty(elem);
        });
    };

    if (!($("#home_controller_usp").is(':hidden'))) {
        count += check_empty('tenant_ref');
    };

    if (!($("#rd_party_usp").is(':hidden'))) {
        ['usp_addr','usp_port'].forEach(elem => {
            count += check_empty(elem);
        });
    };

    if (!($("#auto_upgrade_1").is(':checked') || $("#auto_upgrade_2").is(':checked'))) {
        $("#error_OTA").show();
        count++;
    } else {
        $("#error_OTA").hide();
    };

    if (!($("#ota_yes_1").is(':hidden'))) {
        count += check_empty('separate_license');
    };

    if (!($("#ota_yes_2").is(':hidden'))) {
        if (!($("#used_as_extender_y").is(':checked') || $("#used_as_extender_n").is(':checked'))) {
            $("#error_extender").show();
            count++;
        } else {
            $("#error_extender").hide();
        };

        if ($("#used_as_extender_y").is(':checked')) {
            for (let i=1; i<=10; i++) {
                let flag_div = "#root_beacon_" + i;
                let value_div = "root_beacon_model" + i;
                let error_div = "#error_root_beacon_model" + i;
                //console.log(flag_div + ", is.hidden = " + $(flag_div).is(":hidden"));
                if (!($(flag_div).is(":hidden"))) {
                    count += check_empty(value_div);
                };
            };
        };
    };

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
    removeOptions(document.formxl.Customer);
    render_customer();
    $('#Customer').val(customer);
    $('#customerModal').modal('toggle');
};

function customer_pre_validation() {
    let count = 0;
    var cform = $("#customerForm")[0];
    let customer = cform.new_customer_name.value.trim();
    if (customer.length <= 0) {
        $("#error_new_customer_name").text('Customer name is required.');
        $("#error_new_customer_name").show();
        count++;
    } else {
        if (global_customers.has(customer)) {
            $("#error_new_customer_name").text('Customer name "' + customer + '" already added!');
            $("#error_new_customer_name").show();
            count++;
        } else {
            $("#error_new_customer_name").text('');
            $("#error_new_customer_name").hide();
        };
    };
    if (cform.new_customer_desc.value.trim().length <= 0) {
        $("#error_new_customer_desc").show();
        count++;
    } else {
        $("#error_new_customer_desc").hide();
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

function save() {
    let res = pre_validation();
    if (!res) {
        return;
    };
    $("#btn_submit").html('<i class="fa fa-spinner fa-pulse"></i>Submit');
    mail = $.cookie(cookie_mail);
    const url = '../gpi/allocate/boeng_edit';
    const root_beacon_model = [
        document.formxl.root_beacon_model1.value,
        document.formxl.root_beacon_model2.value,
        document.formxl.root_beacon_model3.value,
        document.formxl.root_beacon_model4.value,
        document.formxl.root_beacon_model5.value,
        document.formxl.root_beacon_model6.value,
        document.formxl.root_beacon_model7.value,
        document.formxl.root_beacon_model8.value,
        document.formxl.root_beacon_model9.value,
        document.formxl.root_beacon_model10.value,
    ];
    const root_beacon_flags = [
        ($("#root_beacon_1").is(':hidden'))?'1':'0',
        ($("#root_beacon_2").is(':hidden'))?'1':'0',
        ($("#root_beacon_3").is(':hidden'))?'1':'0',
        ($("#root_beacon_4").is(':hidden'))?'1':'0',
        ($("#root_beacon_5").is(':hidden'))?'1':'0',
        ($("#root_beacon_6").is(':hidden'))?'1':'0',
        ($("#root_beacon_7").is(':hidden'))?'1':'0',
        ($("#root_beacon_8").is(':hidden'))?'1':'0',
        ($("#root_beacon_9").is(':hidden'))?'1':'0',
        ($("#root_beacon_10").is(':hidden'))?'1':'0',
    ];
    
    // let csv_file = "";
    // if ($("#csv_file").length > 0) {
    //     csv_file = $("#csv_file")[0].files[0].name;
    // };
    var data = {
        mail: mail,
        Customer: document.formxl.Customer.value,
        device: document.formxl.device.value,
        OPID: document.formxl.OPID.value,
        whitelistmethod: document.formxl.whitelistmethod.value,
        country_id: $("#country_id").is(':hidden'),
        countryid: document.formxl.countryid.value,
        ip_range: $("#ip_range").is(':hidden'),
        iprange: document.formxl.iprange.value,
        serial_number: $("#serial_number").is(':hidden'),
        customer_name: document.formxl.customer_name.value,
        csv_file: global_csv_file,
        tr069: $("#tr069").is(':checked'),
        home_controller: $("#home_controller").is(':checked'),
        rd_party_controller: $("#rd_party_controller").is(':checked'),
        tr069_acs: $("#tr069_acs").is(':hidden'),
        acs_url: document.formxl.acs_url.value,
        acs_username: document.formxl.acs_username.value,
        acs_password: document.formxl.acs_password.value,
        home_controller_usp: $("#home_controller_usp").is(':hidden'),
        tenant_ref: document.formxl.tenant_ref.value,
        rd_party_usp: $("#rd_party_usp").is(':hidden'),
        usp_addr: document.formxl.usp_addr.value,
        usp_port: document.formxl.usp_port.value,
        auto_upgrade: $("#auto_upgrade_1").is(':checked'),
        ota_yes_1: $("#ota_yes_1").is(':hidden'),
        separate_license: (document.formxl.separate_license.value == "Yes")? true:false,
        ota_yes_2: $("#ota_yes_2").is(':hidden'),
        used_as_extender: $("#used_as_extender_y").is(':checked'),
        root_beacon_flags: root_beacon_flags.join('###'),
        root_beacon_model: root_beacon_model.join('###'),
        ota_yes_4: $("#ota_yes_4").is(':hidden'),
        additional: document.formxl.additional.value
    };

    var action = ''
    if (b_id.length > 0) {
        // Edit mode
        data.type = 'edit';
        data.B_ID = b_id;
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

// $(function () { $("[data-toggle='popover']").popover(); });

// function removeOptions(elem) {
//     for (let i=elem.options.length-1; i>0; i--) {
//         elem.remove(i);
//     }
// };

// function render_customer() {
//     let customers = Array.from(global_customers.keys()).sort();
//     for (let i=0; i<customers.length; i++) {
//         if (customers[i] != "") {
//             document.formxl.Customer.options[document.formxl.Customer.length]=new Option(
//                 customers[i]
//             );
//         };
//     };
// };

$("#Customer").change(function(){    
    var customer = ($("#Customer").val());

    //removeOptions(document.formxl.tenant_ref);
    render_nwcc(customer, document.formxl.tenant_ref);
});


$("#whitelistmethod").change(function(){    
    var list_method = ($("#whitelistmethod").val());
    switch(list_method) {
        case "":
            hide_whitelisting_elements("");
            break;
        case "Dedicated OPID":
            hide_whitelisting_elements("");
            break;
        // case "Country ID":
        //     hide_whitelisting_elements("country_id");
        //     $("#country_id").show();
        //     break;
        case "IP based":
            hide_whitelisting_elements("ip_range");
            $("#ip_range").show();
            break;
        case "Serial number":
            hide_whitelisting_elements("serial_number");
            $("#serial_number").show();
            break;
    }

});

$("#tr069").change(function(){    
    if(this.checked) {
        $("#tr069_acs").show();
    } else {
        $("acs_url").val(null);
        // $("acs_url").prop("value", " ");
        // $("acs_url").val('xyz');
        document.formxl.acs_url.value = "";
        document.formxl.acs_username.value = "";
        document.formxl.acs_password.value = "";
        $("acs_username").val('');
        $("acs_password").val('');
        $("#tr069_acs").hide();
    }
})
$("#home_controller").change(function(){    
    if(this.checked) {
        $("#home_controller_usp").show();
        if ($("#auto_upgrade_1").is(':checked')) {
            $("#ota_yes_1").hide();
            document.formxl.separate_license.value = "";
            $("#separate_license").prop("value", "");
        }
    } else {
        $("#home_controller_usp").hide();
        document.formxl.tenant_ref.value = "";
        $("#tenant_ref").prop("value", "");
        if ($("#auto_upgrade_1").is(':checked')) {
            $("#ota_yes_1").show();
        }
    }
})
$("#rd_party_controller").change(function(){    
    if(this.checked) {
        $("#rd_party_usp").show();
    } else {
        $("#rd_party_usp").hide();
        document.formxl.usp_addr.value = "";
        document.formxl.usp_port.value = "";
        $("#usp_addr").prop("value", "");
        $("#usp_port").prop("value", "");
    }
})
$(".otaradio").change(function(){
    //alert($("#home_controller").is(':checked'));
    if(this.id == "auto_upgrade_1") {
        if (!($("#home_controller").is(':checked'))) {
            $("#ota_yes_1").show();
        }
        $("#ota_yes_2").show();
    } else {
        $("#ota_yes_1").hide();
        $("#ota_yes_2").hide();
        document.formxl.separate_license.value = "";
        $("#used_as_extender_y").prop('checked', false);
        $("#used_as_extender_n").prop('checked', false);
        clear_all_root_beacon_models();
    }
});
function clear_all_root_beacon_models() {
    for (let i=1; i<=10; i++) {
        let item_value = "root_beacon_model" + i;
        let item_flag = "#root_beacon_" + i;
        document.formxl[item_value].value = "";
        $(item_value).prop("value", "");
        $(item_flag).hide();
    }
    $("#add_beacon").attr('disabled', false);
};
$(".extenderradio").change(function(){
    //alert($("#home_controller").is(':checked'));
    if(this.id == "used_as_extender_y") {
        $("#root_beacon_1").show();
    } else {
        // $("#root_beacon_1").hide();
        // document.formxl.root_beacon_model1.value = "";
        clear_all_root_beacon_models();
    }
});

function hide_whitelisting_elements(elem) {
    //$("#country_id").hide();
    $("#ip_range").hide();
    $("#serial_number").hide();
    switch (elem) {
        case "":
            //document.formxl.countryid.value = "";
            document.formxl.iprange.value = "";
            document.formxl.customer_name.value = "";
            //$("#countryid").prop("value", "");
            $("#iprange").prop("value", "");
            $("#customer_name").prop("value", "");
            break;
        // case "country_id":
        //     document.formxl.iprange.value = "";
        //     document.formxl.customer_name.value = "";
        //     $("#iprange").prop("value", "");
        //     $("#customer_name").prop("value", "");
        //     break;
        case "ip_range":
            //document.formxl.countryid.value = "";
            document.formxl.customer_name.value = "";
            //$("#countryid").prop("value", "");
            $("#customer_name").prop("value", "");
            break;
        case "serial_number":
            //document.formxl.countryid.value = "";
            document.formxl.iprange.value = "";
            //$("#countryid").prop("value", "");
            $("#iprange").prop("value", "");
            break;
    }
}

function hide_boeng_option_elements() {
    $("#tr069_acs").hide();
    $("#home_controller_usp").hide();
    $("#rd_party_usp").hide();
}

function hide_auto_ota() {
    $("#ota_yes_1").hide();
    $("#ota_yes_2").hide();
    for (let i=1; i<=10; i++) {
        let elem = "#root_beacon_" + i;
        $(elem).hide();
    }
}

function add_root_beacon() {
    if ($("#root_beacon_2").is(":hidden")) {
        $("#root_beacon_2").show();
    } else if ($("#root_beacon_3").is(":hidden")) {
        $("#root_beacon_3").show();
    } else if ($("#root_beacon_4").is(":hidden")) {
        $("#root_beacon_4").show();
    } else if ($("#root_beacon_5").is(":hidden")) {
        $("#root_beacon_5").show();
    } else if ($("#root_beacon_6").is(":hidden")) {
        $("#root_beacon_6").show();
    } else if ($("#root_beacon_7").is(":hidden")) {
        $("#root_beacon_7").show();
    } else if ($("#root_beacon_8").is(":hidden")) {
        $("#root_beacon_8").show();
    } else if ($("#root_beacon_9").is(":hidden")) {
        $("#root_beacon_9").show();
    } else if ($("#root_beacon_10").is(":hidden")) {
        $("#root_beacon_10").show();
        $("#add_beacon").attr('disabled', 'disabled');
    }
}

function delete_root_beceacon(id) {
    let iid = parseInt(id.replace('delete_model', ''));
    for (let i=iid; i<=10; i++) {
        let item_value = "root_beacon_model" + i;
        let item_value_next = "root_beacon_model" + (i+1);
        let item_flag = "#root_beacon_" + i;
        let item_flag_next = "#root_beacon_" + (i+1);
        if (((i+1) > 10) || $(item_flag_next).is(":hidden")) {
            document.formxl[item_value].value = "";
            $(item_value).prop("value", "");
            $(item_flag).hide();
            break;
        } else {
            document.formxl[item_value].value = document.formxl[item_value_next].value;
            $(item_value).prop("value", document.formxl[item_value_next].value);
        }
        
    }
};

// $("#csv_file").fileupload({
//     add: function(e, data) {
//         alert(data.files[0].name);
//         var jqXHR = data.submit();
//     }
// });

// $("[rel=drevil]").popover({
//     trigger:'manual',
//     html: 'true', 
//     animation: false
// }).on("mouseenter", function () {
//     var _this = this;
//     $(this).popover("show");
//     $(this).siblings(".popover").on("mouseleave", function () {
//         $(_this).popover('hide');
//     });
// }).on("mouseleave", function () {
//     var _this = this;
//     setTimeout(function () {
//         if (!$(".popover:hover").length) {
//             $(_this).popover("hide")
//         }
//     }, );
// });