document.addEventListener('DOMContentLoaded', () => {
    const blogGrid = document.getElementById('blog-grid');
    const apiUrl = 'http://localhost:5000/blogs';

    // Fetch blog posts from json-server
    async function fetchBlogs() {
        try {
            const response = await fetch(apiUrl);
            const blogs = await response.json();
            renderBlogs(blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    }

    // Function to render blog cards
    function renderBlogs(blogs) {
        blogGrid.innerHTML = '';
        blogs.forEach(blog => {
            const article = document.createElement('article');
            article.innerHTML = `
                <img src="${blog.image}" alt="${blog.title}">
                <h2>${blog.title}</h2>
                <p>${blog.description}</p>
                <button class="like-button" data-id="${blog.id}">
                    ❤️ <span>${blog.likes}</span>
                </button>
            `;
            blogGrid.appendChild(article);
        });
    }

    // Handle like button clicks
    async function handleLikeButtonClick(e) {
        if (e.target.matches('.like-button, .like-button *')) {
            const button = e.target.closest('.like-button');
            const id = button.getAttribute('data-id');
            try {
                // Fetch the blog post
                const response = await fetch(`${apiUrl}/${id}`);
                const blog = await response.json();
                blog.likes += 1;

                // Update the blog post
                await fetch(`${apiUrl}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(blog)
                });

                // Update the like count on the page
                button.querySelector('span').textContent = blog.likes;
            } catch (error) {
                console.error('Error updating like count:', error);
            }
        }
    }

    fetchBlogs();

    document.addEventListener('click', handleLikeButtonClick);
});