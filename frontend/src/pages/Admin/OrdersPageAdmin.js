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
    {
      title: "Date & Time",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm:ss"), // Format the date and time as desired
    },
  ];

  return (
    <div style={{ margin: "20px", padding: "20px" }}>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        pagination={{ pageSize: 10 }} // Set number of items per page here
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
    </div>
  );
}
