import React from "react";
import { ASSETS } from "@/constants";
import { type AppLogoType } from "@@types/assets.d";

type Props = {
  type: AppLogoType;
  height?: number;
  width?: number;
};

export const AppLogo: React.FC<Props> = (props) => {
  const src = ASSETS[props.type];
  const size = {
    height: props.height || 150,
    width: props.width || 250,
  };

  return (
    <div>
      <img
        src={src}
        alt={`${props.type}.png`}
        className="my-auto mx-auto"
        style={{
          height: size.height,
          width: size.width,
        }}
      />
    </div>
  );
};
