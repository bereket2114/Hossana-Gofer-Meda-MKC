const likesCas = document.querySelectorAll('.like-btn')

Array.from(likesCas).forEach(el=>{
    el.addEventListener('click', likeComments)
})

// JS function for my back-end logic below here

async function likeComments(event) {
    if (event) event.preventDefault();

    // 1. Find the button, even if you click the heart icon inside it
    const button = event.target.closest('.like-btn');
    
    if (!button) {
        console.error("Like button not found.");
        return;
    }

    // 2. Grab the data-id from the button
    const commentLikes = button.getAttribute('data-id');

    console.log("Found Comment ID:", commentLikes); 

    try {
        // 3. Send the request to your backend route
        const result = await fetch('/comment/likeComment', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                likeComment: commentLikes
            })
        });
        
        const data = await result.json();
        console.log("Server response:", data);
        
        // 4. Reload to update the UI count
        location.reload(); 
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}