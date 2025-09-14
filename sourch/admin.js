const API_URL = "https://order-backend-o09t.onrender.com/api/product"; // change if local

const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

// Load products on page load
async function fetchProducts() {
  productList.innerHTML = "Loading products...";
  try {
    const res = await fetch(API_URL);
    const products = await res.json();

    if (products.length === 0) {
      productList.innerHTML = "<p>No products yet.</p>";
      return;
    }

    productList.innerHTML = products.map(p => `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p><b>Price:</b> OMR ${p.price.toFixed(2)}</p>
        <p><b>Category:</b> ${p.category}</p>
        <p>${p.description || ""}</p>
        <button onclick="deleteProduct('${p._id}')">🗑 Delete</button>
      </div>
    `).join("");
  } catch (err) {
    productList.innerHTML = "<p>❌ Error loading products</p>";
    console.error(err);
  }
}

// Add product
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const product = {
    name: document.getElementById("name").value,
    price: parseFloat(document.getElementById("price").value),
    category: document.getElementById("category").value,
    image: document.getElementById("image").value,
    description: document.getElementById("description").value,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      alert("✅ Product added!");
      productForm.reset();
      fetchProducts();
    } else {
      alert("❌ Failed to add product");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("❌ Error adding product");
  }
});

// Delete product
async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("🗑 Product deleted!");
      fetchProducts();
    } else {
      alert("❌ Failed to delete product");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error deleting product");
  }
}

// Run on load
fetchProducts();
