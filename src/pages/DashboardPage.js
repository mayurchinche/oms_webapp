import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Statistic, DatePicker, Select } from "antd";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getCostHighlights, getPriceTrend } from "../services/api";
import moment from "moment";
import SupplierPerformanceCard from "../components/SupplierPerformanceCard";

const { RangePicker } = DatePicker;
const { Option } = Select;

const DashboardPage = () => {
  // State for Cost Analysis Highlights
  const [highlightsDateRange, setHighlightsDateRange] = useState([]);
  const [costHighlights, setCostHighlights] = useState({
    total_savings: 0,
    percentage_savings: "--",
  });

  // State for Price Trend Analysis
  const [trendDateRange, setTrendDateRange] = useState([]);
  const [priceTrend, setPriceTrend] = useState([]);
  const [interval, setInterval] = useState("daily");

  // Fetch cost highlights
  const fetchCostHighlights = useCallback(async () => {
    if (highlightsDateRange.length === 2) {
      const [startDate, endDate] = highlightsDateRange.map((date) => date.format("DD-MM-YYYY"));

      try {
        const highlightsData = await getCostHighlights(startDate, endDate);

        if (highlightsData[0]?.percentage_savings) {
          highlightsData[0].percentage_savings = parseFloat(highlightsData[0].percentage_savings).toFixed(2);
        }

        setCostHighlights(highlightsData[0] || { total_savings: 0, percentage_savings: "--" });
      } catch (error) {
        console.error("Failed to fetch cost highlights", error);
      }
    }
  }, [highlightsDateRange]);

  // Fetch price trend
  const fetchPriceTrend = useCallback(async () => {
    if (trendDateRange.length === 2) {
      const [startDate, endDate] = trendDateRange.map((date) => date.format("DD-MM-YYYY"));

      try {
        const trendData = await getPriceTrend(startDate, endDate, interval);
        const formattedData = trendData.trend.map((item) => ({
          ...item,
          time_period: moment(item.time_period).format(interval === "daily" ? "DD MMM YYYY" : "MMM YYYY"),
        }));
        setPriceTrend(formattedData);
      } catch (error) {
        console.error("Failed to fetch price trend", error);
      }
    }
  }, [trendDateRange, interval]);

  // Fetch data when respective date ranges change
  useEffect(() => {
    fetchCostHighlights();
  }, [highlightsDateRange, fetchCostHighlights]);

  useEffect(() => {
    fetchPriceTrend();
  }, [trendDateRange, interval, fetchPriceTrend]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Order Analysis Dashboard</h1>

      {/* Cost Analysis Highlights Card */}
      <Card title="Cost Analysis Highlights" style={{ marginTop: "20px" }}>
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col span={24}>
            <RangePicker onChange={setHighlightsDateRange} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Statistic
              title="Total Savings"
              value={costHighlights.total_savings}
              prefix="₹"
              valueStyle={{ color: "#3f8600" }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Percentage Savings"
              value={costHighlights.percentage_savings}
              suffix="%"
              valueStyle={{ color: "#cf1322" }}
            />
          </Col>
        </Row>
      </Card>

      {/* Price Trend Analysis Card */}
      <Card title="Price Trend Analysis" style={{ marginTop: "20px" }}>
        <Row gutter={16} style={{ marginBottom: "20px" }}>
          <Col span={16}>
            <RangePicker onChange={setTrendDateRange} />
          </Col>
          <Col span={8}>
            <Select
              value={interval}
              onChange={(value) => setInterval(value)}
              style={{ width: "100%" }}
            >
              <Option value="daily">Daily</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
          </Col>
        </Row>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={priceTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time_period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="average_expected_price" stroke="#8884d8" name="Expected Price" />
            <Line type="monotone" dataKey="average_ordered_price" stroke="#82ca9d" name="Ordered Price" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Supplier Performance Card */}
      <SupplierPerformanceCard />
    </div>
  );
};

export default DashboardPage;