import React from "react";

export const LazyLoadComponent = (Component: React.ComponentType) => {
  return (
    <React.Suspense fallback={"Loading"}>
      <Component />
    </React.Suspense>
  );
};
