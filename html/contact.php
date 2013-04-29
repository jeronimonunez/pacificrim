<?php
		$name     = '';
        $email    = ''; 
        $message = ''; 
        
         
        if(isset($_POST['email'])) {
        
            $name = $_POST['name'];
            $email = $_POST['email'];
            $message = $_POST['message'];

            if(get_magic_quotes_gpc()) {
                    $message = stripslashes($message);
            }

             $address = "president@pacificrimgroup.ca";

             $e_subject = 'Simpler Landing: You\'ve Received a Message From ' . $name . '.';

             $e_body = "You have Received a message from $name, their additional message is as follows.\r\n\n";

             $e_content = "\"$message\"\r\n\n";

             $e_reply = "You can contact $name via email, $email";

             $msg = $e_body . $e_content . $e_reply;

              mail($address, $e_subject, $msg, "From: $email\r\nReply-To: $email\r\nReturn-Path: $email\r\n","-f $address");
    
             echo "Message Sent Successfully!";
        }
        else
		{
            echo "Message Sending Failed!";
        }