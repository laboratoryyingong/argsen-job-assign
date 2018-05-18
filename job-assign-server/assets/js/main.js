$(function () {

  $('#pagination-demo').twbsPagination({
    totalPages: 10,
    visiblePages: 5,
    first: '<i class="fas fa-step-backward"></i>',
    prev: '<i class="fas fa-chevron-left"></i>',
    next: '<i class="fas fa-chevron-right"></i>',
    last: '<i class="fas fa-step-forward"></i>',
    onPageClick: function (event, page) {
      var limit = 5;
      var skip = (parseInt(page) - 1) * limit;

      $.get("/email/get", {
          limit: limit,
          skip: skip
        })
        .done(function (data) {

          $('#table-body').empty();

          for (var i in data) {

            var $tr = $('<tr></tr>');
            var subject = data[i].subject;
            var receivedDateTime = data[i].receivedDateTime;
            var isRead = data[i].isRead === true ? "YES" : "NO";
            var emailId = data[i].emailId;

            var td = '<td>' + subject + '</td>' +
              '<td>' + receivedDateTime + '</td>' +
              '<td>' + isRead + '</td>' +
              '<td><button id="' + emailId + '?preview" onclick="javascript:createPreview(this)">preview</button></td>' +
              '<td><button id="' + emailId + '?attachment" onclick="javascript:createAttachmentView(this)">show</button></td>';

            $tr.append(td);
            $('#table-body').append($tr);
          }




        });

    }
  });

});

//retrieve content
function createPreview(elem) {
  var emailId = $(elem).attr('id').split('?')[0];

  $.get('/email/getContent', {
      emailId: emailId,
    })
    .done(function (data) {

      $('#preview').empty();
      $('#previewFrom').empty();
      $('#preview').append(data[0]['body']['content']);
      $('#previewFrom').append('< ' + data[0]['from']['emailAddress']['name'] + ' >' + ' <a href="mailto:' + data[0]['from']['emailAddress']['address'] + '" target="_top">' + data[0]['from']['emailAddress']['address'] + '</a>');

    });

}

function createAttachmentView(elem) {
  var emailId = $(elem).attr('id').split('?')[0];

  console.log(emailId)
}

var names = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: 'data/names.json'
});
names.initialize();

var elt = $('#consumer');
elt.tagsinput({
  itemValue: 'value',
  itemText: 'value',
  typeaheadjs: {
    name: 'names',
    displayKey: 'text',
    source: names.ttAdapter()
  }
});

