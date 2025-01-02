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

export interface ClientInvitationCreateUserProps {
  inviterName: string;
  inviterEmail: string;
  inviterCompanyName?: string | null;
  websiteName: string;
  invitationLink: string;
  toEmail: string;
}

export const ClientInvitationCreateUser: React.FC<
  ClientInvitationCreateUserProps
> = ({
  inviterName = "Inviter",
  inviterEmail = "invitee@example.com",
  inviterCompanyName,
  websiteName = "เว็บไซต์ของเรา",
  invitationLink,
  toEmail,
}) => (
  <Html>
    <Head />
    <Preview>คำเชิญเข้าร่วมใช้งาน {websiteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          คำเชิญเข้าร่วมใช้งาน {websiteName} โดย {inviterEmail}
        </Heading>
        <Text style={text}>
          เรียน คุณ {toEmail},
          <br />
          เราขอเชิญคุณเข้าร่วมเป็นส่วนหนึ่งใน {websiteName}{" "}
          ซึงเป็นเว็บไซต์สําหรับการบริหารจัดการโครงการ
          <br />
          โดยคำเชิญนี้ส่งจาก {inviterName}{" "}
          {inviterCompanyName ? `(บริษัท ${inviterCompanyName})` : ""}
        </Text>
        <Text style={text}>
          โปรดใช้ลิ้งก์ด้านล่างเพื่อดำเนินการลงทะเบียนใช้งาน:
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={invitationLink}>
            คลิกที่นี่เพื่อเข้าร่วม
          </Button>
        </Section>
        <Text style={text}>
          หมายเหตุ: อีเมลนี้เป็นคำเชิญเฉพาะบุคคล และสามารถใช้ได้เพียงครั้งเดียว
          อีเมลที่คุณใช้งานจะเชื่อมโยงกับบัญชีผู้ใช้งานของคุณโดยตรง
          หากคุณมีคำถามใด ๆ โปรดติดต่อเรา
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          ขอขอบคุณที่เลือก {websiteName}! หากต้องการข้อมูลเพิ่มเติม
          โปรดอย่าลังเลที่จะติดต่อทีมงานของเรา
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ClientInvitationCreateUser;

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
  backgroundColor: "#007bff",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "14px 24px",
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
