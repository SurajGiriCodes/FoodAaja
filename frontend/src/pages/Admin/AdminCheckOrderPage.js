import React, { useState, useEffect } from "react";
import { Table, Tag, Select, Button, Modal } from "antd";
import {
  fetchDeliveryStatuses,
  getAllOrdersAdmin,
  updateDeliveryStatus,
} from "../../services/OrderService";
import Title from "../../Component/Title/Title";
import { getAll } from "../../services/foodService";
import moment from "moment";

const AdminCheckOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryStatuses, setDeliveryStatuses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEditingOrder, setCurrentEditingOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    getAll()
      .then((data) => {
        setRestaurants(data);
      })
      .catch((error) => {
        console.error("Failed to fetch restaurants:", error);
      });
  }, []);

  useEffect(() => {
    const initFetch = async () => {
      try {
        const fetchedDeliveryStatuses = await fetchDeliveryStatuses();
        setDeliveryStatuses(fetchedDeliveryStatuses);
      } catch (error) {
        console.error("Failed to fetch delivery statuses:", error);
      }
    };

    initFetch();
  }, []);

  useEffect(() => {
    // Fetch orders
    const fetchOrders = async () => {
      try {
        const response = await getAllOrdersAdmin();
        setOrders(response);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleChangeDeliveryStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await updateDeliveryStatus(orderId, newStatus);
      // Update local state or UI based on the successful response
      setOrders(
        orders.map((order) => (order._id === orderId ? updatedOrder : order))
      );
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Error updating delivery status:", error);
    }
  };

  const expandedRowRender = (record) => {
    const itemColumns = [
      { title: "Item Name", dataIndex: ["food", "name"], key: "name" },
      {
        title: "Restaurant",
        key: "restaurant",
        render: (text, record) => {
          const restaurantId = record.food.restaurantId;
          const restaurant = restaurants.find((r) => r._id === restaurantId);
          return restaurant ? restaurant.name : "Unknown";
        },
      },
      { title: "Quantity", dataIndex: "quantity", key: "quantity" },
      {
        title: "Customization",
        key: "customization",
        render: (text, record) => (
          <>
            {record.Customization.map((cust, index) => (
              <div key={index} style={{ margin: "5px 0", paddingLeft: "15px" }}>
                {index + 1}. {cust.customizationDetails}
              </div>
            ))}
          </>
        ),
      },
      {
        title: "Add-ins",
        key: "addIns",
        render: (text, record) => {
          let counter = 0;
          const allAddIns = record.Customization.flatMap((cust) =>
            cust.addIns.map((addIn) => ({
              ...addIn,
              number: ++counter,
            }))
          );
          return (
            <>
              {allAddIns.map(({ name, price, number }) => (
                <div
                  key={number}
                  style={{ margin: "5px 0", paddingLeft: "15px" }}
                >
                  {number}. {name} - Rs {price}
                </div>
              ))}
            </>
          );
        },
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
      key: "orderId",
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
      dataIndex: "createdAt", // Assuming 'createdAt' is the field from your orders data
      key: "dateAndTime",
      render: (text) => new Date(text).toLocaleString(), // Format date and time nicely
    },

    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => `Rs ${text.toFixed(2)}`, // Format as currency
    },
    {
      title: "Delivery Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      render: (text) => (
        <Tag color={text === "Delivered" ? "green" : "volcano"}>{text}</Tag>
      ),
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
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => {
            setCurrentEditingOrder(record);
            setSelectedStatus(record.deliveryStatus);
            setIsModalVisible(true);
          }}
        >
          Update Status
        </Button>
      ),
    },
  ];

  return (
    <>
      <Title
        title="Order Delivery Status"
        fontSize="1.6rem"
        marginBottom="10px"
        marginTop="87px"
        marginLeft="40px"
      />
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
          bordered
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div>
      <Modal
        title="Update Delivery Status"
        visible={isModalVisible}
        onOk={() => {
          handleChangeDeliveryStatus(currentEditingOrder._id, selectedStatus);
          setIsModalVisible(false);
        }}
        onCancel={() => setIsModalVisible(false)}
      >
        <Select
          defaultValue={selectedStatus}
          style={{ width: 200 }}
          onChange={setSelectedStatus}
        >
          {Object.values(deliveryStatuses).map((status) => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default AdminCheckOrderPage;
