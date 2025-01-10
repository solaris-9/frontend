/*!
 * Common Functions & Global Variables -- v0.1
 * by @Dongxu
 * 
 */


function get_ts() {
    let d = new Date();
    let ret = d.getFullYear() + '-' +
        (d.getMonth() + 1).toString().padStart(2, '0') + '-' +
        d.getDate().toString().padStart(2, '0') + ' ' +
        d.getHours().toString().padStart(2, '0') + ':' +
        d.getMinutes().toString().padStart(2, '0') + ':' +
        d.getSeconds().toString().padStart(2, '0')

    return ret
}

var grade_fields = [
    "Grade",
    "Add",
    "Edit",
    "Delete",
    "Search",
    "View",
    "Download",
    "Export"
];

var cookie_name = "username";
var cookie_auth = "encodedAuth";
var cookie_pw = "password";
var cookie_mail = "mail";
var cookie_level = "level";
var cookie_grade = "grade";

function clear_options(elem) {
    for (let i=elem.options.length-1; i>0; i--) {
        elem.remove(i);
    }
};

var global_customers = new Map();
function fetch_customer(elem){
    $.ajaxSetup({
        async: false
    });       
    $.getJSON("../gpi/allocate/customer_list", {"type": "all"}, function (data) {
        for(var i = 0; i < data.data.items.length; i++){ 
            let customer = data.data.items[i]['customer'].trim();
            let key = data.data.items[i]['key'].trim();
            let cid = data.data.items[i]['cid'].trim();
            global_customers.set(
                customer,
                {
                    key: key,
                    cid: cid
                }
            );
        };
        render_customer(elem);
    });
    $.ajaxSetup({
        async: true
    });       
};
function render_customer(elem) {
    if(!elem) {
        return;
    };
    let customers = Array.from(global_customers.keys()).sort();
    for (let i=0; i<customers.length; i++) {
        if (customers[i] != "") {
            elem.options[elem.length]=new Option(
                customers[i]
            );
        };
    };
};


var global_device = new Map();
function fetch_device(elems, type){
    mail = $.cookie(cookie_mail)
    $.ajaxSetup({
        async: false
    });       
    $.getJSON("../gpi/allocate/device_list", {"type": type},function(data){      	
        for(var i = 0; i < data.data.items.length; i++){  
            let product = data.data.items[i]['Product'].trim();
            let code = data.data.items[i]['Code'].trim();
            let bizline = data.data.items[i]['Bizline'].trim();
            if (global_device.has(product)) {
                if (!global_device.get(product).Code.includes(code)) {
                    global_device.get(product).Code.push(code);
                };
            } else {
                global_device.set(
                    product,
                    {
                        Product: product,
                        Code: [code],
                        Bizline: bizline
                    }
                );
            }
        };
        render_device(elems);  	
    });
    $.ajaxSetup({
        async: true
    });       
};
function render_device(elems) {
    let devices = Array.from(global_device.keys()).sort();
    elems.forEach(elem => {
        clear_options(elem);
        for (let i=0; i<devices.length; i++) {
            if (devices[i] != "") {
                elem.options[elem.length]=new Option(
                    devices[i]
                );
            };
        };            
    });
};
function render_beacon(elems) {
    let devices = Array.from(global_device.keys()).sort();
    elems.forEach(elem => {
        clear_options(elem);
        devices.forEach(device => {
            if (device.startsWith('Beacon')) {
                elem.options[elem.length]=new Option(
                    device
                );
            };
        });       
    });
};

var global_country = new Map();
function fetch_country(elem){
    mail = $.cookie(cookie_mail)
    $.ajaxSetup({
        async: false
    });       
    $.getJSON("../gpi/allocate/country_list", {"type": 'all'},function(data){      	
        for(var i = 0; i < data.data.items.length; i++){  
            const country = data.data.items[i]['country'].trim();
            const iso = data.data.items[i]['iso'].trim();
            global_country.set(
                country,
                {
                    country: country,
                    iso: iso
                }
            );

        };
        render_country(elem);  	
    });
    $.ajaxSetup({
        async: true
    });       
};
function render_country(elem) {
    const countries = Array.from(global_country.keys()).sort();
    clear_options(elem);
    for (let i=0; i<countries.length; i++) {
        if (countries[i] != "") {
            elem.options[elem.length]=new Option(
                countries[i]
            );
        };
    };            
};

