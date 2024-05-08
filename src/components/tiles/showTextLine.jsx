"use client";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShowTextLine({ line,index, isLoading}) {
  const showSkeleton = isLoading || !line.text;



  return (
    <div
      key={index}
      
      style={{
        color: line.color,
        fontSize: `${line.fontSize}px`,
      }}
    >

{showSkeleton ? (
        
        <div className="space-y-2">
          <Skeleton className="h-6 w-auto" /> 
          <Skeleton className="h-6 w-auto" /> 
        </div>
      ) : (
        
        line.text
      )}
    </div>
  );
}
