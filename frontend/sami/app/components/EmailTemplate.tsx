import { Html, Body, Container, Heading, Text } from "@react-email/components";

/* eslint-disable @typescript-eslint/no-unused-vars */
interface EmailTemplateProps {
  giftMessage: string;
  amount: string;
  currency: string;
  redeemCode: string;
}

const EmailTemplate = ({
  giftMessage,
  amount,
  currency,
  redeemCode,
}: EmailTemplateProps) => {
  return (
    <Html>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>
            You just received a Gift Card from SamiOne!!!
          </Heading>
          <Text style={styles.text}>
            <strong>Product Name:</strong> Amazon
          </Text>
          <Text style={styles.text}>
            <strong>Amount:</strong> {amount}
          </Text>
          <Text style={styles.text}>
            <strong>Currency:</strong> {currency}
          </Text>
          <Text style={{ ...styles.text, marginBottom: "40px" }}>
            <strong>Redeem Code:</strong> {redeemCode}
          </Text>
          <Text style={styles.text}>{giftMessage}</Text>
        </Container>
      </Body>
    </Html>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    backgroundColor: "#f9f9f9",
    fontFamily: "Verdana, sans-serif",
    padding: "20px",
    margin: "0",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  heading: { fontSize: "24px", marginBottom: "10px", color: "#333333" },
  text: {
    fontSize: "16px",
    lineHeight: "auto",
    color: "#555555",
  },
  smallHeading: {
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "10px 20px",
    textDecoration: "none",
    borderRadius: "4px",
  },
  footer: { fontSize: "14px", color: "#aaaaaa", marginTop: "20px" },
};

export default EmailTemplate;
