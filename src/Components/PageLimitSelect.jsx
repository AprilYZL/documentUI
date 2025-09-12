import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

export const PageLimitSelect = ({pgLimitArray, onSelect, limit}) => {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[100px] border-2 border-blue-500 rounded-lg shadow-sm bg-white hover:bg-blue-50 focus:ring-2 focus:ring-blue-400">
          <SelectValue placeholder={limit}/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {pgLimitArray.map((pgLimit) => (
            <SelectItem value={pgLimit} key={`page-limit-${pgLimit}`}>
              {pgLimit}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
