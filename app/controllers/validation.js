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
module.exports.article = {
    title: 'required',
    slug: 'required',
    author: 'required',
    publishDate: 'required'
}
module.exports.register = {
    displayName: 'required|max:30',
    email: 'required|email',
    password: 'required|min:6',
    password_confirm: 'same:password',
    tos: "required|accepted"
};
module.exports.password = {
    password: 'required|min:6',
    password_confirm: 'same:password'
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
module.exports.event = {
    name: 'required',
    game: 'required',
    slug: 'required',
    startDate: 'required',
    endDate: 'required',
    format: 'required'
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
module.exports.team = {
    name: 'required',
    tag: 'required',
    slug: 'required'
};
module.exports.user = {
    displayName: 'required',
    email: 'required|email',
    userRights: 'required'
};
module.exports.mail = {
    subject: 'required',
    contents: 'required',
    name: 'required',
    email: 'email'
}
module.exports.rating = {
    match: 'required',
    rating: 'required|max:5|min:1',
    index: 'required'
}