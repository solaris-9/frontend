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
            let customer = data.data.items[i]['Customer'].trim();
            global_customers.set(
                customer,
                customer
            );
        };
        render_customer(elem);
    });
    $.ajaxSetup({
        async: true
    });       
};
function render_customer(elem) {
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
function fetch_device(elem, type){
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
        render_device(elem);  	
    });
    $.ajaxSetup({
        async: true
    });       
};
function render_device(elem) {
    clear_options(elem);
    let devices = Array.from(global_device.keys()).sort();
    for (let i=0; i<devices.length; i++) {
        if (devices[i] != "") {
            elem.options[elem.length]=new Option(
                devices[i]
            );
        };
    };

};


