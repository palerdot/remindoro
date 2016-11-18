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

    // prevent pasting rich html in content editable for now
    // ref: http://stackoverflow.com/a/19269040/1410291
    $(document).on('paste','[contenteditable]', function (e) {
        e.preventDefault();
        var text = (e.originalEvent || e).clipboardData.getData('text/plain');
        console.log("PORUMAI PASTE event ", text);
        window.document.execCommand('insertText', false, text);
    });

} );