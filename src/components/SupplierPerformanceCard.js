import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, DatePicker } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getSupplierPerformance } from "../services/api";
import { useCallback } from "react";
const { RangePicker } = DatePicker;

const SupplierPerformanceCard = () => {
  const [supplierDateRange, setSupplierDateRange] = useState([]);
  const [supplierData, setSupplierData] = useState({
    average_orders_by_supplier: [],
    average_delivery_time_by_supplier: [],
  });

  
  // Fetch Supplier Performance Data
  const fetchSupplierPerformance = useCallback(async () => {
    if (supplierDateRange.length === 2) {
      const [startDate, endDate] = supplierDateRange.map((date) =>
        date.format("DD-MM-YYYY")
      );
  
      try {
        const supplierPerformanceData = await getSupplierPerformance(
          startDate,
          endDate
        );
  
        setSupplierData(supplierPerformanceData);
      } catch (error) {
        console.error("Failed to fetch supplier performance data", error);
      }
    }
  }, [supplierDateRange]); // Only include supplierDateRange
  
  useEffect(() => {
    fetchSupplierPerformance();
  }, [fetchSupplierPerformance]);
  
  
  return (
    <Card title="Supplier Performance" style={{ marginTop: "20px" }}>
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <RangePicker onChange={setSupplierDateRange} />
        </Col>
      </Row>

      {/* Bar Chart for Average Orders by Supplier */}
      <Row gutter={16}>
        <Col span={24}>
          <h3>Average Orders Delivered by Supplier</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplierData.average_orders_by_supplier}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="supplier_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_orders" fill="#82ca9d" name="Total Orders Delivered" />
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      {/* Horizontal Line Divider */}
      <hr style={{ margin: "20px 0" }} />

      {/* Bar Chart for Average Delivery Time by Supplier */}
      <Row gutter={16}>
        <Col span={24}>
          <h3>Average Delivery Time by Supplier</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplierData.average_delivery_time_by_supplier}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="supplier_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avg_delivery_days" fill="#8884d8" name="Average Delivery Time (Days)" />
            </BarChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      {/* Additional Data Below the Graphs */}
      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={8}>
          <Statistic
            title="Total Orders Delivered"
            value={supplierData.average_orders_by_supplier.reduce((sum, supplier) => sum + supplier.total_orders, 0)}
            suffix="orders"
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Average Delivery Days"
            value={(
              supplierData.average_delivery_time_by_supplier.reduce((sum, supplier) => sum + parseFloat(supplier.avg_delivery_days), 0) /
              supplierData.average_delivery_time_by_supplier.length
            ).toFixed(2)}
            suffix="days"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default SupplierPerformanceCard;