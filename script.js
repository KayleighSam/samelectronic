// ---------------Define the API base URL---------------------------
const dbUrl = 'https://samelectronic.onrender.com/products';


// ----------------Fetch products and display them-------------------
const fetchProducts = () => {
    fetch(dbUrl)
        .then(response => response.json())
        .then(products => displayProducts(products))
        .catch(error => console.error('Error fetching products:', error));
};

// ---------------Add a new product-----------------------------------------
const addForm = document.getElementById("add_electronic_form");
addForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").value;
    const date = document.getElementById("date").value;
    const quantity = document.getElementById("quantity").value;
    fetch(dbUrl, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            title: title,
            description: description,
            price: price,
            image: image,
            date: date,
            quantity: quantity,
        }),
    })
    .then(response => response.json())
    .then(() => {
        // ------------Reset form after successful submission-------------
        addForm.reset();
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide();
        // Reload products
        fetchProducts();
    })
    .catch(error => console.error('Error adding product:', error));
});

// --------------------Display products on the page----------------
const displayProducts = (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Clear current product list

    products.forEach(product => {
        const productCard = `
        <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">Price: Ksh ${product.price}</p>
                    <p class="card-text">date:  ${product.date}</p>
                    <p class="card-text">quantity:  ${product.quantity}</p>
                    <button class="btn btn-primary view-details" data-id="${product.id}">View Details</button>

<button onclick="editelectronic('${(product.id)}')" class="btn btn-warning ">Update</buton>

                    <button class="btn btn-danger delete-product" data-id="${product.id}">Delete</button>
                </div>
            </div>
        </div>
        `;
        productList.innerHTML += productCard;
    });

    // ------------Attach event listeners for "View Details" buttons-----------
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', event => {
            const productId = event.target.getAttribute('data-id');
            viewProductDetails(productId);
        });
    });



    const dbUrl = 'https://samelectronic.onrender.com/products'; // Path to your db.json file

    // --------------Function to fetch and calculate total quantity-----------
    const fetchTotalQuantity = async () => {
        try {
            const response = await fetch(dbUrl);
            const products = await response.json();
            
            //----------Calculate total quantity------------
            const totalQuantity = products.reduce((acc, product) => acc + Number(product.quantity), 0);

            
            //----------- Update the quantity in the HTML--------------
            document.getElementById('totalQuantity').innerText = totalQuantity;
        } catch (error) {
            console.error('Error fetching the products:', error);
        }
    };

    // Call the function to fetch total quantity when the page loads
    window.onload = fetchTotalQuantity;
  
    // Attach event listeners for "Delete" buttons
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', event => {
            const productId = event.target.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
};

// ---------------------------View product details----------------
const viewProductDetails = (productId) => {
    fetch(`${dbUrl}/${productId}`)
        .then(response => response.json())
        .then(product => {
            if (product) {
                document.getElementById('modalProductImage').src = product.image;
                document.getElementById('modalProductTitle').textContent = product.title;
                document.getElementById('modalProductDescription').textContent = product.description;
                document.getElementById('modalProductDate').textContent = product.date;
                document.getElementById('modalProductPrice').textContent = `Ksh ${product.price}`;
                document.getElementById('modalProductQuantity').textContent = product.quantity;


                // Show modal
                const productModal = new bootstrap.Modal(document.getElementById('productModal'));
                productModal.show();
            }
        })
        .catch(error => console.error('Error fetching product details:', error));
};

// ---------------Edit a product--------------------

function editelectronic(id)
{
  fetch(`https://samelectronic.onrender.com/products/${id}`)
  .then((res) => res.json())
  .then((data) => {

    const edit_container = document.getElementById("edit_container")

    edit_container.innerHTML = `
                   <h5>Edit Products</h5>
                <div id="update_message" class="text-success" role="alert">
                       
                </div>
                <form id="update_electronic_form">
                  <div class="mb-3">
                   <lable></lable> <input type="text" class="form-control" id="edit_title" value="${data.title}" required placeholder="Title" >
                  </div>
                  <div class="mb-3">
                    <input type="text" class="form-control" id="edit_imageUrl" value="${image}" required placeholder="Image" >
                  </div>
        
                  <div class="mb-3">
                    <input type="number" class="form-control" id="edit_price" value="${data.price}" required placeholder="price" >
                  </div>
        
                  <div class="mb-3">
                    <input type="date" class="form-control" id="edit_date" value="${data.date}" required placeholder="Date" >
                  </div>
                   <div class="mb-3">
                    <input type="number" class="form-control" id="edit_quantity" value="${data.quantity}" required placeholder="Quantity" >
                  </div>
        
                  <div class="mb-3">
                    <textarea type="text" rows="4" placeholder="Description"  required class="form-control"  id="edit_description" > ${data.description} </textarea>
                  </div>
             
                
                  <button type="submit" class="btn btn-primary">Update</button>
                  
                </form>

                
    `
    //---------------------------updating the records--------------
    const edit_form = document.getElementById("update_electronic_form");

    edit_form.addEventListener("submit", (event)=>{
        event.preventDefault();
        const title = document.getElementById("edit_title").value;
        const description = document.getElementById("edit_description").value;
        const image = document.getElementById("edit_imageUrl").value;
        const price = document.getElementById("edit_price").value;
        const date = document.getElementById("edit_date").value;
        const quantity = document.getElementById("edit_quantity").value;
  
  
        fetch(`https://samelectronic.onrender.com/products/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: title,
            content: description,
            image: image,
            price: price,
            date: date,
            quantity: quantity,
            
            
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then((response) => response.json())
          .then((res) => {
            const update_message = document.getElementById("update_message");
            update_message.innerText = "electronic Updated Successfully"
  
            
          });
 
    })

   
      
  })
}


// ----------------------------Delete a product---------------------
const deleteProduct = (productId) => {
    fetch(`${dbUrl}/${productId}`, {
        method: 'DELETE',
    })
    .then(() => {
        fetchProducts(); // Reload the product list after deleting
    })
    .catch(error => console.error('Error deleting product:', error));
};

// Search functionality
document.getElementById('searchInput').addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase();
    fetch(dbUrl)
        .then(response => response.json())
        .then(products => {
            const filteredProducts = products.filter(product => 
                product.title.toLowerCase().includes(searchQuery)
            );
            displayProducts(filteredProducts);
        })
        .catch(error => console.error('Error searching products:', error));
});

// -----------------Initialize products on page load--------------------
fetchProducts();

    //--------------- Search functionality------------------------------
    document.getElementById('searchInput').addEventListener('input', function() {
        const searchQuery = this.value.toLowerCase();
        fetch(dbUrl)
            .then(response => response.json())
            .then(products => {
                const filteredProducts = products.filter(product => 
                    product.title.toLowerCase().includes(searchQuery)
                );
                displayProducts(filteredProducts);
            });
    });
    

