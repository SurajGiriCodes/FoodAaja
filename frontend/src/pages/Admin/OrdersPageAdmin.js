import React, { useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
import moment from "moment";
import { getAllOrdersAdmin } from "../../services/OrderService";

export default function OrdersPageAdmin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await getAllOrdersAdmin();
        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching all orders:", error);
      }
    };
    fetchOrders();
  }, []);
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const expandedRowRender = (record) => {
    const itemColumns = [
      { title: "Item Name", dataIndex: ["food", "name"], key: "name" },
      { title: "Quantity", dataIndex: "quantity", key: "quantity" },
      {
        title: "Customization",
        dataIndex: "customizationDetails",
        key: "customizationDetails",
      },
      {
        title: "Add-ins",
        key: "addIns",
        dataIndex: "addIns",
        render: (addIns) => (
          <>
            {addIns.map((addIn, index) => (
              <div key={index} style={{ margin: "5px 0", paddingLeft: "15px" }}>
                {addIn.name} - Rs {addIn.price}
              </div>
            ))}
          </>
        ),
      },
    ];

    return (
      <div>
        <p>Order ID: {record._id}</p>
        <p>Customer Name: {record.name}</p>
        <p>Address: {record.address}</p>
        <p>
          Date & Time: {moment(record.createdAt).format("YYYY-MM-DD HH:mm:ss")}
        </p>
        <p>Total Price: Rs {record.totalPrice}</p>
        {/* Render items table */}
        <Table
          columns={itemColumns}
          dataSource={record.items}
          pagination={false}
          size="small"
        />
      </div>
    );
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Date & Time",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    // {
    //   title: "Items",
    //   key: "items",
    //   dataIndex: "items",
    //   render: (items) => (
    //     <>
    //       {items.map((item, index) => (
    //         <div key={index}>
    //           <p>
    //             {item.food.name} - Qty: {item.quantity}
    //           </p>
    //           {item.customizationDetails && (
    //             <p style={{ color: "blue", margin: "5px 0" }}>
    //               Customization: {item.customizationDetails}
    //             </p>
    //           )}
    //           {item.addIns && item.addIns.length > 0 && (
    //             <div style={{ marginTop: "10px" }}>
    //               <p style={{ fontWeight: "bold" }}>Add-ins:</p>
    //               {item.addIns.map((addIn, addInIndex) => (
    //                 <p
    //                   key={addInIndex}
    //                   style={{ margin: "5px 0", paddingLeft: "15px" }}
    //                 >
    //                   {addIn.name} - Rs {addIn.price}
    //                 </p>
    //               ))}
    //             </div>
    //           )}
    //         </div>
    //       ))}
    //     </>
    //   ),
    // },

    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => `Rs ${text}`,
    },
    {
      title: "Payment Status",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={
            status === "NEW"
              ? "geekblue"
              : status === "IN_PROGRESS"
              ? "orange"
              : "green"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Delivery Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      render: (text) => (
        <Tag color={text === "Delivered" ? "green" : "volcano"}>{text}</Tag>
      ),
    },
  ];

  return (
    <div style={{ margin: "20px", padding: "20px" }}>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => true, // You can specify conditions here
        }}
        pagination={{
          pageSize: 6,
          // Other pagination settings...
          itemRender: (current, type, originalElement) => {
            // Only render the element if it's a page number
            if (type === "page") {
              return originalElement;
            }
            // Return nothing for 'prev' and 'next' type, effectively removing them
            return null;
          },
        }}
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
      <div style={{ marginTop: "20px" }}>
        <h3>Total Revenue: Rs {totalRevenue.toFixed(2)}</h3>
      </div>
    </div>
  );
}
