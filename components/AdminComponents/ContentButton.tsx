import Viewer from "./Viewer";
export default function ContentButton({
  value,
  label,
  setInput,
  optional,
  title,
  type,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setInput: any;
  optional: boolean;
  title: string;
  type: string;
}) {
  return (
    <button
      className={`${!value ? "add_content_btn" : "text-left"} ${
        title === "shortDesc" ? "" : "mt-4"
      }`}
      onClick={() => {
        setInput({ type: type, title: title, label: label });
      }}
    >
      {!value && !optional && label}
      {value && type === "text" && title !== "imagesHeadingSmallText" && (
        <div
          className={`${
            title === "title" || title === "imagesHeadingMainText"
              ? "text-3xl"
              : "text-xl"
          } !text-left font-bold text-zinc-800 drop-shadow-lg shadow-black`}
        >
          {value}
        </div>
      )}
      {title === "imagesHeadingSmallText" && (
        <div
          className={`!text-left italic text-sm text-zinc-500 drop-shadow-lg shadow-black`}
        >
          {value}
        </div>
      )}
      {value && type === "html" && <Viewer value={value} />}
      {!value && optional && (
        <>
          {label}
          <br />
          <span className="text-sm font-normal">(opcjonalnie)</span>
        </>
      )}
    </button>
  );
}
