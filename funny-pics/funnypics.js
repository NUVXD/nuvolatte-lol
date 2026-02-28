document.addEventListener('DOMContentLoaded', () => {
    // subreddit categories
    const subreddits = {
        memes: ["oldmemes", "dogelore"],
        cats: ["funnycats", "catmemes", "sillycats"],
    };
    // elements
    const image = document.getElementById("funnypics-image");
    const randomize = document.getElementById("funnypics-randomizeBtn");
    const openSource = document.getElementById("funnypics-openLink");
    const categorySelect = document.getElementById("funnypicsCategory");
    // options
    let category = categorySelect.value;
    // check if URL is an image
    function isImageUrl(url) {
        return /\.(jpeg|jpg|gif|png)$/i.test(url);
    }
    // batch arrays
    let currentBatch = [], nextBatch = [];
    // flags
    let preFetchAlreadyTriggered = false;
    // shuffle array
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    // fetch and filter batch
    async function fetchBatch(fetchCategory) {
        try {
            let posts = [];
            for (const sub of subreddits[fetchCategory]) {
                const response = await fetch("https://www.reddit.com/r/" + sub + "/hot.json?limit=50", { cache: "no-store", credentials: "omit", headers: { "User-Agent": "nuvolatte.lol" } });
                const data = await response.json();
                posts.push(...data.data.children.map(p => p.data).filter(p => p.url && isImageUrl(p.url)));
            }
            posts = shuffleArray(posts);
            return posts;
        } catch (err) {
            console.error(err);
            return [];
        }
    }
    // show next image
    async function fetchImage(fetchCategory) {
        if (!currentBatch.length) {
            currentBatch = await fetchBatch(fetchCategory);
            if (!currentBatch.length) {
                image.alt = "No images found, try again";
                return;
            }
        }
        const randomPost = currentBatch.pop();
        image.src = randomPost.url;
        image.alt = randomPost.title || "Random Image";
        openSource.href = randomPost.url;
        // pre-fetch next batch at halfway
        if (!preFetchAlreadyTriggered && currentBatch.length <= 37) {
            preFetchAlreadyTriggered = true;
            nextBatch = await fetchBatch(fetchCategory);
            console.log("pre-fetched next batch");
        }
        // swap batches if current exhausted
        if (!currentBatch.length && nextBatch.length) {
            currentBatch = nextBatch;
            nextBatch = [];
            preFetchAlreadyTriggered = false; // reset for the new batch
            console.log("current batch exhausted: swapping batch");
        }
    }
    // listeners
    categorySelect.addEventListener("input", async (e) => {
        category = e.target.value;
        currentBatch = [];
        nextBatch = [];
        preFetchAlreadyTriggered = false;
        await fetchImage(category);
    });
    randomize.addEventListener("click", () => fetchImage(category));
    // load image
    fetchImage(category);
});
