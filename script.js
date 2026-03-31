function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function sendContactEmails(formData) {

  var notificationEmails = ['shahgees@gmail.com', 'mudassir.p@gmail.com'];
  var clientEmail = formData.email;

  // ── 1. Notification email to your team ──────────────────────────────────────
  var notificationSubject = 'New Contact Form Submission from ' + formData.name;
  var notificationBody =
    'A new message has been submitted through the Robusto.tech contact form:\n\n' +
    'Name:      ' + formData.name    + '\n' +
    'Company:   ' + formData.company + '\n' +
    'Email:     ' + formData.email   + '\n' +
    'Phone/WA:  ' + formData.phone   + '\n' +
    'Service:   ' + formData.service + '\n\n' +
    'Message:\n' +
    '---\n' +
    formData.message + '\n' +
    '---\n\n' +
    'Robusto.tech Website';

  try {
    MailApp.sendEmail({
      to:      notificationEmails.join(','),
      subject: notificationSubject,
      body:    notificationBody
    });
    Logger.log('Notification email sent.');
  } catch (e) {
    Logger.log('Notification email error: ' + e.toString());
    // Still try to send the client confirmation below; don't throw yet.
  }

  // ── 2. Confirmation email to the client ─────────────────────────────────────
  if (clientEmail) {
    var confirmationSubject = 'Robusto.tech: We received your inquiry!';
    var confirmationBody =
      'Hi ' + formData.name + ',\n\n' +
      'Thank you for reaching out to Robusto.tech! We have successfully received your message.\n\n' +
      'Here is a summary of what you sent:\n' +
      'Service Interested In: ' + (formData.service || 'N/A') + '\n\n' +
      'Your Message:\n' +
      '---\n' +
      (formData.message || 'N/A') + '\n' +
      '---\n\n' +
      'Our team will get back to you within 24 hours via WhatsApp or email.\n\n' +
      'Chat with us directly on WhatsApp:\n' +
      'https://wa.me/923002222044\n\n' +
      'We look forward to helping you grow!\n\n' +
      'Best regards,\n' +
      'The Robusto.tech Team\n' +
      'www.robusto.tech';

    try {
      MailApp.sendEmail({
        to:      clientEmail,
        subject: confirmationSubject,
        body:    confirmationBody,
        name:    'Robusto.tech'
      });
      Logger.log('Confirmation email sent to ' + clientEmail);
    } catch (e) {
      Logger.log('Confirmation email error: ' + e.toString());
      // Don't throw — notification email already sent.
    }
  }

  // ── IMPORTANT: explicit return so withSuccessHandler fires in the browser ───
  return 'ok';
}