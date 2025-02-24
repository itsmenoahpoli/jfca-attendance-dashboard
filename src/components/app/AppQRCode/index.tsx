import React from "react";
import QRCode from "react-qr-code";

type Props = {
  size?: number;
  color?: string;
  value: string;
};

export const AppQRCode: React.FC<Props> = (props) => {
  const propsWithDefaultValues = {
    size: props.size || 250,
    color: props.color || "#000",
  };

  return (
    <div>
      <QRCode
        size={propsWithDefaultValues.size}
        value={props.value}
        fgColor={propsWithDefaultValues.color}
      />
    </div>
  );
};
