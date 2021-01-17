import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

import Logo from '../Assets/bubble-logo.png';

import './header.css';

export class Header extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const authLinks = (
      <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
        <span className="navbar-text">
          {user ? `Welcome, ${user.username}!` : ''}
        </span>
        <li className="nav-item">
          {user!== null && user.is_staff ? <Link to="/dashboard" className="nav-link">Access Dashboard</Link> : <Link to="/MyOrders" className="nav-link">My Orders</Link>}
        </li>
        <li className="nav-item">
          <Link className="nav-link" onClick={() => {
            this.props.history.push('/login');
            this.props.logout();
            }}>Logout</Link>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
         {/* <span className="navbar-text">
          You're the boss?
        </span>
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link">
            Access Dashboard
          </Link>
        </li> */}
        

      </ul>
    );

    return (
      <nav className="navbar navbar-expand-sm" id="user-nav">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01" onClick={()=>this.props.history.push('/')}>
            {/* <a className="navbar-brand" href="#">
              Bubble Sort
            </a> */}
            <img className="nav-brand" src={Logo} />
          </div>
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(withRouter(Header));