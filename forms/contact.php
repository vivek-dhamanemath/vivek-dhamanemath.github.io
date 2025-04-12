<?php
  // Updated receiving email address
  $receiving_email_address = 'vivekjdwork@gmail.com';

  // Use more robust email sending method for Gmail specifically
  if (!file_exists('../assets/vendor/php-email-form/php-email-form.php')) {
    // Create a basic mailer function using Gmail-friendly approach
    function send_email($to, $from_name, $from_email, $subject, $message) {
      // For Gmail, it's better to use the receiver as the From header to avoid spam flags
      $headers = "From: $to\r\n"; // Use your Gmail as the sender
      $headers .= "Reply-To: $from_email\r\n";
      $headers .= "X-Sender: $from_email\r\n";
      $headers .= "Return-Path: $to\r\n"; // Return path should be your Gmail
      $headers .= "MIME-Version: 1.0\r\n";
      $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
      
      // Add a subject prefix to help identify form submissions
      $email_subject = "[Portfolio Contact] $subject";
      
      $email_body = "
        <html>
        <head>
          <title>New Contact Message</title>
        </head>
        <body>
          <h2>Contact Message Details</h2>
          <p><strong>Name:</strong> $from_name</p>
          <p><strong>Email:</strong> $from_email</p>
          <p><strong>Subject:</strong> $subject</p>
          <p><strong>Message:</strong><br/>$message</p>
        </body>
        </html>
      ";
      
      // Debug information
      error_log("Attempting to send email to: $to");
      
      // Send email with additional parameters for better delivery
      if (mail($to, $email_subject, $email_body, $headers, "-f$to")) {
        error_log("Email sent successfully");
        return json_encode(['success' => true]);
      } else {
        error_log("Email sending failed: " . error_get_last()['message']);
        return json_encode(['success' => false, 'error' => 'Failed to send email. Please try using the direct email address shown on this page.']);
      }
    }
    
    // Process the form data
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
      $name = htmlspecialchars($_POST['name']);
      $email = htmlspecialchars($_POST['email']);
      $subject = htmlspecialchars($_POST['subject']);
      $message = htmlspecialchars($_POST['message']);
      
      echo send_email($receiving_email_address, $name, $email, $subject, $message);
    } else {
      echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    }
  } else {
    if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
      include( $php_email_form );
    } else {
      die( 'Unable to load the "PHP Email Form" Library!');
    }

    $contact = new PHP_Email_Form;
    $contact->ajax = true;
    
    $contact->to = $receiving_email_address;
    $contact->from_name = $_POST['name'];
    $contact->from_email = $_POST['email'];
    $contact->subject = $_POST['subject'];

    // Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
    /*
    $contact->smtp = array(
      'host' => 'example.com',
      'username' => 'example',
      'password' => 'pass',
      'port' => '587'
    );
    */

    $contact->add_message( $_POST['name'], 'From');
    $contact->add_message( $_POST['email'], 'Email');
    $contact->add_message( $_POST['message'], 'Message', 10);

    echo $contact->send();
  }
?>
