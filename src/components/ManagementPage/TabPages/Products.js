import React, { useState } from 'react';
import axios from 'axios';

import { Modal } from 'react-bootstrap';



import './Items.styles.css';
const host = 'https://bubble-sort-drink.herokuapp.com/'

class ItemCard extends React.Component {

    constructor(props) {
        super(props);
        let item = this.props.item;
        this.state = {
            deleteShow: false,
            name: item.name,
            description: item.description,
            price: item.list_price,
            categoryData: item.category,
            category: parseInt(item.category.id),
            image: null,
            mode: 'view',
        }
    }


    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value
        })
      };
    
    handleImageChange = (e) => {
    this.setState({
        image: e.target.files[0]
    })
    };

    handleSubmit = () => {
    console.log(this.state);
    let form_data = new FormData();
    if (this.state.image !== null) {
        form_data.append('image', this.state.image, this.state.image.name);
    }
    form_data.append('name', this.state.name);
    form_data.append('description', this.state.description);
    form_data.append('list_price', this.state.price);
    form_data.append('category', parseInt(this.state.category));
    form_data.append('ratings', this.props.item.ratings);

    axios.put(host+`api/product/${this.props.item.id}/`, form_data, {
        headers: {
        'Content-type': 'multipart/form-data;'
        }
    })
        .then(res => {
            console.log(res.data);
            this.props.onAddRefresh();
        })
      };
    
    
    renderTableRow = () => {
        if (this.state.mode == 'view') {
            // console.log("this.state.category:", this.state.category)
            return(
                <>
                <td style={{'width': '5rem'}}><img src={this.props.item.image} style={{'width': '5rem', 'height':'5rem'}} /></td>
                <td style={{'width': '20rem'}}><span className="item-info item-name">{this.props.item.name}</span></td>
                <td style={{'width': '15rem'}}><span className="item-info item-category">{this.props.item.category.name}</span></td>
                <td><span className="item-info item-description">{this.props.item.description}</span></td>
                <td><span className="item-info item-price">${this.props.item.list_price}</span></td>
                <td className="products-buttons-container">
                <span style={{marginRight: '2rem'}} onClick={() => this.setState({mode: 'edit'})}><i style={{cursor: 'pointer'}} className="fas fa-pen"></i></span>
                <span onClick={() => this.setState({deleteShow: true})}><i style={{cursor: 'pointer'}} className="fas fa-trash-alt"></i></span>
                </td>
                </>
            )
        } if (this.state.mode == 'edit') {
            
            return (
                <>
                <td style={{'width': '5rem'}}>
                    <img src={this.props.item.image} style={{'width': '5rem', 'height':'5rem'}} />
                    <input type="file"
                            id="image"
                            accept="image/png, image/jpeg"
                            onChange={this.handleImageChange}/></td>
                <td style={{'width': '20rem'}}><input type="text" placeholder={this.state.name} id='name' value={this.state.name} onChange={this.handleChange} required/></td>
                <td style={{'width': '15rem'}}>
                    <select name='category' onChange={this.handleChange} required id="category">
                        {this.props.categories.map(category => {
                            if(category.id == this.state.categoryData.id){
                                return(
                                    <option value={category.id} selected>{category.name}</option>
                                )
                            } else {
                                return(
                                    <option value={category.id}>{category.name}</option>
                                )
                            }
                        }
                            )}
                    </select>
                </td>
                <td><input type="text" placeholder='Description' id='description' value={this.state.description} onChange={this.handleChange} required/></td>
                <td>$<input type="number" placeholder={this.state.list_price} id='price' value={this.state.price} onChange={this.handleChange} required/></td>
                <td className="products-buttons-container">
                <span style={{marginRight: '2rem'}} onClick={() => {
                    this.setState({mode: 'view'});
                    this.handleSubmit()}}><i style={{cursor: 'pointer'}} className="fas fa-check"></i></span>
                <span onClick={() => this.setState({deleteShow: true})}><i style={{cursor: 'pointer'}} className="fas fa-trash-alt"></i></span>
                </td>
               
                </>
            )
        }
    }



    render() {
    return(
        <>
        <tr className="item-card">
            {this.renderTableRow()}
        </tr>

            <Modal
            show={this.state.deleteShow}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                Are you sure?
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

            Do you want to delete {this.props.item.name}? 
            
            </Modal.Body>
            <Modal.Footer>
                <button onClick={() => {
                    this.setState({deleteShow: false})
                    this.props.handleDelete();
                }}>Yes,Delete</button>
                <button onClick={() => this.setState({deleteShow: false})}>No, Cancel</button>
            </Modal.Footer>
        </Modal>
        </>
    )
    }
}


class AddItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            name: '',
            description: '',
            price: 0,
            category: 'INITIAL',
            image: null
        }
    }

    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value
        })
      };
    
      handleImageChange = (e) => {
        this.setState({
          image: e.target.files[0]
        })
      };
    
      handleSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
        let form_data = new FormData();

        
        form_data.append('image', this.state.image, this.state.image.name);
        form_data.append('name', this.state.name);
        form_data.append('description', this.state.description);
        form_data.append('list_price', this.state.price);
        form_data.append('category', this.state.category);
        form_data.append('ratings', 0);

        axios.post(host+'api/product/', form_data, {
          headers: {
            'Content-type': 'multipart/form-data;'
          }
        })
            .then(res => {
              console.log(res.data);
              this.props.onAddRefresh();
            })
            .catch(err => console.log(err))
        
        this.setState({modalShow: false});
        
      };

    render() {
        return (
            <>
              <button className="manage-btn table-btn" onClick={() => this.setState({modalShow:true})}>
                ADD NEW PRODUCT
              </button>
        
              <Modal
                show={this.state.modalShow}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Add New Product
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                <form onSubmit={this.handleSubmit}>
                    <p>
                        Product Name: <br />
                        <input type="text" placeholder='Name' id='name' value={this.state.name} onChange={this.handleChange} required/>
                    </p>
                    <p>
                        Description: <br />
                        <input type="text" placeholder='Description' id='description' value={this.state.description} onChange={this.handleChange} required/>
    
                    </p>
                    <p>
                        Price: <br />
                        <input type="number" placeholder='Price' id='price' value={this.state.price} onChange={this.handleChange} required/>
    
                    </p>
                    <p>
                        Category: <br />
                        <select name='category' onChange={this.handleChange} required id="category">
                            <option value>-----</option>
                            {this.props.categories.map(category => 
                                <option value={category.id}>{category.name}</option>)}
                        </select>
                    </p>
                    <p>
                        Image: <br />
                        <input type="file"
                            id="image"
                            accept="image/png, image/jpeg"  onChange={this.handleImageChange} required/>
                    </p>
                    <input type="submit" />
                </form>
    
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => this.setState({modalShow: false})}>Close</button>
                </Modal.Footer>
            </Modal>
            </>
          );
    }
    
}

class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            categories: [],
        }
    }


    componentDidMount() {
        axios.get(host+'api/category/')
            .then((response) => {
                this.setState({
                    categories: response.data,
                });
            });
         
        axios.get(host+'api/product/')
            .then((response) => {
                this.setState({products: response.data.sort((a,b) => a.id - b.id)});
            });
    }

    handleAdd = () => {
        axios.get(host+'api/product/')
            .then((response) => {
                this.setState({
                    products: response.data.sort((a,b) => a.id - b.id)
                });
            });
    }


    handleDelete = (id, index) => {
        axios.delete(host+`api/product/${id}/`)
            .then(response => {
                console.log(response); 
                this.setState({
                    products: this.state.products.filter((_, i) => i !== index)
                })
            })
    }

    render() {
        return(
            <div className="item-page">
                <h1 className="page-name">Products</h1>
                <AddItem
                    categories={this.state.categories} 
                    onAddRefresh = {this.handleAdd}/>
                <table className="product-table">
                    <tbody>
                    {this.state.products.map((item, index) => (
                        <ItemCard 
                            onAddRefresh = {this.handleAdd}
                            categories={this.state.categories}
                            item={item} 
                            handleDelete={() => {
                                console.log('deleting:', item)
                                this.handleDelete(item.id, index)}}/>
                    ))}   
                    </tbody>
                </table>
               
            </div>
       
        )
    }
} 
   


export default Products;