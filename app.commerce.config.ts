import { defineConfig } from "@adobe/aio-commerce-lib-app/config";

export default defineConfig({
  metadata: {
    id: "my-commerce",
    displayName: "my-commerce",
    version: "1.0.0",
    description:
      "A custom Adobe Commerce application. Fill description for your app.",
  },
  businessConfig: {
    schema: [
      {
        type: "list",
        name: "sampleList",
        label: "Sample List",
        selectionMode: "multiple",
        default: ["a"],
        options: [
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
        ],
      },
      {
        type: "text",
        name: "sampleText",
        label: "Sample Text",
        default: "Hello, world!",
      },
    ],
  },
  adminUiSdk: {
    registration: {
      menuItems: [
        {
          id: "order_enrichment_admin::apps",
          title: "Order Enrichment",
          isSection: true,
          sortOrder: 100,
        },
        {
          id: "order_enrichment_admin::enriched_orders",
          title: "Enriched Orders",
          parent: "order_enrichment_admin::apps",
          sortOrder: 1,
        },
      ],
    },
  },
});
