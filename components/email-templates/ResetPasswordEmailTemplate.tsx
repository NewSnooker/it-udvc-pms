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

interface ResetPasswordEmailProps {
  name: string;
  subject: string;
  resetLink: string;
}

export const ResetPasswordEmailTemplate: React.FC<ResetPasswordEmailProps> = ({
  name,
  subject,
  resetLink,
}) => (
  <Html>
    <Head />
    <Preview>{subject}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{subject}</Heading>
        <Section>
          <Text style={text}>
            สวัสดีคุณ {name},
            <br />
            คุณได้รับอีเมลนี้เนื่องจากคุณได้แจ้งว่าลืมรหัสผ่านของบัญชีของคุณ
            หากต้องการเปลี่ยนรหัสผ่าน กรุณากดปุ่มด้านล่าง:
          </Text>
          <Button href={resetLink} style={button}>
            เปลี่ยนรหัสผ่าน
          </Button>
        </Section>
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            อีเมลนี้ส่งโดยระบบของเรา
            <br />
            หากคุณมีคำถามใดๆ โปรดติดต่อทีมสนับสนุนของเรา
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ResetPasswordEmailTemplate;

const main = {
  backgroundColor: "#f4f4f8",
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
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
};

const h1 = {
  color: "#003366", // โทนสีน้ำเงินเข้มสำหรับความน่าเชื่อถือ
  fontSize: "24px",
  fontWeight: "bold",
  paddingBottom: "16px",
  borderBottom: "2px solid #e0e0e0",
};

const text = {
  color: "#333333", // สีเทาเข้มเพื่ออ่านง่าย
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "10px 0",
};

const button = {
  display: "inline-block",
  backgroundColor: "#0056b3", // สีน้ำเงินเข้มสำหรับปุ่มหลัก
  color: "#ffffff", // สีตัวอักษรขาว
  textDecoration: "none",
  padding: "12px 20px",
  borderRadius: "5px",
  fontSize: "16px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "20px 0",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s",
};

const hr = {
  borderColor: "#e0e0e0",
  margin: "20px 0",
};

const footer = {
  textAlign: "center" as const,
  color: "#666666", // สีเทาอ่อนเพื่อความสุภาพ
  fontSize: "14px",
  marginTop: "20px",
};

const footerText = {
  margin: "0",
};
