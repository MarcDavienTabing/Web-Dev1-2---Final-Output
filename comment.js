
const API_URL = "https://jsonplaceholder.typicode.com";

// Get HTML elements
const commentForm = document.getElementById("commentForm");
const commentList = document.getElementById("commentList");
const message = document.getElementById("message");
const loading = document.getElementById("loading");
const submitBtn = document.getElementById("submitBtn");

// Display a comment
function displayComment(name, email, body) {

    const commentDiv = document.createElement("div");
    commentDiv.className = "comment-item";

    const heading = document.createElement("h3");
    heading.textContent = name;

    const emailText = document.createElement("p");
    emailText.className = "comment-email";
    emailText.textContent = email;

    const commentText = document.createElement("p");
    commentText.textContent = body;

    commentDiv.appendChild(heading);
    commentDiv.appendChild(emailText);
    commentDiv.appendChild(commentText);

    commentList.prepend(commentDiv);
}

// GET: Load comments from public API
async function loadComments() {

    try {

        const response = await fetch(
            `${API_URL}/posts/1/comments`
        );

        if (!response.ok) {
            throw new Error("Failed to load comments.");
        }

        const comments = await response.json();

        loading.style.display = "none";

        comments.forEach(comment => {

            displayComment(
                comment.name,
                comment.email,
                comment.body
            );

        });

    } catch (error) {

        loading.textContent = "Unable to load comments.";

        console.error(error);

    }

}

// POST: Submit a new comment
commentForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const body = document.getElementById("comment").value.trim();

    if (!name || !email || !body) {
        message.textContent = "Please fill in all fields.";
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {

        const response = await fetch(`${API_URL}/comments`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                postId: 1,
                name: name,
                email: email,
                body: body

            })

        });

        if (!response.ok) {
            throw new Error("Failed to submit comment.");
        }

        const newComment = await response.json();

        // Display submitted comment immediately
        displayComment(
            newComment.name,
            newComment.email,
            newComment.body
        );

        message.textContent = "Your comment was submitted successfully!";

        commentForm.reset();

    } catch (error) {

        message.textContent = "Something went wrong. Please try again.";

        console.error(error);

    } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Comment";

    }

});

// Load comments when page opens
loadComments();
