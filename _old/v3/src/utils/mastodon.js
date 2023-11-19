const fetch = require("node-fetch");

exports.getComments = async function(url) {
  try {
    let mastodon = new URL(url);

    let post = mastodon.pathname.split("/")[
      mastodon.pathname.split("/").length - 1
    ];
    let comments = await (
      await fetch(mastodon.origin + "/api/v1/statuses/" + post + "/context")
    ).json();
    comments = comments.descendants.map(comment => ({
      content: comment.content,
      username: comment.account.display_name.length
        ? comment.account.display_name
        : comment.account.username,
      acct: comment.account.acct
    }));
    mastodon = {
      comments,
      origin: url,
      reply: mastodon.origin + "/interact/" + post + "?type=reply"
    };
    return mastodon;
  } catch (err) {}
  return null;
};
