const posts = require("./posts");
const users = require("./users");
const auth = require("./auth");
const home = require("./home");
const bio = require("./bio");
const engage = require("./engage");

module.exports = [
  { endpoint: "/api/posts", route: posts },
  { endpoint: "/api/users", route: users },
  { endpoint: "/api/auth", route: auth },
  { endpoint: "/api/home", route: home },
  { endpoint: "/api/bio", route: bio },
  { endpoint: "/api/engage", route: engage },
];
