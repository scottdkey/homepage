import { PropsWithChildren } from "react";
import "./Accordion.css";

export const Accordion = ({ children }: PropsWithChildren) => {
  return <div className="accordion">{children}</div>;
};

export const AccordionItem = ({
  label,
  children,
  active,
  handleClick,
}: PropsWithChildren<{
  label: string;
  handleClick: () => void;
  active: boolean;
}>) => {
  return (
    <article key={label} onClick={handleClick}>
      <input id={label} type="radio" name="accordion-item" checked={active} />
      <label htmlFor={label}>
        <h2>{label}</h2>
      </label>
      <div>{children}</div>
    </article>
  );
};
