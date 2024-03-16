document.addEventListener('DOMContentLoaded', () => {
    const snippetsContainer = document.getElementById('snippets');
    const fetchBestButton = document.getElementById('fetchBest');
    const fetchLatestButton = document.getElementById('fetchLatest');
    const addNewButton = document.getElementById('addNew');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close');
    const saveButton = document.getElementById('saveSnippet');
    const uploadSnippetBtn = document.getElementById('uploadSnippetBtn');
    const snippetTitleInput = document.getElementById('snippetTitle');
    const snippetContentInput = document.getElementById('snippetContent');

    // Event listeners
    fetchBestButton.addEventListener('click', fetchBestSnippets);
    fetchLatestButton.addEventListener('click', fetchLatestSnippets);
    addNewButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', closeOutsideModal);
    saveButton.addEventListener('click', saveSnippet);
    uploadSnippetBtn.addEventListener('click', uploadSnippet);

    // Fetch latest snippets on page load
    fetchLatestSnippets();

    // Function to fetch best snippets
    async function fetchBestSnippets() {
        try {
            const response = await fetch('https://www.forverkliga.se/JavaScript/api/api-snippets.php?best');
            const snippets = await response.json();
            displaySnippets(snippets);
        } catch (error) {
            console.error('Error fetching best snippets:', error);
            alert('An error occurred while fetching the best snippets.');
        }
    }

    // Function to fetch latest snippets
    async function fetchLatestSnippets() {
        try {
            const response = await fetch('https://www.forverkliga.se/JavaScript/api/api-snippets.php?latest');
            const snippets = await response.json();
            displaySnippets(snippets);
        } catch (error) {
            console.error('Error fetching latest snippets:', error);
            alert('An error occurred while fetching the latest snippets.');
        }
    }

 // Function to display snippets
function displaySnippets(snippets) {
    snippetsContainer.innerHTML = '';
    snippets.forEach(snippet => {
        const snippetDiv = document.createElement('div');
        snippetDiv.classList.add('snippet');

        const snippetTitle = document.createElement('h3');
        snippetTitle.textContent = snippet.title;
        snippetTitle.classList.add('snippet-title')

        const snippetContent = document.createElement('p');
        snippetContent.textContent = snippet.content;
        snippetContent.classList.add('snippet-content');

        const snipperScore = document.createElement('p');
        snipperScore.textContent = `Score: ${snippet.score}`; 

        // Create the like button
        const likeButton = document.createElement('button');
        likeButton.textContent = '👍 Like';
        likeButton.addEventListener('click', () => likeSnippet(snippet.id)); 

        // Create the dislike button
        const dislikeButton = document.createElement('button');
        dislikeButton.textContent = '👎 Dislike';
        dislikeButton.addEventListener('click', () => dislikeSnippet(snippet.id)); 

        // Create the trash
        const deleteIcon = document.createElement('span');
        deleteIcon.textContent = '🗑️';
        deleteIcon.classList.add('delete-icon');
        deleteIcon.addEventListener('click', () => deleteSnippet(snippet.id)); 

        snippetDiv.appendChild(snippetTitle);
        snippetDiv.appendChild(snippetContent);
        snippetDiv.appendChild(snipperScore); 
        snippetDiv.appendChild(likeButton);
        snippetDiv.appendChild(dislikeButton);
        snippetDiv.appendChild(deleteIcon); 
        snippetsContainer.appendChild(snippetDiv);
    });
}

 // Function to handle liking a snippet
async function likeSnippet(id) {
    try {
        const response = await fetch(`https://www.forverkliga.se/JavaScript/api/api-snippets.php?id=${id}&like=true`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                upvote: '',
                like: true
            })   
        });
        const result = await response.json();
        if (result.status === 'success') {
            fetchLatestSnippets(); // Update the snippets after liking
        } else {
            console.error('Error liking snippet:', result.message);
            alert('An error occurred while liking the snippet.');
        }
    } catch (error) {
        console.error('Error liking snippet:', error);
        alert('An error occurred while liking the snippet.');
    }
}

// Function to handle disliking a snippet
async function dislikeSnippet(id) {
    try {
        const response = await fetch(`https://www.forverkliga.se/JavaScript/api/api-snippets.php?id=${id}&dislike=true`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                downvote: '',
                dislike: true
            })   
        });
        const result = await response.json();
        if (result.status === 'success') {
            fetchLatestSnippets(); // Update the snippets after disliking
        } else {
            console.error('Error disliking snippet:', result.message);
            alert('An error occurred while disliking the snippet.');
        }
    } catch (error) {
        console.error('Error disliking snippet:', error);
        alert('An error occurred while disliking the snippet.');
    }
}


    // Function to delete a snippet
    async function deleteSnippet(id) {
        try {
            const response = await fetch(`https://www.forverkliga.se/JavaScript/api/api-snippets.php?id=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    delete: true
                })   
            });
            const result = await response.json();
            if (result.status === 'success') {
                fetchLatestSnippets(); // Update the snippets after deleting
            } else {
                console.error('Error deleting snippet:', result.message);
                alert('An error occurred while deleting the snippet.');
            }
        } catch (error) {
            console.error('Error deleting snippet:', error);
            alert('An error occurred while deleting the snippet.');
        }
    }

    // Function to open modal
    function openModal() {
        modal.style.display = 'block';
        snippetTitleInput.value = ''; 
        snippetContentInput.value = ''; 
    }

    // Function to close modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Function to close modal when clicked outside
    function closeOutsideModal(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Function to save snippet
    function saveSnippet() {
        const title = snippetTitleInput.value;
        const content = snippetContentInput.value;

        if (title.trim() === '' || content.trim() === '') {
            alert('Please enter both title and content.');
            return;
        }

        addNewSnippet(title, content);
        closeModal();
    }

    // Function to upload snippet
    async function uploadSnippet() {
        const title = snippetTitleInput.value;
        const content = snippetContentInput.value;
    
        if (title.trim() === '' || content.trim() === '') {
            alert('Please enter both title and content.');
            return;
        }
    
        addNewSnippet(title, content);
    }

    // Function to add new snippet
    async function addNewSnippet(title, content) {
        try {
            const response = await fetch('https://www.forverkliga.se/JavaScript/api/api-snippets.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    add: '',
                    title: title,
                    content: content
                })
            });
            const result = await response.json();
            if (result.status === 'success') {
                closeModal();
                fetchLatestSnippets(); // Update the snippets after adding new one
            } else {
                console.error('Error adding new snippet:', result.message);
                alert('An error occurred while adding the new snippet.');
            }
        } catch (error) {
            console.error('Error adding new snippet:', error);
            alert('An error occurred while adding the new snippet.');
        }
    }
});
