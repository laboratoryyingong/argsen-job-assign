(function($){

    console.log('you know, it is a fake auth process, just Zhuang Zhuang Yang Zi!!');

    $('#enter').on('click', function(){

      var password = $("#password").val();

      if(password){

        $.post('/user/send', {
          user: $('#name').find(":selected").text(),
          password: $('#password').val()
        })
        .done(function(data){
          window.location.href = '/main';
        });
        
      }else{
        alert("Come on man, you need to input some password!")
      }

    });
  
  })(jQuery);