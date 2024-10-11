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

