
$(document).ready(function(){
	
	var av = new AccountValidator();
	var sc = new SignupController();
	
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			val = av.validateForm();
			if(val) $('.loading').addClass('waiting');
			// setTimeout(function(){$('.loading').removeClass('waiting')},12000);
			return val;
		},
		success	: function(responseText, status, xhr, $form){
			$('.loading').removeClass('waiting');
			if (status == 'success') $('.modal-alert').modal('show');
		},
		error : function(e){
			$('.loading').removeClass('waiting');
			if (e.responseText == 'email-taken'){
			    av.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
			    av.showInvalidUserName();
			}
		}
	});
	$('#email-tf').focus();
	
// customize the account signup form //
	
	$('#account-form h1').text('新規登録');
	$('#account-form #sub1').text('フォームを入力して下さい。');
	$('#account-form #sub2').text('');
	$('#account-form-btn1').html('キャンセル');
	$('#account-form-btn2').html('送信');
	$('#account-form-btn2').addClass('btn-primary');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : 'static' });
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('アカウント申請を完了しました。</br>ログインページヘ移動します。');

})