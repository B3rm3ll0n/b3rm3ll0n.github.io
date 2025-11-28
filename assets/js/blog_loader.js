document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("post-grid");
    const searchInput = document.getElementById("post-search");

    let postsData = [];

    function renderPosts(posts) {
        container.innerHTML = posts.map(post => `
            <article class="post-card">
                <a href="${post.url}">
                    <img src="${post.thumbnail}" class="post-thumb" alt="Imagen de ${post.title}">
                    <h2>${post.title}</h2>
                    <p>${post.description}</p>
                </a>
            </article>
        `).join("");
    }

    // Cargar los posts
    fetch("./assets/posts/posts.json")
        .then(res => res.json())
        .then(posts => {
            postsData = posts;
            renderPosts(postsData);
        })
        .catch(err => {
            console.error("Error cargando posts:", err);
            container.innerHTML = "<p>No se pudieron cargar los posts.</p>";
        });

    // Buscador
    searchInput.addEventListener("input", () => {
        const term = searchInput.value.toLowerCase();

        const filtered = postsData.filter(post =>
            post.title.toLowerCase().includes(term) ||
            post.description.toLowerCase().includes(term)
        );

        renderPosts(filtered);
    });
});
