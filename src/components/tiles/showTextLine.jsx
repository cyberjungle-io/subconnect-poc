"use client";
import React, { useState, useEffect } from "react";

export default function ShowTextLine({ line,index }) {
  return (
    <div
      key={index}
      style={{
        color: line.color,
        fontSize: `${line.fontSize}px`,
      }}
    >
      {line.text ? line.text : `text ${index + 1} `}
    </div>
  );
}
