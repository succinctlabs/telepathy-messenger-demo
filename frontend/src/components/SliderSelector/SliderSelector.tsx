import { useState } from "react";
import { twMerge } from "tailwind-merge";

function SliderButton({
  name,
  index,
  selectedIndex,
  setSelectedIndex,
}: {
  name: string;
  index: number;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}) {
  return (
    <label
      className={twMerge(
        "p-2 rounded-lg cursor-pointer h-[40px] w-[120px] flex justify-center z-20 transition-colors",
        selectedIndex === index && "text-succinct-teal-5"
      )}
    >
      {name}
      <input
        type="radio"
        name="messageFilter"
        checked={selectedIndex === index}
        onChange={() => setSelectedIndex(index)}
        hidden
      />
    </label>
  );
}

export function SliderSelector() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  console.log(selectedIndex);
  return (
    <div className="relative flex flex-row p-1.5 space-x-0 w-fit bg-succinct-teal-10 rounded-xl font-sans-regular">
      {/* <button>Sent by me</button> */}
      <SliderButton
        name="Sent by me"
        index={0}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
      <SliderButton
        name="All messages"
        index={1}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
      <div
        className={twMerge(
          "bg-succinct-teal m-0 w-[120px] absolute rounded-lg h-[40px] transition-transform",
          selectedIndex === 1 && "translate-x-[100%]"
        )}
      />
    </div>
  );
}
