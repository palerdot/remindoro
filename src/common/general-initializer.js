import jquery from 'jquery'
window.jQuery = jquery
window.$ = jquery

import * as M from 'materialize-css'

document.addEventListener('DOMContentLoaded', function () {
  M.Modal.init(document.querySelectorAll('#options-modal'), {})
  // M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {});
  M.FormSelect.init(document.querySelectorAll('select'), {})
})

// any common jquery related stuffs here
$(document).ready(function () {
  // v0.x
  // $('select').material_select();

  // v 0.1
  $('select').formSelect()
  $('#options-modal').modal()

  // ref: http://stackoverflow.com/a/24827239/1410291
  // css/js approach for placeholder for contentEditable
  $('body').on('focusout', '[contenteditable]', function () {
    var element = $(this)
    if (!element.text().trim().length) {
      element.empty()
    }
  })

  // prevent pasting rich html in content editable for now
  // ref: http://stackoverflow.com/a/19269040/1410291
  $(document).on('paste', '[contenteditable]', function (e) {
    e.preventDefault()
    var text = (e.originalEvent || e).clipboardData.getData('text/plain')
    window.document.execCommand('insertText', false, text)
  })
})
