/* for Grade_edit.html */

String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
};

var flag = 0;
var gid = decode_gid(location.search);

function decode_gid(ss) {
    var id = decodeURI(ss).split('=')[1];
    return id
}

window.onload = initialize_page();

function initialize_page() {
    if (gid.length > 0) {
        fetch_grade();
    }
    $("#preloader").hide();
    $("#mainpart").show();
}

function fetch_grade() {
    $.getJSON("gpi/allocate/grade_fetch",{"GID": gid, 'type': '0'}, function (data) {
        grade_fields.forEach(field => {
            let obj = "#" + field;
            $(obj).prop('value', data.data.items[0][field]);
            //document.formxl[field].value = 
        });
    });
}



function pre_validation() {
    // make sure all input are not empty and valid
    // const alert_html = '<font color="#FF0000" size="4">*</font>';
    // const pass_html = '';
    var count = 0;
    grade_fields.forEach(field => {
        let err = "#error" + field;
        if (document.formxl[field].value.trim().length <= 0) {
            $(err).show();
            count++;
        } else {
            $(err).hide();
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
    mail = $.cookie(cookie_mail);
    const url = 'gpi/allocate/grade_edit';
    
    var data = {
        mail: mail,
    };

    grade_fields.forEach(field => {
        data[field] = document.formxl[field].value
    });
    var action = ''
    if (gid.length > 0) {
        // Edit mode
        data.type = '2';
        data.GID = gid;
        action = 'Modify'
    } else {
        data.type = '1';
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
        if ('referrer' in document) {
            window.location = document.referrer
        } else {
            window.location.reload(history.back());
        };
    }else{
        alert(resp);
    }

};
