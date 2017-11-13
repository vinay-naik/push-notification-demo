(function () {
	'use strict';

	var loginAjaxCallback = function (method) {
		method = method || 'login';
		$.ajax({
			type: 'POST',
			url: 'api/auth/' + method,
			data: {
				'email': $('#login-email').val(),
				'password': $('#login-password').val()
			},
			success: function (response) {
				console.log(response);
				if (response.status == 200 && response.data) {
					if (!response.data.token) {
						$('#login-error-container').html(method.toUpperCase() + ' failed. Please try again.').css('visibility', 'visible');;
					} else if (typeof (Storage) !== "undefined") {
						localStorage.setItem("notify-demo-token", response.data.token);
						window.location.href = '/dashboard';
					} else {
						$('#login-error-container').html('Browser not supported. Please open the site on a newer browser.').css('visibility', 'visible');;
					}
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				$('#login-error-container').html(XMLHttpRequest.responseJSON.message).css('visibility', 'visible');;
			}
		});
	};

	var signupCallback = function () {
		var form = document.getElementById('login-form');
		var isValidForm = form.checkValidity();
		if (isValidForm) {
			loginAjaxCallback('signup');
		}
	};

	var loginCallback = function () {
		var form = document.getElementById('login-form');
		var isValidForm = form.checkValidity();
		if (isValidForm) {
			loginAjaxCallback('login');
		}
	};

	$(document).ready(function () {
		$('#signup-btn').on('click', signupCallback);
		$('#login-btn').on('click', loginCallback);
	});
})();