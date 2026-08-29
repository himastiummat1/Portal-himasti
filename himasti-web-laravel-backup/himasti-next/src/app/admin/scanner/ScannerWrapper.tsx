"use client";
import dynamic from "next/dynamic";

const ScannerClient = dynamic(() => import("./ScannerClient"), { ssr: false });

export default function ScannerWrapper(props: { meetings: any[] }) {
  return <ScannerClient {...props} />;
}
