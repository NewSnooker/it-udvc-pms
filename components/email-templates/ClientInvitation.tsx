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
  message?: string;
  loginEmail?: string;
  loginPassword?: string;
  loginLink?: string;
}

export const ClientInvitation: React.FC<ClientInvitationProps> = ({
  clientName,
  projectName = "Project",
  message,
  loginEmail = "client@example.com",
  loginPassword = "password",
  loginLink,
}) => (
  <Html>
    <Head />
    <Preview>Invitation to collaborate on {projectName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Project Collaboration Invitation</Heading>
        <Text style={text}>Dear {clientName},</Text>
        <Text style={text}>{message}</Text>
        <Text style={text}>
          We're excited to invite you to collaborate on {projectName}. Your
          input is valuable to us, and we look forward to working together.
        </Text>
        <Text style={text}>
          To get started, please use the following login details:
        </Text>
        <Section style={codeContainer}>
          <Text style={codeText}>Email: {loginEmail}</Text>
          <Text style={codeText}>Password: {loginPassword}</Text>
        </Section>
        <Section style={buttonContainer}>
          <Button style={button} href={loginLink}>
            View Project
          </Button>
        </Section>

        <Text style={text}>
          For security reasons, we recommend changing your password upon first
          login.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          If you have any questions, please don't hesitate to reach out. We're
          looking forward to collaborating with you!
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
