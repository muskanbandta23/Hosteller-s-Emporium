import React from 'react';
import './product_display.css'; // Import the CSS file
import axios from 'axios'
function ProductDisplay({ products }) {
  
  if (!products || products.length === 0) {
    return <div className="product_dispaly-no-products">No products available</div>;
  }
  const ProductSold = async function (id){
    const token = localStorage.getItem('authToken');
    console.log(id)
    try {
      const response = await axios.post('http://localhost:5000/ProductBuying',{
        Authorization: token,
        uniqueId : id
      })
      alert(response.data.msg)
      window.location.reload();
    }catch(err){
      alert(err)
    }
  }
  const DeleteProductFunction= async function(name){
    const token = localStorage.getItem('authToken');
    try{
      const response = await axios.post('http://localhost:5000/DeleteProduct',{
        Authorization: token,
        ProductName : name
      })
      alert(response.data.msg)
      window.location.reload();
    }catch(e){
      alert(e);
    }
  }
  return (
    <div className="product_display">
  {products.map(product => (
    <div key={product.id} className="product-item productchange">
      <div className="card">
        <div className="card-front">
          <h2 className="product_display-name">ProductName = {product.ProductName}</h2>
          <p className="product_display-Quantity productchange-item">Quantity = {product.Quantity}</p>
          <p className="product_display-price productchange-item">Price = ${product.Price}</p>
          <p className="product_display-extra productchange-item">Extra = {product.Extra}</p>
        </div>
        <div className="card-back">
          <button className='Delete-product' onClick={() => DeleteProductFunction(product.ProductName)}>Delete</button>
        </div>
      </div>
    </div>
  ))}
</div>


  );
}

export default ProductDisplay;

