function show_hide(){ 	         
}

//var global_id = decode_id(location.search);
var global_id = global_url_param.get('ID');

function decode_fields() {
    if (location.search.length > 0) {
        for ([key, attr] of Object.entries(platform_fields)) {
            $("#"+key).val(global_url_param.get(key));
        };
    }
}

console.log("location.search.length = ", location.search.length)

var platform_fields = {
    field_platform: {type: 'text', flag: false},
    field_type: {type: 'list', flag: false},
    field_customer_trials: {type: 'list', flag: false},
    field_public_cloud: {type: 'list', flag: false},
    field_cloud_sw: {type: 'text', flag: false},
    field_region: {type: 'text', flag: false},
};

window.onload = initialize_page();

function initialize_page() {
    decode_fields();
    $("#preloader").hide();
    $("#mainpart").show();
    show_hide();
}

function pre_validation() {
    // make sure all input are not empty and valid
    var count = 0;
    
    // TODO
    //Traverse all visisble elements
    $("form[name='formxl']").find(":input:visible").each(function() {
        let id = this.id;
        let $elem = $(this);
        if (id.startsWith('field_')) {
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
        return false;
    };
    $("#btn_submit").html('<i class="fa fa-spinner fa-pulse"></i>Submit');
    mail = $.cookie(cookie_mail);
    const url = '../gpi/platform/edit';
    
    var data = {
        mail: mail
    };

    for ([key, attr] of Object.entries(platform_fields)) {
        data[key] = document.formxl[key].value;
    };


    var action = ''
    if (location.search.length > 0) {
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
    let l_method = "POST"
    if (location.search.length > 0) {
        l_method = "PUT"
    }
    const response = await fetch(url, {
        method: l_method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });            
    const result = await response.json();
    resp = result.data.status;                    
    if (resp.includes('successful')) {
        alert(action + " OK!");
            if ('referrer' in document) {
                    window.location = document.referrer;
            } else {
                window.location.reload(history.back());
            };
    }else{
        alert(resp);
        return false;
    }

};