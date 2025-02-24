import React from "react";
import { useAtom } from "jotai";
import { authStoreAtom } from "@/stores";

export const AppSessionManager: React.FC = () => {
  const [authStoreData] = useAtom(authStoreAtom);

  console.log(authStoreData);

  return <></>;
};
