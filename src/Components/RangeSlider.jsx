
import { Slider } from "@/Components/ui/slider";
export const RangeSlider = ({ value, onChange }) => {
  return (
    <div className="w-[100%] space-y-3">
      <Slider value={value} onValueChange={onChange} max={1} step={0.05} />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Min: {`${Math.ceil(value[0] * 100)}%`}</span>
        <span>Max:{`${Math.ceil(value[1] * 100)}%`}</span>
      </div>
    </div>
  );
};

export default RangeSlider;