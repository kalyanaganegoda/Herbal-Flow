import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import dayjs from "dayjs";

const InventoryReport = ({ packages }) => {
  const currentDate = dayjs().format("DD-MM-YYYY");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.centerText}>
            Mr Automative Service Center, Gampaha
          </Text>
          <Text style={styles.centerText}>Package Report</Text>
          <Text style={styles.centerText}>
            Report Generated Date: {currentDate}
          </Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Package Name</Text>
          <Text style={styles.tableHeaderText}>Price</Text>
          <Text style={styles.tableHeaderText}>Services Included</Text>
        </View>

        {/* Table Rows */}
        {packages.map((item, index) => (
          <View
            key={index}
            style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
          >
            <Text style={styles.tableCell}>{item.itemName}</Text>
            <Text style={styles.tableCell}>{item.price}</Text>
            <Text style={styles.tableCell}>{item.exp}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
};
// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  centerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderBottom: "1px solid #cccccc",
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "bold",
    color: "#333333",
  },
  tableRowEven: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 10,
  },
  tableRowOdd: {
    flexDirection: "row",
    backgroundColor: "#f7f7f7",
    padding: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: "#333333",
  },
});

export default InventoryReport;
