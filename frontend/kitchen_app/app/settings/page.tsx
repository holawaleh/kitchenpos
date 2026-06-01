"use client";

import Link
from "next/link";

import {
  Users,
  Shield,
  KeyRound,
  ScrollText,
  Settings,
  ChevronRight,
} from "lucide-react";

const sections = [
  {
    title:
      "Staff Management",

    description:
      "Create and manage operational staff accounts",

    href:
      "/settings/staff",

    icon:
      Users,

    bg:
      "bg-blue-50",

    border:
      "border-blue-200",

    iconBg:
      "bg-blue-100",

    iconColor:
      "text-blue-700",
  },

  {
    title:
      "Roles & Permissions",

    description:
      "Manage operational access structure",

    href:
      "/settings/roles",

    icon:
      Shield,

    bg:
      "bg-violet-50",

    border:
      "border-violet-200",

    iconBg:
      "bg-violet-100",

    iconColor:
      "text-violet-700",
  },

  {
    title:
      "Password & Security",

    description:
      "Update credentials and security settings",

    href:
      "/change-password",

    icon:
      KeyRound,

    bg:
      "bg-emerald-50",

    border:
      "border-emerald-200",

    iconBg:
      "bg-emerald-100",

    iconColor:
      "text-emerald-700",
  },

  {
    title:
      "Audit Logs",

    description:
      "Track operational activities and repayments",

    href:
      "/settings/audit",

    icon:
      ScrollText,

    bg:
      "bg-orange-50",

    border:
      "border-orange-200",

    iconBg:
      "bg-orange-100",

    iconColor:
      "text-orange-700",
  },
];

export default function SettingsPage() {

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <div
          className="
            flex items-center
            gap-4
          "
        >

          <div
            className="
              flex h-16
              w-16
              items-center
              justify-center
              rounded-3xl
              bg-zinc-100
            "
          >
            <Settings
              className="
                h-8 w-8
              "
            />
          </div>

          <div>

            <h1
              className="
                text-5xl
                font-black
                tracking-tight
              "
            >
              Settings
            </h1>

            <p
              className="
                mt-2
                text-lg
                text-zinc-500
              "
            >
              System administration
              and operational governance
            </p>
          </div>
        </div>
      </div>

      {/* GRID */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          md:grid-cols-2
        "
      >

        {sections.map(
          (section) => {

            const Icon =
              section.icon;

            return (

              <Link
                key={
                  section.title
                }
                href={
                  section.href
                }
                className={`
                  rounded-[32px]
                  border
                  p-6
                  transition-all
                  hover:scale-[1.02]
                  hover:shadow-lg

                  ${section.bg}
                  ${section.border}
                `}
              >

                <div
                  className="
                    flex items-start
                    justify-between
                  "
                >

                  <div>

                    <div
                      className={`
                        flex h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        mb-5

                        ${section.iconBg}
                      `}
                    >
                      <Icon
                        className={`
                          h-7 w-7

                          ${section.iconColor}
                        `}
                      />
                    </div>

                    <h2
                      className="
                        text-2xl
                        font-black
                      "
                    >
                      {
                        section.title
                      }
                    </h2>

                    <p
                      className="
                        mt-3
                        text-zinc-500
                        leading-relaxed
                      "
                    >
                      {
                        section.description
                      }
                    </p>
                  </div>

                  <ChevronRight
                    className="
                      h-6 w-6
                      text-zinc-400
                    "
                  />
                </div>
              </Link>
            );
          }
        )}
      </div>
    </div>
  );
}