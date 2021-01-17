import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Modal } from 'react-bootstrap';

import './Categories.styles.css';
import host from '../../common/Host'

import {
    sortableContainer,
    sortableElement,
    sortableHandle,
  } from 'react-sortable-hoc';
import arrayMove from 'array-move';


// sortable products

const SortableProductItem = sortableElement(({product}) => (
    <li>
        <div className="category category-product">
            <DragHandle />
            {product.name}
        <span style={{float: 'right', color: 'black'}}> ${product.list_price}</span>
        </div>
    </li>
))


// sortable category

const DragHandle = sortableHandle(() => <span className="category-handle"><i className="fas fa-grip-lines"></i></span>);

const SortableItem = sortableElement(({category, products, handleDelete}, ref) => {


    const [show, setShow] = useState(false);
    const [expand, setExpand] = useState(false);
    const [cProducts, setCProducts] = useState(products);
    const [edit, setEdit] = useState(false);

    const [deleteShow, setDeleteShow] = useState(false);

    const [cName, setCName] = useState(category.name)

    const onSortEnd = ({oldIndex, newIndex}) => {
        const id = cProducts[oldIndex].id
        setCProducts(arrayMove(cProducts, oldIndex, newIndex))

        const json = JSON.stringify({'order': newIndex + 1})
        axios.post(host+`product/${id}/move/`, json, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const handleExpand = () => {
        setShow(!show);
        setExpand(!expand)
    }

    const handleChange = (e) => {
        setCName(e.target.value);
    }

    const handleEdit = () => {
        if(edit==false){
            setEdit(true)
        } else{
            const json = JSON.stringify({'name': cName})
            axios.put(host+`api/category/${category.id}/`, json, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            setEdit(false)
        }
        
    }

    const renderName = () => {
        if (edit == false){
            return(
                <>
                <span>{cName}</span>
                <span style={{marginLeft: '2rem'}} onClick={handleEdit}><i style={{cursor: 'pointer'}} className="fas fa-pen"></i></span>
                </>
            )
        } else {
            return(
                <>
                <input onChange={handleChange} type='text' value={cName} />
                <span style={{marginLeft: '2rem'}} onClick={handleEdit}><i style={{cursor: 'pointer'}} className="fas fa-check"></i></span>
                </>
            )
        }
    }

    return(
        <>
        <li>
            <div className="category">
                <DragHandle />
                {renderName()}
                
                <span style={{marginLeft: '1rem'}} onClick={() => setDeleteShow(true)}><i style={{cursor: 'pointer'}} className="fas fa-trash-alt"></i></span>                

                <span id="product-count" style={{float: 'right'}}>Products:{cProducts.length}</span>
                <span className="expand-icon" style={{float: 'right'}}><i style={{transform: expand ? 'rotate(180deg)' : 'none'}} className="fas fa-chevron-down" onClick={handleExpand}></i></span>
            </div>
            <div className="category-products" style={{display: show ? 'block' : 'none'}}>
                <SortableContainer
                    onSortEnd={onSortEnd}
                    useDragHandle>
                    {cProducts.map((product,index) => (
                        <SortableProductItem key={`item-${product.id}`} index={index} product={product} />
                    ))}
                </SortableContainer>
                
            </div>
        </li>

        <Modal
                show={deleteShow}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Are you sure?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                Do you want to delete {category.name}? 
                
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => {
                        setDeleteShow(false);
                        handleDelete();
                    }}>Yes,Delete</button>
                    <button onClick={() => setDeleteShow(false)}>No, Cancel</button>
                </Modal.Footer>
            </Modal>

        
        </>
    )
});


const SortableContainer = sortableContainer(({children}) => {
  return <ul className="category-list">{children}</ul>;
});



const Categories = ({products, categories, handleCatChange}) => {

    const [product, setProduct] = useState([]);
    const [category, setCategory] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [name, setName] = useState("");


    useEffect(async () => {
        const product_result = await axios.get(
            host+'api/product/',
        );

        const category_result = await axios.get(
            host+'api/category/',
        )

        setProduct(product_result.data);
        setCategory(category_result.data);
      }, []);

    const onSortEnd = ({oldIndex, newIndex}) => {
        const id = category[oldIndex].id;
        const newCategory = arrayMove(category, oldIndex, newIndex);
        setCategory(newCategory);
        handleCatChange(newCategory);

        const json = JSON.stringify({'order': newIndex + 1})
        axios.post(host+`category/${id}/move/`, json, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
      };

    const handleAddCategory = () => {
        event.preventDefault();
        const json = JSON.stringify({'name': name})
        axios.post(host+'api/category/', json, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        setModalShow(false);
        let newCategory = category
        newCategory.push({'id': Math.max.apply(Math, category.map(function(o) { return o.id; })) + 1, 'name': name, 'order': category.length + 1 });
        setCategory(newCategory)
        setName('')
    }

    const handleChange = (e) => {
        setName(e.target.value);
    }

    const handleDelete = (id, index) => {
        axios.delete(host+`api/category/${id}`)
        setCategory(category.filter((_, i) => i !== index))
    }


    return(
        <div className="item-page">
            <h1 className='page-name'>Categories</h1>
            <button className="manage-btn table-btn" onClick={() => setModalShow(true)}>
                ADD NEW CATEGORY
              </button>
        
              <Modal
                show={modalShow}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Add New Category
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                <form onSubmit={handleAddCategory}>
                    <p>
                        Category Name: <br />
                        <input type="text" placeholder='Name' id='name' value={name} onChange={handleChange} required/>
                    </p>
                    <input type="submit" />
                </form>
    
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => setModalShow(false)}>Close</button>
                </Modal.Footer>
            </Modal>

            <SortableContainer
                onSortEnd={onSortEnd}
                // onSortStart={onSortStart}
                useDragHandle>
                {category.map((category, index) => {
                    let c_products = product.filter(product => product.category.id == category.id);
                    return(
                        <SortableItem handleDelete={() => handleDelete(category.id, index)} key={`item-${category.id}`} index={index} category={category} products={c_products} />
                    )
            })}
            </SortableContainer>
            
        </div>
    )
    
 
}

export default Categories;