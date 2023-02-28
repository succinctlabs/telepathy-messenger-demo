import { useState } from "react";
import { twMerge } from "tailwind-merge";

function SliderButton({
  name,
  value,
  state,
  setState,
}: {
  name: string;
  value: boolean;
  state: boolean;
  setState: (index: boolean) => void;
}) {
  return (
    <label
      className={twMerge(
        "p-2 rounded-lg cursor-pointer h-[40px] w-[120px] flex justify-center z-20 transition-colors",
        state === value && "text-succinct-teal-5"
      )}
    >
      {name}
      <input
        type="radio"
        name="messageFilter"
        checked={state === value}
        onChange={() => setState(value)}
        hidden
      />
    </label>
  );
}

export function SliderSelector({
  state,
  setState,
}: {
  state: boolean;
  setState: (newState: boolean) => void;
}) {
  return (
    <div className="relative flex flex-row p-1 space-x-0 w-fit bg-succinct-teal-10 rounded-xl font-sans-regular items-center">
      {/* <button>Sent by me</button> */}
      <SliderButton
        name="Sent by me"
        value={false}
        state={state}
        setState={setState}
      />
      <SliderButton
        name="All messages"
        value={true}
        state={state}
        setState={setState}
      />
      <div
        className={twMerge(
          "bg-succinct-teal m-0 w-[120px] absolute rounded-lg h-[40px] transition-transform",
          state && "translate-x-[100%]"
        )}
      />
    </div>
  );
}
