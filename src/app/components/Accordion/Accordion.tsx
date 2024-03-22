import { PropsWithChildren, useState } from "react";
import "./Accordion.css";

export const Accordion = ({ children }: PropsWithChildren) => {
  return <div className="accordion">{children}</div>;
};

export const AccordionItem = ({
  label,
  children,
}: PropsWithChildren<{
  label: string;
}>) => {
  const [open, setOpen] = useState(false);
  return (
    <article key={label}>
      <input
        id={label}
        type="checkbox"
        name="accordion-item"
        className="accordion-input"
        //here to prevent error
        onChange={() => {}}
        
      />
      <label
        htmlFor={label}
        className="label-wrapper"
        onClick={() => setOpen(!open)}
      >
        <h2 className="accordion-label">{label}</h2>
        <i
          className={`indicator glyphicon glyphicon-chevron-${
            open ? "down" : "up"
          }-custom  pull-right`}
        >
          <span className="sp-1"></span>
          <span className="sp-2"></span>
        </i>
      </label>
      <div className={`drawer-${open ? "open" : "closed"}`}>{children}</div>
    </article>
  );
};
