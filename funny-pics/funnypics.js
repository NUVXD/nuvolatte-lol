document.addEventListener('DOMContentLoaded', () => {
// elements
const image = document.getElementById("funnypics-image");
const randomize = document.getElementById("funnypics-randomizeBtn");
const openSource = document.getElementById("funnypics-openLink");

// subreddit categories
const subreddits = {
    memes: ["oldmemes", "dogelore"],
    cats: ["funnycats", "catmemes", "sillycats"]
};

// check if URL is an image
function isImageUrl(url) {
    return /\.(jpeg|jpg|gif|png)$/i.test(url);
}

// fetch one random image from a subreddit category
async function fetchImage(category = "memes") {
    image.src = "";
    image.href = "404.html";
    image.alt = "Loading...";
    try {
        const subs = subreddits[category];
        const randomSub = subs[Math.floor(Math.random() * subs.length)];
        const response = await fetch("https://www.reddit.com/r/" + randomSub + "/hot.json?limit=75");
        const data = await response.json();

        // filter for image posts
        const posts = data.data.children
            .map(post => post.data)
            .filter(post => post.url && isImageUrl(post.url));

        if (posts.length === 0) {
            image.alt = "No images found, try again";
            return;
        }

        const randomPost = posts[Math.floor(Math.random() * posts.length)];
        image.src = randomPost.url;
        image.alt = randomPost.title || "Random Image";
        openSource.href = randomPost.url;
    } catch (err) {
        image.alt = "Failed to load image";
        console.error(err);
    }
}

// load image
randomize.addEventListener("click", () => fetchImage("memes"));
fetchImage();
});
