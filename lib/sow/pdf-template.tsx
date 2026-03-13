import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { SowData } from "@/server/repos/sow";

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1c1917",
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 15,
  },
  companyName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#78716c",
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginTop: 20,
    marginBottom: 8,
    color: "#1c1917",
  },
  body: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#44403c",
  },
  deliverableRow: {
    marginBottom: 8,
  },
  deliverableTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  deliverableDesc: {
    fontSize: 9,
    color: "#57534e",
    marginTop: 2,
  },
  table: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#d6d3d1",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f4",
    borderBottomWidth: 1,
    borderBottomColor: "#d6d3d1",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e7e5e4",
    padding: 8,
  },
  tableColDesc: {
    flex: 3,
    fontSize: 10,
  },
  tableColAmount: {
    flex: 1,
    fontSize: 10,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
  },
  totalRow: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f5f5f4",
  },
  totalLabel: {
    flex: 3,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    paddingRight: 12,
  },
  totalAmount: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    color: "#2563eb",
  },
  signatureBlock: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: "#d6d3d1",
    paddingTop: 20,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#1c1917",
    width: 250,
    marginTop: 40,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 9,
    color: "#78716c",
  },
  signatureImage: {
    width: 200,
    height: 60,
    marginTop: 10,
  },
  signedInfo: {
    marginTop: 8,
    fontSize: 9,
    color: "#57534e",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    fontSize: 8,
    color: "#a8a29e",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e7e5e4",
    paddingTop: 8,
  },
});

interface SowPdfProps {
  sowData: SowData;
  signatureDataUrl?: string | null;
  signedByName?: string | null;
  signedAt?: string | null;
}

export function SowPdfDocument({
  sowData,
  signatureDataUrl,
  signedByName,
  signedAt,
}: SowPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>CappaWork</Text>
          <Text style={styles.title}>Statement of Work</Text>
          <Text style={styles.subtitle}>
            Prepared for {sowData.clientName} — {sowData.clientCompany}
          </Text>
        </View>

        {/* Scope */}
        <Text style={styles.sectionTitle}>Scope of Work</Text>
        <Text style={styles.body}>{sowData.scope}</Text>

        {/* Deliverables */}
        {sowData.deliverables.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Deliverables</Text>
            {sowData.deliverables.map((d, i) => (
              <View key={i} style={styles.deliverableRow}>
                <Text style={styles.deliverableTitle}>
                  {i + 1}. {d.title}
                </Text>
                {d.description && (
                  <Text style={styles.deliverableDesc}>{d.description}</Text>
                )}
              </View>
            ))}
          </>
        )}

        {/* Timeline */}
        <Text style={styles.sectionTitle}>Timeline</Text>
        <Text style={styles.body}>{sowData.timeline}</Text>

        {/* Pricing */}
        <Text style={styles.sectionTitle}>Pricing</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableColDesc}>Description</Text>
            <Text style={styles.tableColAmount}>Amount</Text>
          </View>
          {sowData.lineItems.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableColDesc}>{item.description}</Text>
              <Text style={styles.tableColAmount}>{item.amount}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{sowData.totalAmount}</Text>
          </View>
        </View>

        {/* Payment Terms */}
        <Text style={styles.sectionTitle}>Payment Terms</Text>
        <Text style={styles.body}>{sowData.paymentTerms}</Text>

        {/* Terms & Conditions */}
        <Text style={styles.sectionTitle}>Terms & Conditions</Text>
        <Text style={styles.body}>{sowData.termsAndConditions}</Text>

        {/* Signature Block */}
        <View style={styles.signatureBlock}>
          <Text style={styles.sectionTitle}>Acceptance</Text>
          <Text style={styles.body}>
            By signing below, you agree to the terms outlined in this Statement
            of Work.
          </Text>

          {signatureDataUrl ? (
            <>
              <Image src={signatureDataUrl} style={styles.signatureImage} />
              <Text style={styles.signedInfo}>
                Signed by {signedByName || "—"} on{" "}
                {signedAt
                  ? new Date(signedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </Text>
            </>
          ) : (
            <>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Signature & Date</Text>
            </>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          CappaWork — Operational Analytics & Automation Consultancy
        </Text>
      </Page>
    </Document>
  );
}
