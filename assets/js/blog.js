const blogPosts = [
    {
        id: "1",
        title: "Getting Started with React and TypeScript",
        excerpt: "Learn how to set up a new React project with TypeScript and understand the basics of type-safe component development.",
        date: "2025-04-15",
        url: "https://medium.com/your-username/getting-started-with-react-typescript"
    },
    {
        id: "2",
        title: "Building Responsive Layouts with Tailwind CSS",
        excerpt: "Explore the power of Tailwind CSS for creating beautiful, responsive web layouts without writing custom CSS.",
        date: "2025-04-10",
        url: "https://medium.com/your-username/building-with-tailwindcss"
    },
    {
        id: "3",
        title: "Modern State Management in React",
        excerpt: "A deep dive into different state management approaches in React, from useState to Redux and everything in between.",
        date: "2025-04-05",
        url: "https://medium.com/your-username/react-state-management"
    }
];

function createBlogCard(post) {
    return `
        <article class="blog-card">
            <h2>${post.title}</h2>
            <p class="date">${new Date(post.date).toLocaleDateString()}</p>
            <p>${post.excerpt}</p>
            <a href="${post.url}" target="_blank" rel="noopener noreferrer">Read More →</a>
        </article>
    `;
}

function renderBlogPosts(posts) {
    const blogContainer = document.getElementById('blogPosts');
    blogContainer.innerHTML = posts.map(post => createBlogCard(post)).join('');
}

function filterPosts(searchTerm) {
    const filteredPosts = blogPosts.filter(post => {
        const searchContent = `${post.title} ${post.excerpt}`.toLowerCase();
        return searchContent.includes(searchTerm.toLowerCase());
    });
    renderBlogPosts(filteredPosts);
}

document.addEventListener('DOMContentLoaded', () => {
    renderBlogPosts(blogPosts);

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        filterPosts(e.target.value);
    });
});
