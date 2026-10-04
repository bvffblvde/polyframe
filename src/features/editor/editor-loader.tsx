"use client";

import dynamic from "next/dynamic";

export const EditorLoader = dynamic(() => import("./editor-shell").then((m) => m.EditorApp), { ssr: false });
export const ViewerLoader = dynamic(() => import("../viewer/viewer").then((m) => m.Viewer), { ssr: false });
