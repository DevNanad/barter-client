import { useContext, createContext, ReactNode, ChangeEvent } from "react";

interface RadioProps {
  value: string;
  children: ReactNode;
}

interface RadioGroupProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
}

const RadioContext = createContext<{
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
} | undefined>(undefined);

export default function Radio({ children, ...props }: RadioProps) {
  const radioContext = useContext(RadioContext);

  if (!radioContext) {
    throw new Error("Radio components must be rendered within a RadioGroup");
  }

  const { value, onChange } = radioContext;

  return (
    <label
      className={`
        px-6 py-4 shadow rounded-lg cursor-pointer
        transition-all ${
          value === props.value
            ? "bg-gradient-to-t from-violet-200 to-violet-100 text-violet-800 shadow-violet-500 scale-105"
            : "bg-white hover:shadow-md shadow-gray-300"
        }
    `}
    >
      <input
        type="radio"
        className="hidden"
        checked={value === props.value}
        onChange={onChange}
        {...props}
      />
      {children}
    </label>
  );
}

export function RadioGroup({ value, onChange, children }: RadioGroupProps) {
  return (
    <RadioContext.Provider value={{ value, onChange }}>
      {children}
    </RadioContext.Provider>
  );
}
