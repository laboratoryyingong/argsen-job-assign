
$(function() {

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
              var id = data[i].id;

              var td = '<td>' + subject + '</td>' +
                '<td>' + receivedDateTime + '</td>' +
                '<td>' + isRead + '</td>' +
                '<td><button id="' + id + '_preview" onclick="javascript:createPreview(this)">preview</button></td>';

              $tr.append(td);
              $('#table-body').append($tr);
            }




          });

    }
  });

});

//retrieve content
function createPreview(elem) {
  var id = $(elem).attr('id').split('_')[0];

  $.get('/email/getContent', {
      id: id,
    })
    .done(function (data) {

      $('#preview').empty();
      $('#preview').append(data[0]['body']['content']);
      console.log(data);
    });

}
