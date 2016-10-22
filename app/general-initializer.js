// any common jquery related stuffs here
$(document).ready( function () {

    $('select').material_select();

    // ref: http://stackoverflow.com/a/24827239/1410291
    // css/js approach for placeholder for contentEditable
    $("body").on("focusout", "[contenteditable]", function() {
        var element = $(this);        
        if (!element.text().trim().length) {
            element.empty();
        }
    });

} );