var global_hosting_platform = new Map();
function fetch_hosting_platform(){
    mail = $.cookie(cookie_mail)
    $.ajaxSetup({
        async: false
    });       
    $.getJSON("../gpi/allocate/hosting_list", {"type": 'all'},function(data){      	
        for(var i = 0; i < data.data.items.length; i++){  
            const cloud = data.data.items[i]['cloud'].trim();
            const region = data.data.items[i]['region'].trim();
            
            if (global_hosting_platform.has(cloud)) {
                if (!global_hosting_platform.get(cloud).region.includes(region)) {
                    global_hosting_platform.get(cloud).region.push(region);
                };
            } else {
                global_hosting_platform.set(
                    cloud,
                    {
                        cloud: cloud,
                        region: [region]
                    }
                );
            }

        };
        //render_country(elem);  	
    });
    $.ajaxSetup({
        async: true
    });       
};
function render_region(cloud, elem) {
    clear_options(elem);
    if (global_hosting_platform.has(cloud)) {
        for (let i=0; i<global_hosting_platform.get(cloud).region.length; i++) {
            const val = global_hosting_platform.get(cloud).region[i];
            if (val != "") {
                elem.options[elem.length]=new Option(val);
            };
        };
    }
};

var global_nwcc_saas = new Map();
// function fetch_nwcc_saas(){
//     $.ajaxSetup({
//         async: false
//     });       
//     $.getJSON("../gpi/allocate/nwcc_list", {"type": "4"}, function (data) {
//         for(let i=0; i<data.data.items.length; i++){
//              let Customer = data.data.items[i]['Customer'];
//              let Platform = data.data.items[i]['Platform'];
//              let tenant_id = data.data.items[i]['TenantID'];
//              let hdm = data.data.items[i]['HDM'];
//              let item = Platform + "/" + tenant_id + ":" + hdm
//              if (global_nwcc_saas.has(Customer)) {
//                 if (!global_nwcc_saas.get(Customer).Platform.includes(item)) {
//                     global_nwcc_saas.get(Customer).Platform.push(item)
//                 }
//              } else {
//                 global_nwcc_saas.set(Customer,{
//                     Platform: [item]
//                 });
//              }
//         };  
//     });
//     $.ajaxSetup({
//         async: true
//     });
// };
function fetch_nwcc_saas(){
    $.ajaxSetup({
        async: false
    });       
    $.getJSON("../gpi/allocate/nwcc_list", {"type": "4"}, function (data) {
        for(let i=0; i<data.data.items.length; i++){
             let Customer = data.data.items[i]['field_customer'];
             let ID = data.data.items[i]['ID'];
             let Status = data.data.items[i]['field_status'];

             if (['Rejected', 'Closed'].includes(Status)) {
                continue;
             }
             //let item = Platform + "/" + tenant_id + ":" + hdm
             if (global_nwcc_saas.has(Customer)) {
                if (!global_nwcc_saas.get(Customer).ID.includes(ID)) {
                    global_nwcc_saas.get(Customer).ID.push(ID)
                }
             } else {
                global_nwcc_saas.set(Customer,{
                    ID: [ID]
                });
             }
        };  
    });
    $.ajaxSetup({
        async: true
    });
};
var global_customer_contacts = new Map();
function fetch_customer_contacts() {
    $.ajaxSetup({
        async: false
    });       
    $.getJSON("../gpi/allocate/jira_customer_list", {mail: $.cookie(cookie_mail), level: $.cookie(cookie_level), type: "all"}, function (data) {
        for(let i=0; i<data.data.items.length; i++){
            let customer = data.data.items[i]['field_customer_name'];
            let cplm = data.data.items[i]['field_nwf_plm'];
            let local_contact = data.data.items[i]['field_local_contact'];

            global_customer_contacts.set(customer,{
                cplm: cplm,
                local_contact: local_contact
            });
        };  
    });
    $.ajaxSetup({
        async: true
    });
};

