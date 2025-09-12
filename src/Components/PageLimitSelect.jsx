import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const PageLimitSelect = ({pgLimitArray, onSelect}) => {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Show 50"/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {pgLimitArray.map((pgLimit) => (
            <SelectItem value={pgLimit} key={`page-limit-${pgLimit}`}>
              Show {pgLimit}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
