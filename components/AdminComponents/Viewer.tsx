"use client";
export interface ViewerProps {
  value: string;
}

export default function Viewer(props: ViewerProps) {
  return (
    <div
      className={`lg:prose-lg min-w-full prose`}
      dangerouslySetInnerHTML={{ __html: props.value }}
    />
  );
}
