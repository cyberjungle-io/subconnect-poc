import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


const ColorControl = ({ label, value, onChange }) => (
    <Label>
      {label}:
      <Input
        type="color"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 cursor-pointer"
      />
    </Label>
  );

export default ColorControl;
