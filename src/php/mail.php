<?php

if(count($_POST) > 0)
{
    $mail_address = "yourmail@yourdomain.com";
    $mail_subject = "Email from yourdomain.com";

	$name = $_POST['name'];
	$email = $_POST['email'];
	$contact = $_POST['contact'];
	$comments = $_POST['comments'];
	$header = "Content-Type: text/html\r\nReply-To: $email\r\nForm: $name <$email>";
	
	$body =
    	@"Name : $name <br/>
    	  Email : $email <br/>
    	  Contact : $contact <br/>
    	  Time : ".date("d/m/Y H:i",time())."<br/>
    	  Message : <br/>
    	$comments
    	<br/>
    	_____";
	if(mail($mail_address,$mail_subject,$body,$header))
	{
		die("true");
	}
	else {
		die ("There was error sending the email.");
		}
}
?>