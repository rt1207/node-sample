
$(document).ready(function(){
	
	var lv = new LoginValidator();
	var lc = new LoginController();

// main login form //

	$('#login-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (lv.validateForm() == false){
				return false;
			} 	else{
			// append 'remember-me' option to formData to write local cookie //
				formData.push({name:'remember-me', value:$("input:checkbox:checked").length == 1})
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/';
		},
		error : function(e){
            lv.showLoginError('ログインに失敗しました。', 'ユーザ名、パスワードを確認して下さい。');
		}
	}); 
	$('#user-tf').focus();
	
// login retrieval form via email //
	
	var ev = new EmailValidator();
	
	$('#get-credentials-form').ajaxForm({
		url: '/lost-password',
		beforeSubmit : function(formData, jqForm, options){
			if (ev.validateEmail($('#email-tf').val())){
				ev.hideEmailAlert();
				return true;
			}	else{
				ev.showEmailAlert("<b>エラー：</b> 有効なメールアドレスを入力して下さい。");
				return false;
			}
		},
		success	: function(responseText, status, xhr, $form){
			ev.showEmailSuccess("パスワードの再発行についてはメールをご確認下さい。");
		},
		error : function(){
			ev.showEmailAlert("Sorry. There was a problem, please try again later.");
		}
	});
	
})