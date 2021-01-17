import React, {useState, useEffect} from 'react';
import { withRouter,HashRouter as Router, Route, Redirect, Switch, Link } from "react-router-dom";
import './Dashboard.styles.css';
import Logo from '../Assets/bubble-logo.png';
import axios from 'axios';

import Overview from './TabPages/Overview';
import Categories from './TabPages/Categories';
import Products from './TabPages/Products';
import Orders from './TabPages/Orders';
import host from '../common/Host';

const Dashboard = (props) => {

    const [navlinks, setNavlinks] = useState(['Overview', 'Categories', 'Products']);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activePage, setActivePage] = useState(navlinks[0]);
    const [activePageIndex, setActivePageIndex] = useState(0);
    const [orders, setOrders] = useState([]);
    const [allproducts, setAllProducts] = useState([]);

    const [categories, setCategories] = useState([])


    useEffect(async () => {
        console.log("host:",host);
        const result = await axios(
            host+'api/order/',
        );

        const result_category = await axios(
            host+'api/category/',
          );


        setCategories(result_category.data);
        setOrders(result.data);
      }, []);

    const SwitchMenu = (menuItem) => {
        setActivePageIndex(0);
        if(menuItem === 'Menu') {
            setActiveIndex(0);
            setNavlinks(['Overview', 'Categories', 'Products']);
            setActivePage('Overview')
        } else if(menuItem === 'Orders') {
            setActiveIndex(1);
            setNavlinks(['All']);
            setActivePage('All');
           
        }
    }

    const SwtichPage = (pageName,index) => {
        setActivePage(pageName);
        setActivePageIndex(index);

        if (['All', 'New', 'Accepted', 'Past'].includes(pageName)){
            if (pageName == 'New') {
                setOrders(orders.filter(obj => obj.status == 0));
            } else if (pageName == 'Past') {
                setOrders(orders.filter(obj => obj.status == 4));
            } else if (pageName == 'Accepted') {
                setOrders(orders.filter(obj => obj.status != 0 && obj.status != 4));
            }
        }
    }

    const renderPage = () => {
        if (activePage == 'Products') {
            return(<Products/>)
        } if (activePage == 'Overview') {
            return(<Overview/>)
        } if (activePage == 'Categories') {
            return(<Categories handleCatChange={(newCategory) => setCategories(newCategory)}/>)
        } if (['All', 'New', 'Accepted', 'Past'].includes(activePage)) {
            return (<Orders orders={orders} products={allproducts} />)}

        }

    return (
        <div className="dashboard-container">
            <div className="nav-sidebar">
                <Link to="/"><img className="nav-brand" id="dashboard-brand" src={Logo} /></Link>
                <ul className="nav-links">
                    <li className={activeIndex==0 ? 'nav-link active': 'nav-link'} onClick={() => SwitchMenu('Menu')}>Menu</li>
                    <li className={activeIndex==1 ? 'nav-link active': 'nav-link'} onClick={() => SwitchMenu('Orders')}>Orders</li>
                </ul>
            </div>
            <div className="owner-page-container">

                <div className="owner-nav" style={{display: activeIndex == 1 ? 'none' : 'inherit'}}>
                    <nav className="navbar navbar-expand-lg">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            {navlinks.map((navlink, index) => (
                                <li className="owner-nav-item">
                                    <a onClick={() => SwtichPage(navlink,index)} className={activePageIndex==index ? 'owner-nav-link active' : 'owner-nav-link'}>{navlink}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    </nav>
                </div>
                {renderPage()}

                
            </div>
            
        </div>
    )
}

export default Dashboard;
