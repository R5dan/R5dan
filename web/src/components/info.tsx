import { InfoIcon } from "lucide-react";

const STYLES = {
  info: {
    icon: InfoIcon,
    edge: "rgb(68, 51, 255)",
    background: "rgb(232, 241, 252)",
  },
};

export default async function Info({
  children,
  header,
  type,
}: {
  children: string;
  header: string;
  type: "info";
}) {
  const STYLE = STYLES[type];
  return (
    <aside className={`flex flex-col gap-2 bg-[${STYLE.background}]]`}>
      <div>
        <STYLE.icon className={`bg-[${STYLE.edge}] h-6 w-6`} />
        <div className={`bg-[${STYLE.edge}]`} />
      </div>
      <div>
        <div>
          <h3>{header}</h3>
        </div>
        {children}
      </div>
    </aside>
  );
}
