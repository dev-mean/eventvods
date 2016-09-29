var config = require('../../config/config.js');
var helper = require('sendgrid').mail;
var sg = require('sendgrid')(config.sendgrid);
var q = require('q');

module.exports.sendVerification = function(user){
	var promise = q.defer();
    var from, to, subject, html, plain, mail, json, request, verifyemail, name, personalization, url, tracking, namePersonalization;
    from = new helper.Email("no-reply@mailer.eventvods.com", "Eventvods");
    to = new helper.Email(user.email);
    subject = "Eventvods.com Email Confirmation";
    html = new helper.Content("text/html", "Eventvods");
    plain = new helper.Content("text/plain", "Eventvods");
    mail = new helper.Mail();
    mail.setTemplateId("0a91c12e-0a74-4608-bd09-8e65c0fc3508");//confirmation email
    url = "https://beta.eventvods.com/api/user/verify/" + user._id + "/" + user.code;
	console.log(url);
    verifyemail = new helper.Substitution("-verifyurl-", url);
	name = new helper.Substitution("-name-", user.displayName);
    tracking = new helper.ClickTracking(true, true);
    personalization = new helper.Personalization();
    personalization.addSubstitution(verifyemail);
	personalization.addSubstitution(name);
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
