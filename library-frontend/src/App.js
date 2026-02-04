// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css'; 

// function App() {
//   const [books, setBooks] = useState([]);
//   const [formData, setFormData] = useState({ title: '', author: '', isbn: '', total_qty: 1 });

//   useEffect(() => { fetchBooks(); }, []);

//   const fetchBooks = async () => {
//     try {
//       const res = await axios.get('http://localhost:5001/api/inventory/books');
//       setBooks(res.data.data || res.data);
//     } catch (err) { console.error("Error fetching books:", err); }
//   };

//   // const handleAddBook = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const bookData = { ...formData, total_qty: parseInt(formData.total_qty) };
//   //     await axios.post('http://localhost:5001/api/inventory/admin/books', bookData);
//   //     setFormData({ title: '', author: '', isbn: '', total_qty: 1 });
//   //     fetchBooks();
//   //   } catch (err) { alert("ISBN already exists!"); }
//   // };
//   const handleAddBook = async (e) => {
//   e.preventDefault();
//   try {
//     const bookData = { ...formData, total_qty: parseInt(formData.total_qty) };
//     await axios.post('http://localhost:5001/api/inventory/admin/books', bookData);
    
//     alert("Book added successfully!");
//     fetchBooks(); // Refresh list
//   } catch (err) {
//     console.error("Add error:", err.response?.data || err.message);
//     alert("Failed to add book. This ISBN already exists in the NIT Trichy database.");
//   } finally {
//     setFormData({ title: '', author: '', isbn: '', total_qty: 1 });
//   }
// };

//   const handleIssue = async (id) => {
//     try {
//       await axios.patch(`http://localhost:5001/api/inventory/books/issue/${id}`);
//       fetchBooks();
//     } catch (err) { alert("Out of stock!"); }
//   };

//   const handleReturn = async (id) => {
//     try {
//       await axios.patch(`http://localhost:5001/api/inventory/books/return/${id}`);
//       fetchBooks();
//     } catch (err) {
//       alert("Check if the book count is already at its maximum.");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Remove this book?")) {
//       await axios.delete(`http://localhost:5001/api/inventory/admin/books/${id}`);
//       fetchBooks();
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="header">
//         <div>
//           <h1>NIT Trichy</h1>
//           <span style={{color: 'var(--text-muted)'}}>Library Management System</span>
//         </div>
//         <div className="card" style={{padding: '10px 20px'}}>
//           <strong>Total Books: {books.length}</strong>
//         </div>
//       </div>

//       <div className="main-grid">
//         <div className="card">
//           <h2 style={{marginTop: 0}}>Add Book</h2>
//           <form onSubmit={handleAddBook}>
//             <div className="form-group">
//               <label>Title</label>
//               <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
//             </div>
//             <div className="form-group">
//               <label>Author</label>
//               <input value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
//             </div>
//             <div className="form-group">
//               <label>ISBN</label>
//               <input value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} required />
//             </div>
//             <div className="form-group">
//               <label>Quantity</label>
//               <input type="number" value={formData.total_qty} onChange={e => setFormData({...formData, total_qty: e.target.value})} required />
//             </div>
//             <button type="submit" className="btn-primary">Add to Inventory</button>
//           </form>
//         </div>

//         <div className="card">
//           <table>
//             <thead>
//               <tr>
//                 <th>Book Info</th>
//                 <th>Availability</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {books.map(book => (
//                 <tr key={book.id}>
//                   <td>
//                     <div style={{fontWeight: 'bold'}}>{book.title}</div>
//                     <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>By {book.author}</div>
//                   </td>
//                   <td>
//                     <span className={`badge ${book.available_qty > 0 ? 'badge-success' : 'badge-danger'}`}>
//                       {book.available_qty} / {book.total_qty}
//                     </span>
//                   </td>
//                   <td className="action-btns">
//                     {/* Updated Buttons */}
//                     <button className="btn-action" onClick={() => handleIssue(book.id)}>Issue</button>
//                     <button 
//                       className="btn-action" 
//                       style={{borderColor: 'var(--success)', color: 'var(--success)'}} 
//                       onClick={() => handleReturn(book.id)}
//                     >
//                       Return
//                     </button>
//                     <button className="btn-action btn-delete" onClick={() => handleDelete(book.id)}>Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

