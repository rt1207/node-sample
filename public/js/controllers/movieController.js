
function MovieController()
{
// redirect to homepage when cancel button is clicked //
	$('#account-form-btn1').click(function(){ window.location.href = '/movies';});

// redirect to homepage on new account creation, add short delay so user can read alert window //
	$('.modal-alert #ok').click(function(){ setTimeout(function(){window.location.href = '/movies';}, 300)});



// bind event listeners to button clicks //
	var that = this;

	$('#btn-logout').click(function(){ that.attemptLogout(); });

	this.attemptLogout = function()
	{
		var that = this;
		$.ajax({
			url: "/home",
			type: "POST",
			data: {logout : true},
			success: function(data){
	 			that.showLockedAlert('ログアウトしました。<br>ホーム画面へ遷移します。');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.showLockedAlert = function(msg){
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h3').text('Success!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function(){window.location.href = '/';})
		setTimeout(function(){window.location.href = '/';}, 3000);
	}
}