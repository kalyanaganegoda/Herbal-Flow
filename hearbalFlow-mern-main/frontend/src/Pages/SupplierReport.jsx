import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import dayjs from "dayjs";
import logo from '../assets/logo.png'

const SupplierReport = ({ suppliers }) => {
  const currentDate = dayjs().format("DD-MM-YYYY");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            src={logo}
          />
          <View style={styles.headerText}>
            <Text style={styles.centerText}>
              Mr Automative Service Center, Gampaha
            </Text>
            <Text style={styles.centerText}>Supplier Report</Text>
            <Text style={styles.centerText}>
              Report Generated Date: {currentDate}
            </Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Supplier Name</Text>
          <Text style={styles.tableHeaderText}>Email</Text>
          <Text style={styles.tableHeaderText}>Website</Text>
          <Text style={styles.tableHeaderText}>Contact</Text>
        </View>
          {/* Table Rows */}
          {suppliers.map((supplier, index) => (
            <View
              key={supplier._id}
              style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
            >
              <Text style={styles.tableCell}>{supplier.name}</Text>
              <Text style={styles.tableCell}>{supplier.email}</Text>
              <Text style={styles.tableCell}>{supplier.website}</Text>
              <Text style={styles.tableCell}>{supplier.mobile}</Text>
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
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
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

export default SupplierReport;
