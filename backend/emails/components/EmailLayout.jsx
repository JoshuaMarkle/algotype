import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Link,
  Img,
  Button,
} from "@react-email/components";
import * as React from "react";

// Images must be absolute URLs on the live site; email clients cannot load
// relative paths. logo.png is already brand blue, so no CSS filter is needed
// (Gmail and Outlook strip filters anyway).
export const baseUrl = "https://algotype.net";

// Supabase builds these links from its template variables. They point at
// /auth/confirm, which verifies the token on the server, so a link works even
// when it is opened in a different browser or device than the one that asked.
export function confirmLink(type) {
  return `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=${type}&next={{ .RedirectTo }}`;
}

const colors = {
  fg: "#040404",
  fg2: "#16181b",
  muted: "#8a8a90",
  primary: "#315efc",
  link: "#0096f5",
};

// Inline styles only: many clients drop <style> blocks and flexbox
const styles = {
  body: {
    backgroundColor: "#ffffff",
    color: colors.fg,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    margin: 0,
  },
  container: { maxWidth: "512px", padding: "40px" },
  brand: { fontSize: "24px", fontWeight: 600, margin: 0, color: colors.fg },
  heading: { fontSize: "20px", fontWeight: 700, color: colors.fg },
  paragraph: { fontSize: "14px", lineHeight: "22px", color: colors.fg2 },
  button: {
    backgroundColor: colors.primary,
    color: "#ffffff",
    fontSize: "14px",
    textDecoration: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    display: "inline-block",
  },
  fallback: { fontSize: "12px", lineHeight: "18px", color: colors.muted },
  fallbackLink: { color: colors.link, wordBreak: "break-all" },
  note: {
    fontSize: "12px",
    color: colors.muted,
    textAlign: "center",
    margin: "48px 0 0",
  },
  footer: { fontSize: "12px", color: colors.muted, margin: 0 },
};

function Logo({ size }) {
  return (
    <Img
      src={`${baseUrl}/logo.png`}
      width={size}
      height={size}
      alt="AlgoType logo"
    />
  );
}

export default function EmailLayout({ preview, heading, children }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={{ margin: "32px 0 48px" }}>
            <Row>
              <Column align="center">
                <table role="presentation" cellPadding="0" cellSpacing="0">
                  <tbody>
                    <tr>
                      <td style={{ paddingRight: "8px" }}>
                        <Logo size="28" />
                      </td>
                      <td>
                        <Text style={styles.brand}>AlgoType</Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Column>
            </Row>
          </Section>

          <Text style={styles.heading}>{heading}</Text>
          {children}

          <Text style={styles.note}>
            If you didn&apos;t request this email, you can safely ignore it.
          </Text>

          {/* Footer */}
          <Section style={{ marginTop: "16px" }}>
            <Row>
              <Column align="center">
                <table role="presentation" cellPadding="0" cellSpacing="0">
                  <tbody>
                    <tr>
                      <td style={{ paddingRight: "4px" }}>
                        <Logo size="16" />
                      </td>
                      <td>
                        <Text style={styles.footer}>
                          <Link href={baseUrl} style={{ color: colors.link }}>
                            AlgoType.net
                          </Link>{" "}
                          | typing practice for programmers
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function Paragraph({ children }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

// Main call to action plus a plain-text copy of the link for clients that
// block buttons or mangle long URLs
export function ActionButton({ href, children }) {
  return (
    <>
      <Section style={{ textAlign: "center", margin: "32px 0 24px" }}>
        <Button href={href} style={styles.button}>
          {children}
        </Button>
      </Section>
      <Text style={styles.fallback}>
        Button not working? Paste this link into your browser:
        <br />
        <Link href={href} style={styles.fallbackLink}>
          {href}
        </Link>
      </Text>
    </>
  );
}

export function Code({ children }) {
  return (
    <Section style={{ textAlign: "center", margin: "32px 0 24px" }}>
      <Text
        style={{
          fontSize: "32px",
          fontWeight: 600,
          letterSpacing: "6px",
          fontFamily: "Menlo, Consolas, 'Courier New', monospace",
          color: colors.fg,
        }}
      >
        {children}
      </Text>
    </Section>
  );
}
