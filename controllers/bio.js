const User = require("../models/User");
const checkIfNotUser = require("../utils/checkIfNotUser");

// Get the bio of the current user
exports.getBio = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);
		checkIfNotUser(user, res);
		const bio = user.bio;
		res.json({ data: { bio } });
	} catch (err) {
		next(err);
	}
};

// Edit bio of current user
exports.editBio = async (req, res, next) => {
	const { about, dateOfBirth, website } = req.body;
	try {
		const user = await User.findById(req.user.id);
		checkIfNotUser(user, res);
		if (about) {
			user.bio.about = about;
			await user.save();
		}
		if (dateOfBirth) {
			user.bio.dateOfBirth = dateOfBirth;
			await user.save();
		}
		if (website) {
			user.bio.website = website;
			await user.save();
		}
		res.status(200).json({
			data: {
				bio: user.bio,
			},
		});
	} catch (err) {
		next(err);
	}
};
