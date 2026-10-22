import { Fragment } from "react";

export function interpolateNodes(template: string, nodes: Record<string, React.ReactNode>) {
  return template.split(/(\{\w+\})/g).map((part, index) => {
    const name = part.match(/^\{(\w+)\}$/)?.[1];
    return <Fragment key={index}>{name && name in nodes ? nodes[name] : part}</Fragment>;
  });
}
