const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// get the latest tweets to display on the TL
// latest tweets, comments and retweets of current user latest replies to their tweets, tweets, retweets, likes, comments of followings,
exports.latestTweets = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);

		const ownTweets = await Post.find({
			$and: [
				{
					date: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
				},
				{
					$or: [
						{ user: req.user.id },
						{ likes: req.user.id },
						{ retweets: req.user.id },
					],
				},
			],
		}).sort({ date: -1 });
		const ownComments = await Comment.find({
			$and: [
				{
					date: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
				},
				{
					$or: [
						{ user: req.user.id },
						{ likes: req.user.id },
						{ retweets: req.user.id },
					],
				},
			],
		}).sort({ date: -1 });
		if (user.following.length !== 0) {
			let followingsTweets = [];
			let counter = 0;
			user.following.forEach(async (e) => {
				let posts = await Post.find({
					$and: [
						{
							date: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
						},
						{
							$or: [{ user: e.user }, { likes: e.user }, { retweets: e.user }],
						},
					],
				}).sort({ date: -1 });
				followingsTweets.unshift(...posts);
				let comments = await Comment.find({
					$and: [
						{
							date: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
						},
						{
							$or: [{ user: e.user }, { likes: e.user }, { retweets: e.user }],
						},
					],
				}).sort({ date: -1 });
				followingsTweets.unshift(...comments);
				counter++;
				// when asynchronous request is done, return response
				if (counter === user.following.length) {
					const finalData = [
						...ownTweets,
						...ownComments,
						...followingsTweets,
					].sort((a, b) => b.date - a.date);
					// remove tweets of those muted or blocked
					let muted = user.muted;
					let blocked = user.blocked;
					let blockedMe = user.blockedMe;
					let allRestricted = [...muted, ...blocked, ...blockedMe];
					allRestricted.forEach((e, i) => (allRestricted[i] = e.toString()));
					finalData.forEach((e, i) => {
						if (allRestricted.includes(e.user.toString())) {
							finalData.splice(i, 1);
						}
					});
					return res.json({
						data: finalData,
					});
				}
			});
		} else {
			const finalData = [...ownTweets, ...ownComments];
			return res.json({
				data: finalData
			});
		}
	} catch (err) {
		next(err);
	}
};
