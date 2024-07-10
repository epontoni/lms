import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.snow.css";

export default function RichText({
  value,
  onChange,
}: {
  value?: string;
  onChange: () => void;
}) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  return <ReactQuill theme="snow" value={value} onChange={onChange} />;
}
