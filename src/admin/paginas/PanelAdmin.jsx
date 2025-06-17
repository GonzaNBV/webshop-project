import React from 'react';
import './PanelAdmin.css';

export default function Dashboard() {
  return (
    <div className="panel-admin-dash-container">
      <h2>Administration Panel</h2>
      <p>Welcome to the administration panel. Here you can see a summary of products, orders, and statistics.</p>
      
      <div className="panel-admin-dash-widgets">
        <div className="panel-admin-dash-widget">
          <h3>Today's Total Sales</h3>
          <p>$0</p>
        </div>
        <div className="panel-admin-dash-widget">
          <h3>Pending Orders</h3>
          <p>0</p>
        </div>
        <div className="panel-admin-dash-widget">
          <h3>Registered Users</h3>
          <p>0</p>
        </div>
        <div className="panel-admin-dash-widget">
          <h3>Low Stock Products</h3>
          <p>0</p>
        </div>
      </div>

      <div className="panel-admin-dash-recent-orders">
        <h3>Recent Orders</h3>
        <ul>
          <li>Order #1 - Status: Pending</li>
          <li>Order #2 - Status: Shipped</li>
          <li>Order #3 - Status: Pending</li>
          <li>Order #4 - Status: Shipped</li>
          <li>Order #5 - Status: Pending</li>
        </ul>
      </div>

      <div className="panel-admin-dash-important-alerts">
        <h3>Important Alerts</h3>
        <p>There are products with stock less than 3 units.</p>
        <p>There was a payment error in order #3.</p>
      </div>

      <div className="panel-admin-dash-quick-access">
        <h3>Quick Access</h3>
        <div className="panel-admin-dash-quick-access-buttons">
          <button className="panel-admin-dash-quick-access-btn">Add Product</button>
          <button className="panel-admin-dash-quick-access-btn">View Orders</button>
          <button className="panel-admin-dash-quick-access-btn">View Users</button>
        </div>
      </div>
    </div>
  );
}