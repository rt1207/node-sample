
$(document).ready(function(){
	
	var av = new MovieValidator();
	var sc = new MovieController();
	
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			// return av.validateForm();
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') $('.modal-alert').modal('show');
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
			    // av.showInvalidEmail();
			}	else if (e.responseText == 'title-taken'){
			    av.showInvalidTitle();
			}
		}
	});
	$('#name-tf').focus();
	
// customize the account signup form //
	
	$('#account-form h1').text('動画情報の編集');
	$('#account-form #sub1').text('このアプリケーションのDBを編集することができます。');
	$('#account-form #sub2').text('動画情報を入力してください。');
	$('#account-form-btn1').html('キャンセル');
	$('#account-form-btn2').html('送信する');
	$('#account-form-btn2').addClass('btn-primary');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('動画編集を完了しました。</br>OKをクリックしてください。');

})