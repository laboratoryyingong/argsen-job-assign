var globalEmailId = '';

(function ($) {

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
              '<td><button class="previewButton" id="' + emailId + '?preview" onclick="javascript:createPreview(this)">preview</button></td>' +
              '<td><button id="' + emailId + '?attachment" onclick="javascript:createAttachmentView(this)">show</button>' +
              '<span class="attachmentWrapper">'+
              '</span>'+
              '<img class="loading-gif-medium" src="/images/loading.gif" style="display:none;">' +
              '</td>';

            $tr.append(td);
            $('#table-body').append($tr);
          }




        });

    }
  });

  $('#generateTicket').on('click', function(){
    var generator = new IDGenerator();
    var ticket = generator.generate();

    $('#displayTicket').val('#' + ticket);

  });

  createHint();

  $('#generateTicket').trigger('click');

  $('#throwJob').on('click', function(){

    //get subject
    var ticket = $('#displayTicket').val();
    var subject = '< Ticket No. ' + $('#displayTicket').val() + ' > ' + $('#commentTitle').val();

    //get recipients
    var emailArray = $('#consumer').tagsinput('items');
    var recipients = [];

    //get content
    var content = $('#commentMessage').val();
    var title = $('#commentTitle').val();
    var comment = $('#commentMessage').val();

    //get type
    var type = 'html';

    //get isEmailAttached
    var isEmailAttached = $('#withEmail').prop('checked');

    //get reference
    var reference = '';
    isEmailAttached ? reference = globalEmailId : reference = '';

    $('#loading-gif').show();

    for (var i in emailArray) {
      var address = {
        'address': emailArray[i]['value']
      }
      recipients.push(address);
    }

    $.get('/email/send', {
      subject: subject,
      recipients: JSON.stringify(recipients),
      content: content,
      type: type,
    })
      .done(function (data) {

        $.post("/ticket/insert", {
          ticket: ticket,
          recipients: JSON.stringify(recipients),
          title: title,
          comment: comment,
          reference: reference,
          isEmailAttached: isEmailAttached
        })
          .done(function (data) {

            $('#loading-gif').hide();
            //clear
            reset();
            alert('Successully kicked ass!!');

          });

      });

  });

})(jQuery);

//retrieve content
function createPreview(elem) {
  var emailId = $(elem).attr('id').split('?')[0];

  globalEmailId = emailId;

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



  //clear div
  $(elem).parent().find('.attachmentWrapper').empty();

  $(elem).parent().find('.loading-gif-medium').show();

  $.get('/email/getAttachments', {
    emailId: emailId,
  })
    .done(function (data) {

      var span = $('<span class="attachmentWrapper"></span>');

      for (var i in data) {
        var button = '<button class="attachmentTitle button-primary" emailId="' + emailId + '" contentId = "' + data[i]['contentId'] + '">' + data[i]['name'] + '</button>';
        span.append(button);
      }

      $(elem).parent().append(span);

      $('.attachmentTitle ').off('click');

      $('.attachmentTitle').on('click', function () {

        var contentId = $(this).attr('contentId');
        var emailId = $(this).attr('emailId');


        $.get('/email/attachment', {contentId:contentId, emailId:emailId})
         .done(function(data){

            var sampleArr = base64ToArrayBuffer(data.contentBytes);
            saveByteArray(data.name, sampleArr);

         });

      });

      $(elem).parent().find('.loading-gif-medium').hide();

    })

  
}

function createHint(){
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

  return true;
}

function IDGenerator() {

  this.length = 8;
  this.timestamp = Date.now();

  var _getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  this.generate = function () {
    var ts = this.timestamp.toString();
    var parts = ts.split("").reverse();
    var id = "";

    for (var i = 0; i < this.length; ++i) {
      var index = _getRandomInt(0, parts.length - 1);
      id += parts[index];
    }

    var dateString = new Date(this.timestamp)
    var year = dateString.getFullYear().toString();
    var month = dateString.getMonth().toString();
    var day = dateString.getDay().toString();
    var hours = dateString.getHours().toString();

    var prefix = year + month + day + hours;

    return  prefix + '_' + id;
  }


}

function reset(){

  $('#generateTicket').trigger('click');
  $('#consumer').tagsinput('removeAll');
  $('#commentTitle').val('');
  $('#commentMessage').val('');
  $('#withEmail').prop('checked', false);

}

function base64ToArrayBuffer(base64) {
  var binaryString = window.atob(base64);
  var binaryLen = binaryString.length;
  var bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
}

function saveByteArray(reportName, byte) {
  var blob = new Blob([byte]);
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  var fileName = reportName;
  link.download = fileName;
  link.click();
};



