import React from "react";

function TileSelectModal({ content, onSelect }) {
  console.log("TileSelectModal");
  console.log(content);
  return (
    <div className="flex justify-start">
      <div className="text-start w-full ">
        <p className="italic font-light text-sm">Select Tile</p>
        <ul>
          {content.map((item) => (
            <li
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="cursor-pointer hover:bg-gray-100 p-1 bg-gray-50 border rounded font-light text-sm"
            >
              {item.form.title.text} {/* Assuming each content has a title */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default TileSelectModal;
