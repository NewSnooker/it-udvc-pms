import { InvoiceLinkProps } from "@/types/types";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const InvoiceLink: React.FC<Readonly<InvoiceLinkProps>> = ({
  invoiceLink,
  preview = "ใบแจ้งหนี้สำหรับการชำระเงินงวดที่ ######",
  title = "ใบแจ้งหนี้ สำหรับการชำระเงิน โดย ######",
  username,
}) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>🪄 {title}</Heading>
        <Section style={body}>
          <Text style={paragraph}>
            เราขอแจ้งให้คุณทราบว่าใบแจ้งหนี้สำหรับการชำระเงินของคุณได้ถูกสร้างขึ้นเรียบร้อยแล้ว
            กรุณาดูรายละเอียดเพิ่มเติมด้านล่าง:
          </Text>
          <Text style={paragraph}>
            <Link style={link} href={invoiceLink}>
              👉 คลิกที่นี่เพื่อเข้าสู่ระบบ 👈
            </Link>
          </Text>
        </Section>
        <Text style={paragraph}>ขอแสดงความนับถือ, {username}</Text>
        <Hr style={hr} />
        <Text style={footer}>Raycast Technologies Inc.</Text>
        <Text style={footer}>
          2093 Philadelphia Pike #3222, Claymont, DE 19703
        </Text>
      </Container>
    </Body>
  </Html>
);

export default InvoiceLink;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 25px 48px",
  backgroundImage: 'url("/assets/raycast-bg.png")',
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat, no-repeat",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
};

const body = {
  margin: "24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const link = {
  color: "#FF6363",
};

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginLeft: "4px",
};
