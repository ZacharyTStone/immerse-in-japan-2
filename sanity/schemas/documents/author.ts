import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  icon: UserIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "picture",
      title: "Picture",
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity.",
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.picture as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            });
          },
        },
      ],
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: "alt",
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "jlptLevel",
      title: "JLPT Level",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-") // スペースをハイフンに置換
            .replace(/[^\w\-]+/g, "") // 特殊文字を削除
            .slice(0, 96), // 最大長を制限
      },
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "featuredLinks",
      title: "Featured Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "donationLink",
      title: "Donation Link",
      type: "string",
    }),
    defineField({
      name: "socialMedia",
      title: "Social Media Usernames",
      type: "object",
      fields: [
        { name: "twitter", type: "string", title: "Twitter" },
        { name: "instagram", type: "string", title: "Instagram" },
        { name: "linkedin", type: "string", title: "LinkedIn" },
      ],
    }),
  ],
});
