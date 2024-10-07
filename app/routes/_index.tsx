import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "find the features" },
    { name: "description", content: "See where your favorite artists are featured" },
  ];
};

export default function Index() {
  return (
    <div>hello</div>
  );
}

