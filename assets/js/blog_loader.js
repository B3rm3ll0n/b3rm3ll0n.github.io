document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("post-grid");

    fetch("./assets/posts/posts.json")
        .then(res => res.json())
        .then(posts => {
            posts.forEach(post => {
                const card = document.createElement("article");
                card.className = "post-card";

                card.innerHTML = `
                    <a href="${post.url}" class="post-link">
                        <img src="${post.image}" alt="${post.title}" class="post-thumb">
                        <h2>${post.title}</h2>
                        <p>${post.excerpt}</p>
                    </a>
                `;

                grid.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Error al cargar los posts:", err);
            grid.innerHTML = `<p style="color:#f55;">No se pudieron cargar los posts.</p>`;
        });
});
