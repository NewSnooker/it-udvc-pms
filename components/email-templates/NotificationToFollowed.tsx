import { User } from "@prisma/client";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

export type ThankYouSubscribeProps = {
  user: User;
  email: string;
};

export const NotificationToFollowed: React.FC<ThankYouSubscribeProps> = ({
  user,
  email,
}) => (
  <Html>
    <Head />
    <Preview>{`มีคน ${email} ได้ติดตามคุณ`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>สวัสดีคุณ {user.name} 🎉</Heading>

        <Text style={text}>เรามีข่าวดีจะแจ้งให้ทราบ!</Text>

        <Section style={content}>
          <Text style={text}>
            มีคนชื่อ <strong>{email}</strong> ได้เลือกที่จะติดตามคุณ
          </Text>
          <Text style={text}>
            การเชื่อมต่อใหม่นี้อาจเป็นโอกาสที่ดีในการสร้างความสัมพันธ์
            และพัฒนาชุมชนของคุณต่อไป
          </Text>
        </Section>

        <Section style={content}>
          <Text style={text}>
            อย่าลืมดูแลผู้ติดตามของคุณให้ดี
            และมอบเนื้อหาที่มีคุณค่าที่สุดให้พวกเขา!
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={footer}>
          <Text style={footerText}>ด้วยความปรารถนาดี</Text>
          <Text style={footerText}>ทีมงานของเรา</Text>
          <Text style={{ ...footerText, fontSize: "12px", marginTop: "10px" }}>
            คุณได้รับอีเมลนี้เนื่องจากมีคนติดตามโปรไฟล์ของคุณ
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default NotificationToFollowed;

const main = {
  backgroundColor: "#f9f9f9",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  padding: "20px 0",
};

const container = {
  margin: "0 auto",
  padding: "16px",
  width: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  paddingBottom: "16px",
  borderBottom: "2px solid #f1f1f1",
};

const text = {
  color: "#555",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "10px 0",
};

const content = {
  margin: "20px 0",
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#333",
};

const hr = {
  borderColor: "#eaeaea",
  margin: "20px 0",
};

const footer = {
  textAlign: "center" as const,
  color: "#888",
  fontSize: "14px",
  marginTop: "20px",
};

const footerText = {
  margin: "0",
};

const attachmentSection = {
  marginTop: "20px",
};

const attachmentList = {
  padding: "0",
  margin: "10px 0",
  listStyle: "none",
};

const attachmentItem = {
  marginBottom: "8px",
};

const attachmentLink = {
  textDecoration: "none",
  color: "#007bff",
  fontWeight: "bold",
};
