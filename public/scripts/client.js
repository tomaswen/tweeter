/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//Prevents XSS using escape method
const escape = str => {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = tweetObject => {
  const tweetedDate = new Date(tweetObject["created_at"]);
  const todayDate = new Date();
  const daysSince = Math.round(
    (todayDate.getTime() - tweetedDate.getTime()) / 86400000
  );
  const markup = `
    <article class="tweet">
      <header>
        <img
          alt="Profile Avatar"
          class="tweet-avatar"
          src="${tweetObject.user.avatars}"
        />
        <label class="tweet-username"> ${tweetObject.user.name} </label>
        <label class="tweet-handle">${tweetObject.user.handle}</label>
      </header>
      <p class = "tweet-content"> ${escape(tweetObject.content.text)}</p>
      <footer>
        <label class="days-ago">${daysSince} days ago</label>
        <label class="tweet-icons">⚐ ? ♡ </label>
      </footer>
    </article>
  `;

  return markup;
};

//render the markup created through createTweetElement
const renderTweets = tweets => {
  const markupArr = [];

  for (const tweetObject of tweets) {
    const tweetElement = createTweetElement(tweetObject);
    markupArr.push(tweetElement);
  }
  markupArr.reverse();
  $("#tweets-container").html(markupArr.join(" "));
};

//Ready the document
$(() => {
  const loadTweets = () => {
    $.get("/tweets", data => {
      renderTweets(data);
    });
  };
  loadTweets(); //<----- load tweets at the beginning
  $("form").submit(event => {
    event.preventDefault();
    $tweetText = $("#tweet-text");
    $error = $("#error-message");
    $error.slideUp("slow");
    if (!$tweetText.val()) {
      $error.text("❕❕❕ Your tweet is empty, please try again");
      $error.slideDown("slow");
      $error.css("display", "block");
    } else if ($tweetText.val().length > 140) {
      $error.text("❕❕❕ Your tweet exceeded the limit, please try again");
      $error.slideDown("slow");
      $error.css("display", "block");
    } else {
      const serializedTweet = $tweetText.serialize();
      $.post("/tweets/", serializedTweet, () => {
        //WHEN A POST IS MADE IT WILL EMPTY THE TEXT BOX AND LOAD TWEETS AGAIN
        $("#tweet-text").val("");
        loadTweets();
      });
    }
  });

  $button = $("nav").children("button");
  $button.click(() => {
    $(".new-tweet").slideToggle("slow");
    $("#tweet-text").focus();
  });
});
