import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import { FooterLink } from "./FooterLink";
import { FooterLinkColumn } from "./FooterLinkColumn";
import { links } from "./links";

import { Container } from "@/components/footer/Container";

export const Footer = () => {
  return (
    <div className={twMerge("relative", "z-10")}>
      <Container>
        <div className="flex flex-col sm:flex-row justify-between">
          <div
            className={twMerge(
              "flex flex-col",
              "w-full sm:w-[300px] shrink-0",
              "mt-[34px] sm:mt-[58px] lg:mt-[69px]",
              "mb-[41px] lg:mb-[72px]"
            )}
          >
            <Link href={links.home}>
              <Image
                src="/svgs/succinct.svg"
                alt="succinct-logo"
                height={45}
                width={129}
              />
            </Link>
            <div className="hidden sm:flex text-[16px] leading-[21px] text-succinct-teal opacity-50 mt-[21px]">
              © 2023 Succinct Labs
            </div>
          </div>
          <div
            className={twMerge(
              "w-full",
              "sm:mt-[62px] lg:mt-[59px]",
              "mb-[48px] sm:mb-[59px]",
              "flex flex-row flex-wrap gap-y-[40px]",
              "justify-start md:justify-end"
            )}
          >
            <FooterLinkColumn title="company">
              <FooterLink href={"https://succinct.xyz"}>Home</FooterLink>
              <FooterLink href={links.careers}>Careers</FooterLink>
              {/* <FooterLink href={links.terms}>Terms of Service</FooterLink> */}
              {/* <FooterLink href={links.privacy}>Privacy Policy</FooterLink> */}
            </FooterLinkColumn>
            <FooterLinkColumn title="community">
              <FooterLink href={links.blog}>Blog</FooterLink>
              <FooterLink href={links.twitter}>Twitter</FooterLink>
              <FooterLink href={links.discord}>Discord</FooterLink>
            </FooterLinkColumn>
            <FooterLinkColumn title="developers">
              <FooterLink href={links.docs}>Docs</FooterLink>
              <FooterLink href={links.github}>Github</FooterLink>
              {/* <FooterLink href={links.audit}>Audit</FooterLink> */}
              {/* <FooterLink href={links.faq}>FAQ</FooterLink> */}
            </FooterLinkColumn>
          </div>
          <div className="sm:hidden flex text-[16px] leading-[21px] text-succinct-teal opacity-50 mb-[28px]">
            © 2023 Succinct Labs
          </div>
        </div>
      </Container>
    </div>
  );
};
