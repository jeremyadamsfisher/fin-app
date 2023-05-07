import { MultiSelect, useMultiSelect } from "chakra-multiselect";

export function TagSelector(props: any) {
  const { value, onChange, options } = useMultiSelect({
    value: [],
    options: [
      { label: "Food", value: "food" },
      { label: "Entertainment", value: "entertainment" },
      { label: "Transportation", value: "transportation" },
      { label: "Other", value: "other" },
    ],
  });
  return (
    <MultiSelect
      options={options}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}
