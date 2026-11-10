// Renders a type code, showing each undetermined position ("_") as a
// dimmed lowercase "x" so the decided letters stand out.
export default function CodeText({ code }) {
  return code.split(/(_)/).map((part, i) =>
    part === "_" ? (
      <span key={i} className="code-x">x</span>
    ) : (
      part
    )
  );
}