// function render_nwcc(cus, elem) {
//     clear_options(elem);
//     if (global_nwcc_saas.has(cus)) {
//         for (let i=0; i<global_nwcc_saas.get(cus).Platform.length; i++) {
//             let val = global_nwcc_saas.get(cus).Platform[i];
//             if (val != "") {
//                 elem.options[elem.length]=new Option(val.split(':')[0]);
//             };
//         };
//     }  else {
//         // if (elem.id == "field_home_controller") {
//         //     $("#error_home_controller").show();
//         //     show_elements_for_home_controller(false);
//         // };
//     };
// };
function render_nwcc(cus, elem) {
    clear_options(elem);
    if (global_nwcc_saas.has(cus)) {
        for (let i=0; i<global_nwcc_saas.get(cus).ID.length; i++) {
            let val = global_nwcc_saas.get(cus).ID[i];
            if (val != "") {
                elem.options[elem.length]=new Option(val);
            };
        };
    }  else {
        // if (elem.id == "field_home_controller") {
        //     $("#error_home_controller").show();
        //     show_elements_for_home_controller(false);
        // };
    };
};
function check_pattern(elem, pattern) {
    let val = document.formxl[elem].value;
    count = 0;
    if (val.length <= 0 ) {
        $("#"+elem).css({"border": "2px dashed red"});
        //$("#error_"+elem).show();
        count++;
    } else {
        if (!(pattern.test(val))) {
            //$("#error_"+elem).show();
            $("#"+elem).css({"border": "2px dashed red"});
            count++;
        } else {
            //$("#error_"+elem).hide();
            $("#"+elem).css({"border": ""});
        };
    };
    return count;
};

function check_empty(elem) {
    let val = document.formxl[elem].value;
    count = 0;
    if (val.length <= 0 ) {
        $("#"+elem).css({"border": "2px dashed red"});
        //$("#error_"+elem).show();
        count++;
    } else {
        //$("#error_"+elem).hide();
        $("#"+elem).css({"border": ""});
    };
    return count;
};


function show_hide_by_value(base, base_value, target) {
    let val = document.formxl[base].value;
    if (val == base_value) {
        $("#"+target).show();
    } else {
        $("#"+target).hide();
    };
};

function get_device_bl(device) {
    if (global_device.has(device)) {
        return global_device.get(device).Bizline;
    } else {
        return "";
    };
};

function remove_option(elem, value) {
    let tmp = [];
    for (let i = 0; i < elem.options.length; i++) {
        let opt = elem.options[i].value;
        if (opt != value && opt != "") {
            tmp.push(opt);
        };
    };
    clear_options(elem);
    tmp.forEach(val => {
        elem.options[elem.length]=new Option(val);
    });

};

function clear_child_value(parent) {
    $("#"+parent).find(".form-select").each(function(){
        $(this).prop("value", "");
    });
    $("#"+parent).find(".form-control").each(function(){
        $(this).prop("value", "");
    });
    $("#"+parent).find(".form-check-input").each(function(){
        $(this).prop('checked', false);
    });
};

var global_url_param = new URLSearchParams(location.search)
function decode_id(ss) {
    var id = decodeURI(ss).split('=')[1];
    return id
};

function get_key_by_val(obj, val) {
    return Object.keys(obj).find(key => obj[key] === val);
};

$(document).ready(function () {
    // Initialize popovers with manual trigger
    $('[data-bs-toggle="popover"]').each(function () {
        const $elem = $(this);
        const popover = new bootstrap.Popover($elem[0], {
            trigger: 'manual',
            html: true
        });

        // Hover behavior for popovers
        $elem.on("mouseenter", function () {
            $elem.popover("show");
            const $popover = $(".popover");
            
            $popover.on("mouseleave", function () {
                $elem.popover("hide");
            });
        });

        $elem.on("mouseleave", function () {
            setTimeout(function () {
                if (!$(".popover:hover").length) {
                    $elem.popover("hide");
                }
            }, 200); // Small delay for better UX
        });
    });
});

function fetch_role(elem){
    $.ajaxSetup({
        async: false
    });       
    $.getJSON("gpi/user/role_list", {type: "all"}, function (data) {
        for(var i = 0; i < data.data.items.length; i++){ 
            let grade = data.data.items[i]['Grade'].trim();
            elem.options[elem.length]=new Option(grade);
        };
    });
    $.ajaxSetup({
        async: true
    });       
};