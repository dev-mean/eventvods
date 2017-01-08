var config = require('../../config/config.js');
var helper = require('sendgrid').mail;
var sg = require('sendgrid')(config.sendgrid);
var q = require('q');

module.exports.sendVerification = function(user) {
    var promise = q.defer();
    var from, to, subject, html, plain, mail, json, request, verifyemail, personalization, url, tracking, namePersonalization;
    from = new helper.Email("no-reply@mailer.eventvods.com", "Eventvods");
    to = new helper.Email(user.email);
    subject = "Eventvods.com Email Confirmation";
    html = new helper.Content("text/html", "Eventvods");
    plain = new helper.Content("text/plain", "Eventvods");
    mail = new helper.Mail();
    mail.setTemplateId("0a91c12e-0a74-4608-bd09-8e65c0fc3508"); //confirmation email
    url = "https://eventvods.com/api/user/verify/" + user._id + "/" + user.code;
    verifyemail = new helper.Substitution("-verifyurl-", url);
    tracking = new helper.ClickTracking(true, true);
    personalization = new helper.Personalization();
    personalization.addSubstitution(verifyemail);
    personalization.addTo(to);
    mail.setSubject(subject);
    mail.setFrom(from);
    mail.addPersonalization(personalization);
    mail.addContent(plain);
    mail.addContent(html);
    mail.addTrackingSettings(tracking);
    json = mail.toJSON();
    request = sg.emptyRequest();
    request.method = 'POST';
    request.path = '/v3/mail/send';
    request.body = json;
    sg.API(request, function() {
        promise.resolve();
    });
    return promise.promise;
}

module.exports.passwordReset = function(email, token) {
    var promise = q.defer();
    var from, to, subject, html, plain, mail, json, request, verifyemail, personalization, url, tracking, namePersonalization;
    from = new helper.Email("no-reply@mailer.eventvods.com", "Eventvods");
    to = new helper.Email(email);
    subject = "Eventvods.com Password Reset";
    html = new helper.Content("text/html", "Eventvods");
    plain = new helper.Content("text/plain", "Eventvods");
    mail = new helper.Mail();
    mail.setTemplateId("09b53453-95a6-4a1a-8ab4-fdbbcae3b096"); //reset email
    url = "https://eventvods.com/api/user/reset/" + token._id + "/" + token.token;
    reseturl = new helper.Substitution("-reseturl-", url);
    tracking = new helper.ClickTracking(true, true);
    personalization = new helper.Personalization();
    personalization.addSubstitution(reseturl);
    personalization.addTo(to);
    mail.setSubject(subject);
    mail.setFrom(from);
    mail.addPersonalization(personalization);
    mail.addContent(plain);
    mail.addContent(html);
    mail.addTrackingSettings(tracking);
    json = mail.toJSON();
    request = sg.emptyRequest();
    request.method = 'POST';
    request.path = '/v3/mail/send';
    request.body = json;
    sg.API(request, function() {
        promise.resolve();
    });
    return promise.promise;
}