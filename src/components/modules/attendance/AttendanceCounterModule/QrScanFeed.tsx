import React from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

export const QrScanFeed: React.FC = () => {
  return (
    <div className="w-full h-full p-10">
      <div className="w-3/4 h-[520px] my-3 mx-auto">
        <Scanner
          onScan={(result) => console.log(result)}
          constraints={{
            facingMode: "environment",
          }}
        />
      </div>
    </div>
  );
};
