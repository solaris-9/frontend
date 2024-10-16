/* this fis is used to make sure the user is in login status before page loaded */

var cookie_grades = {};
    
grade_fields.forEach(field => {
    cookie_grades[field] = $.cookie(field)
});

function check_login(target) {

    //window.onload = function () {
    $(document).ready(function() {
        if ( $.cookie(cookie_name) == null || $.cookie(cookie_name) == 'none'  || $.cookie(cookie_level) == 'undefined' ) {     
            location.href = "/request/login.html?id=" + target;
        }
    });

}
