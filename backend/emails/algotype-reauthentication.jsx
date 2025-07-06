import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

const baseUrl = "https://algotype.net";

export default function AlgotypeMagicLinkEmail({ magicLink, userName }) {
  return (
    <Html>
      <Head />
      <Preview>Reauthenticate your AlgoType account</Preview>
      <Tailwind>
        <Body className="bg-white font-sans text-[#040404]">
          <Container className="p-10 max-w-[512px]">
            <Section className="mt-8 mb-16">
              <div className="flex items-center justify-center">
                <Img
                  src={`${baseUrl}/logo.png`}
                  width="28"
                  height="28"
                  alt="Logo"
                  className="mr-2"
                  style={{
                    filter:
                      "invert(28%) sepia(87%) saturate(2382%) hue-rotate(187deg) brightness(99%) contrast(104%)",
                  }}
                />
                <Text className="text-[24px] font-semibold m-0">AlgoType</Text>
              </div>
            </Section>

            <Text className="text-[20px] font-bold text-[#040404]">
              Reauthenticate Your Account
            </Text>

            <Text className="text-[14px] text-[#16181b] mb-12">
              Use the code below to reauthenticate your AlgoType account. This
              code is valid for the next 15 minutes.
            </Text>

            <Section className="text-center mb-6">
              <Text className="text-4xl font-mono font-semibold">123-456</Text>
            </Section>

            <Text className="text-[12px] text-[#8a8a90] text-center mt-12 mb-0">
              If you didn’t request this link, you can safely ignore this email.
            </Text>

            <div className="flex items-center justify-center">
              <Img
                src={`${baseUrl}/logo.png`}
                width="16"
                height="16"
                alt="Logo"
                className="mr-1"
                style={{
                  filter:
                    "invert(28%) sepia(87%) saturate(2382%) hue-rotate(187deg) brightness(99%) contrast(104%)",
                }}
              />
              <Text className="text-[12px] text-[#8a8a90]">
                <Link href="https://algotype.net" className="text-[#0096f5]">
                  AlgoType.net
                </Link>{" "}
                | typing practice for programmers
              </Text>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