// Microservices Configuration
// Each port corresponds to a different container in your docker-compose
const SERVICES = {
  // ADD: 'http://localhost:5001/api/books',
  ADD: 'http://localhost:5001/api/books',
  DELETE: 'http://localhost:5002/api/books',
  TRANSACT: 'http://localhost:5003/api/books',
  VIEW: 'http://localhost:5004/api/books'
};

function App() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({ title: '', author: '', isbn: '', total_qty: 1 });

  // Initial data load
  useEffect(() => { 
    fetchBooks(); 
  }, []);

  // 1. VIEW SERVICE (Port 5004) - Fetches the full list
  const fetchBooks = async () => {
    try {
      const res = await axios.get(SERVICES.VIEW);
      // Since each service is clean, res.data is likely the direct array
      setBooks(res.data); 
    } catch (err) { 
      console.error("Error fetching books:", err); 
    }
  };

  // 2. ADD SERVICE (Port 5001) - Inserts a new book
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const bookData = { ...formData, total_qty: parseInt(formData.total_qty) };
      await axios.post(SERVICES.ADD, bookData);
      
      alert("Book added successfully!");
      fetchBooks(); // Refresh table
    } catch (err) {
      console.error("Add error:", err.response?.data || err.message);
      alert("Failed to add book. Check if the ISBN already exists.");
    } finally {
      // Clear form regardless of outcome
      setFormData({ title: '', author: '', isbn: '', total_qty: 1 });
    }
  };

  // 3. TRANSACTION SERVICE - ISSUE (Port 5003) - Decrements quantity
  const handleIssue = async (id) => {
    try {
      await axios.patch(`${SERVICES.TRANSACT}/issue/${id}`);
      fetchBooks();
    } catch (err) { 
      alert("Out of stock or book not found!"); 
    }
  };

  // 4. TRANSACTION SERVICE - RETURN (Port 5003) - Increments quantity
  const handleReturn = async (id) => {
    try {
      await axios.patch(`${SERVICES.TRANSACT}/return/${id}`);
      fetchBooks();
    } catch (err) {
      alert("Cannot return: Book count is already at maximum or book not found.");
    }
  };

  // 5. DELETE SERVICE (Port 5002) - Removes book from DB
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this book from the NIT Trichy library?")) {
      try {
        await axios.delete(`${SERVICES.DELETE}/${id}`);
        fetchBooks();
      } catch (err) { 
        alert("Error deleting book."); 
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <div>
          <h1>NIT Trichy</h1>
          <span style={{color: 'var(--text-muted)'}}>Library Management System (Microservices)</span>
        </div>
        <div className="card" style={{padding: '10px 20px'}}>
          <strong>Total Books in Catalog: {books.length}</strong>
        </div>
      </div>

      <div className="main-grid">
        {/* Left Side: Add Form */}
        <div className="card">
          <h2 style={{marginTop: 0}}>Add New Title</h2>
          <form onSubmit={handleAddBook}>
            <div className="form-group">
              <label>Book Title</label>
              <input 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input 
                value={formData.author} 
                onChange={e => setFormData({...formData, author: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>ISBN</label>
              <input 
                value={formData.isbn} 
                onChange={e => setFormData({...formData, isbn: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Total Quantity</label>
              <input 
                type="number" 
                min="1"
                value={formData.total_qty} 
                onChange={e => setFormData({...formData, total_qty: e.target.value})} 
                required 
              />
            </div>
            <button type="submit" className="btn-primary">Add to Inventory</button>
          </form>
        </div>

        {/* Right Side: Inventory Table */}
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Book Details</th>
                <th>Status</th>
                <th>Manage Inventory</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td>
                    <div style={{fontWeight: 'bold'}}>{book.title}</div>
                    <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>ISBN: {book.isbn} | By {book.author}</div>
                  </td>
                  <td>
                    <span className={`badge ${book.available_qty > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {book.available_qty} / {book.total_qty} Available
                    </span>
                  </td>
                  <td className="action-btns">
                    <button 
                      className="btn-action" 
                      onClick={() => handleIssue(book.id)}
                      disabled={book.available_qty <= 0}
                    >
                      Issue
                    </button>
                    <button 
                      className="btn-action" 
                      style={{borderColor: 'var(--success)', color: 'var(--success)'}} 
                      onClick={() => handleReturn(book.id)}
                      disabled={book.available_qty >= book.total_qty}
                    >
                      Return
                    </button>
                    <button 
                      className="btn-action btn-delete" 
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {books.length === 0 && <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>No books found in the inventory.</p>}
        </div>
      </div>
    </div>
  );
}

export default App;