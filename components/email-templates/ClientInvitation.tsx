import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export interface ClientInvitationProps {
  clientName?: string;
  projectName?: string;
  loginEmail?: string;
  loginPassword?: string;
  loginLink?: string;
}

export const ClientInvitation: React.FC<ClientInvitationProps> = ({
  clientName,
  projectName = "โครงการ",
  loginEmail = "client@example.com",
  loginPassword = "password",
  loginLink,
}) => (
  <Html>
    <Head />
    <Preview>คำเชิญเข้าร่วมดูแลโครงการ {projectName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>คำเชิญเข้าร่วมดูแลโครงการ {projectName}</Heading>
        <Text style={text}>เรียน คุณ{clientName},</Text>
        <Text style={text}>
          เรามีความยินดีที่จะเชิญคุณเข้าร่วมดูแลโครงการ {projectName}{" "}
          ความคิดเห็นและข้อเสนอแนะของคุณมีค่าสำหรับเรา
          และเราหวังว่าจะได้ทำงานร่วมกันได้ดี
        </Text>
        <Text style={text}>
          เพื่อเริ่มต้น กรุณาใช้รายละเอียดการเข้าสู่ระบบด้านล่างนี้:
        </Text>
        <Section style={codeContainer}>
          <Text style={codeText}>อีเมล: {loginEmail}</Text>
          <Text style={codeText}>รหัสผ่าน: {loginPassword}</Text>
        </Section>
        <Section style={buttonContainer}>
          <Button style={button} href={loginLink}>
            คลิกที่นี่เพื่อเข้าสู่ระบบ
          </Button>
        </Section>

        <Text style={text}>
          เพื่อความปลอดภัย
          เราขอแนะนำให้คุณเปลี่ยนรหัสผ่านเมื่อเข้าสู่ระบบครั้งแรก
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          หากคุณมีคำถามใด ๆ โปรดอย่าลังเลที่จะติดต่อเรา
          เราหวังว่าจะได้ทำงานร่วมกับคุณ!
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ClientInvitation;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  paddingBottom: "16px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "16px 24px",
};

const codeContainer = {
  background: "#f4f4f4",
  borderRadius: "4px",
  padding: "16px",
  margin: "16px 0",
};

const codeText = {
  color: "#333",
  fontSize: "14px",
  fontFamily: "monospace",
  lineHeight: "24px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#898989",
  fontSize: "14px",
  lineHeight: "24px",
};
