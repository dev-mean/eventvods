module.exports.messages = {
    required: '{{ field }} is required.',
    alpha_numeric: '{{ field}} can only contain alphanumeric characters.',
    email: 'Please enter a valid email.',
    min: '{{ field }} must be atleast {{ argument.0 }} characters.',
    max: '{{ field }} cannot be longer than {{ argument.0 }} characters',
    same: 'Password confirmation must match.',
    url: 'Please enter a full valid URL.',
    array: '{{ field }} should be an array of data.',
    boolean: '{{ field }} should be either true or false.',
    //specific field messages
    'Username.alpha_numeric': 'Usernames can only contain alphanumeric characters.'
};
module.exports.register = {
	displayName: 'required|max:30',
    email: 'required|email',
    password: 'required|min:6',
    password_confirm: 'same:password',
	tos: "required|accepted"
};
module.exports.login = {
	email: 'required|email',
	password: 'required|min:6'
};
module.exports.name = {
	"Name": 'required|max:30',
};
module.exports.api = {
    Name: 'required|alpha_numeric',
    Email: 'required|email',
    URL: 'required|url'
};
module.exports.game = {
    name: 'required',
    slug: 'required'
};
module.exports.league = {
    name: 'required',
    game: 'required',
	slug: 'required',
	startDate: 'required',
	endDate: 'required'
};
module.exports.event = {
    eventGame: 'required|alpha_numeric',
    eventTitle: 'required|alpha_numeric',
    eventPermaLink: 'required',
    eventAbbreviation: 'required|alpha_numeric',
    eventType: 'required|alpha_numeric',
    eventModules: 'array',
    eventLocation: 'required|alpha_numeric',
    eventMedia: 'array',
    eventSponsors: 'array',
    eventStartDate: 'required|date',
    eventEndDate: 'required|date'
};
module.exports.staff = {
    forename: 'required',
    surname: 'required',
    alias: 'required',
    role: 'required',
	slug: 'required'
};
module.exports.link = {
    linkText: 'required',
    linkURL: 'required|url',
    linkSpoiler: 'required|boolean'
};
module.exports.map = {
    mapGame: 'required',
    mapName: 'required'
};
module.exports.match = {
    matchStatus: 'required|in:Upcoming,Live,Finished',
    matchDate: 'required|date',
    matchType: 'alpha_numeric',
    matchRounds: 'array',
    matchTeam1: 'required',
    matchTeam2: 'required',
    matchTeam1Wins: 'required|integer',
    matchTeam2Wins: 'required|integer',
    matchWinner: 'required_when:matchStatus,Finished'
};
module.exports.organization = {
    organizationName: 'required',
    organizationMedia: 'array'
};
module.exports.round = {
    roundTeam1: 'required',
    roundTeam2: 'required',
    roundlinks: 'array'
};
module.exports.socialMedia = {
    mediaType: 'required|in:Website,Twitter,Facebook,Twitch,Youtube,Stream,Other',
    mediaName: 'required',
    mediaURL: 'required|url'
};
module.exports.sponsor = {
    sponsorName: 'required',
    sponsorWebsite: 'required|url'
};
module.exports.team = {
    teamName: 'required',
    teamTag: 'required|max:4'
};
module.exports.module = {
    moduleTitle: 'required',
    moduleMatches: 'array',
    moduleTeams: 'array'
};
module.exports.user = {
    username: 'required|min:3|max:16',
    userEmail: 'required|email',
    userRights: 'required|integer',
    userPreferences: 'required',
    emailConfirmed: 'required|boolean'
};
