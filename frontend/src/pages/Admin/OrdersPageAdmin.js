import React, { useEffect, useState } from "react";
import { Table, Tag, Select, DatePicker } from "antd";
import moment from "moment";
import { getAllOrdersAdmin } from "../../services/OrderService";
import { getAll } from "../../services/foodService";
import Chart from "chart.js/auto";

export default function OrdersPageAdmin() {
  const { RangePicker } = DatePicker;
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState({
    "2024-03-01": 1000, // Default value for March 1st, 2024
    "2024-03-02": 1500,
  });

  useEffect(() => {
    if (selectedRestaurantId && selectedDateRange.length === 2) {
      const [startDate, endDate] = selectedDateRange;
      const revenue = calculateRevenueForDateRange(
        orders,
        selectedRestaurantId,
        startDate,
        endDate
      );
      console.log(revenue);
      console.log("Selected Restaurant:", selectedRestaurantId);
      console.log("Daily Revenue:", revenue);
      setDailyRevenue(revenue);
    }
  }, [selectedRestaurantId, selectedDateRange, orders]);

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

  const calculateRevenueForDateRange = (
    orders,
    restaurantId,
    startDate,
    endDate
  ) => {
    const dailyRevenue = {};
    orders.forEach((order) => {
      const orderTotalForRestaurant = order.items.reduce((itemAcc, item) => {
        const isSameRestaurant = item.food.restaurantId === restaurantId;
        if (isSameRestaurant) {
          itemAcc += item.price * item.quantity;
        }
        return itemAcc;
      }, 0);
      const orderDate = moment(order.createdAt);
      const isWithinRange = orderDate.isBetween(startDate, endDate, null, "[]");
      if (orderTotalForRestaurant && isWithinRange) {
        const day = orderDate.format("YYYY-MM-DD");
        if (!dailyRevenue[day]) {
          dailyRevenue[day] = 0;
        }
        dailyRevenue[day] += orderTotalForRestaurant;
      }
    });
    return dailyRevenue;
  };

  useEffect(() => {
    const ctx = document.getElementById("revenueChart");
    let myChart = null;
    if (ctx) {
      if (Chart.instances.length > 0) {
        // Destroy existing chart instances
        Chart.instances.forEach((instance) => {
          instance.destroy();
        });
      }
      myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(dailyRevenue),
          datasets: [
            {
              label: "Daily Revenue",
              data: Object.values(dailyRevenue),
              backgroundColor: "#9BD0F5",
              borderColor: "#36A2EB",
              color: "#000",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
    // Return a cleanup function to destroy the chart instance when the component unmounts or updates
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [dailyRevenue]);

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const expandedRowRender = (record) => {
    const itemColumns = [
      { title: "Item Name", dataIndex: ["food", "name"], key: "name" },
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
      <div
        style={{
          margin: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#e6fffa",
        }}
      >
        <Select
          showSearch
          style={{ width: 200, marginBottom: "16px", marginTop: "20px" }}
          placeholder="Select a restaurant"
          onChange={(value) => {
            setSelectedRestaurantId(value);
          }}
        >
          {restaurants.map((restaurant) => (
            <Select.Option key={restaurant._id} value={restaurant._id}>
              {restaurant.name}
            </Select.Option>
          ))}
        </Select>

        <RangePicker
          style={{
            marginBottom: "16px",
            marginLeft: "10px",
            marginTop: "20px",
          }}
          onChange={(dates, dateStrings) => {
            if (dates) {
              setSelectedDateRange([
                dates[0].startOf("day").toDate(),
                dates[1].endOf("day").toDate(),
              ]);
            } else {
              setSelectedDateRange([]);
            }
          }}
        />

        <canvas id="revenueChart" height="100"></canvas>
      </div>

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
          marginTop: "20px",
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
