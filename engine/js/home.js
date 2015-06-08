$(document).ready(function(){
	$("#btnRegisterNewMember").click(function(){
		$(".loginForm").fadeOut(function(){
			$(".registerForm").fadeIn();
		});
	})
	$("#btnBackToLoginReg").click(function(){
		$(".registerForm").fadeOut(function(){
			$(".loginForm").fadeIn();
		});
	})
	$("#btnForgotPassword").click(function(){
		$(".loginForm").fadeOut(function(){
			$(".forgotPasswordForm").fadeIn();
			$("#modalLabel").text("Forgot Password");
			$("#modalLabelContent").text("We will send confirmation and new password to your email.");
		});
	})
	$("#btnBackToLoginFor").click(function(){
		$(".forgotPasswordForm").fadeOut(function(){
			$(".loginForm").fadeIn();
			$("#modalLabel").text("Login | Register");
			$("#modalLabelContent").text("Input email and password to start managing your website.");
		});
	})
});