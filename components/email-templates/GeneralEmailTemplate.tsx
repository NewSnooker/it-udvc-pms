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
import { MailProps } from "../dashboard/EmailCompose";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

export const GeneralEmailTemplate: React.FC<MailProps> = ({
  name,
  from,
  to,
  subject,
  html,
  attachments,
}) => (
  <Html>
    <Head />
    <Preview>{subject}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{subject}</Heading>
        <Section>
          <div style={content}>
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
          </div>
        </Section>

        {attachments && attachments.length > 0 && (
          <Section style={attachmentSection}>
            <Text style={text}>
              📎
              <strong>ไฟล์แนบ:</strong>
            </Text>
            <ul style={attachmentList}>
              {attachments.map((file, index) => (
                <li key={index} style={attachmentItem}>
                  <a
                    href={file.url}
                    download={file.title}
                    style={attachmentLink}
                  >
                    {file.title}
                  </a>{" "}
                  ({(file.size / 1000).toFixed(2)} KB)
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            อีเมลนี้ส่งโดย <strong> {`${name} <${from}>`}</strong>
            <br />
            หากคุณมีคำถามใดๆโปรดติดต่อเรา.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default GeneralEmailTemplate;

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
