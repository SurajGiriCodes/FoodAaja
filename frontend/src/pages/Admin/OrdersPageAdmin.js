import React, { useEffect, useState } from "react";
import { Table, Tag, Space } from "antd";
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
    {
      title: "Items",
      key: "items",
      dataIndex: "items",
      render: (items) => items.map((item) => item.food.name).join(", "),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => `Rs ${text}`,
    },
    {
      title: "Status",
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
  ];

  return (
    <div style={{ margin: "20px", padding: "20px" }}>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
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
