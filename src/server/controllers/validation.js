module.exports.messages = {
	required: '{{ field }} is required.',
	alpha_numeric: 'Usernames can only contain alphanumeric characters.',
	email: 'Please enter a valid email.',
	min: '{{ field }} must be atleast {{ argument.0 }} characters.',
	max: '{{ field }} cannot be longer than {{ argument.0 }} characters',
	same: 'Password confirmation must match.',
	url: 'Please enter a full valid URL.'
};

module.exports.register = {
	Username: 'required|alpha_numeric|min:3|max:16',
	Email: 'required|email',
	Password: 'required|min:6',
	Password_confirm: 'same:Password'
};

module.exports.apiRegister = {
	Name: 'required|alpha_numeric',
	Email: 'required|email',
	URL: 'required|url'
};
