export default function DownloadUnderline({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        //className={`lucide lucide-download-icon lucide-download ${className}`}
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      </svg>
    </div>
  );
}
