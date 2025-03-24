import React from "react";
import ReactSelect, {
  components,
  StylesConfig,
  MultiValueProps,
  MultiValue,
  ActionMeta,
  PropsValue,
  OptionsOrGroups,
  GroupBase,
} from "react-select";

import { getInitial } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// Define the shape of your option items
interface OptionType {
  label: string;
  value: number | string;
}

// Custom styles type
const customStyles: StylesConfig<OptionType, true> = {
  control: (styles) => ({
    ...styles,
    borderRadius: "15px",
    backgroundColor: "#EAF4FC",
    padding: "14px",
    boxShadow: "none",
    outline: "none",
    borderColor: "transparent",
    "&:hover": {
      borderColor: "transparent",
    },
  }),
  placeholder: (styles) => ({
    ...styles,
    // color: "#663F30",
    fontSize: "14px",
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "white",
    paddingTop: "6px",
    paddingBottom: "6px",
    boxShadow: "0px 4px 5.5px 0px rgba(102, 63, 48, 0.06)",
    paddingLeft: "10px",
    paddingRight: "10px",
    borderRadius: "5px",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    padding: "0px",
    // color: "#663f30",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    // color: "#663F30",
    transform: "scale(1.5)",
    backgroundColor: "white",
    ":hover": {
      backgroundColor: "white",
      //   color: "#663F30",
    },
  }),
};

// Custom MultiValue component to display avatars with initials
const CustomMultiValue = (props: MultiValueProps<OptionType, true>) => {
  const { data } = props;
  const initials = getInitial(data.label);

  return (
    <components.MultiValue {...props} className="flex items-center gap-2">
      <Avatar className="flex justify-center items-center h-4 w-4 bg-blue-100">
        <AvatarImage src={""} alt={data.label} />
        <AvatarFallback className="bg-accent text-center text-2xs">
          {initials}
        </AvatarFallback>
      </Avatar>
      <components.MultiValueLabel {...props} />
    </components.MultiValue>
  );
};

// Props interface for the CustomReactSelect component
type CustomReactSelectProps = {
  styles?: StylesConfig<OptionType, true>;
  options: OptionsOrGroups<OptionType, GroupBase<OptionType>> | undefined;
  value: PropsValue<OptionType> | undefined;
  onChange:
    | ((
        newValue: MultiValue<OptionType>,
        actionMeta: ActionMeta<OptionType>
      ) => void)
    | undefined;
  placeholder?: string;
  isLoading: boolean;
  showSelectAll?: boolean;
};

// Main Component
const CustomReactSelect: React.FC<CustomReactSelectProps> = ({
  styles = customStyles,
  options,
  value,
  isLoading,
  onChange,
  placeholder,
  showSelectAll = false,
}) => {
  // Function to handle "Select All" option
  const handleSelectAll = () => {
    if (!options) return;

    const allOptions = options as OptionType[];

    // Always select all options when the button is clicked
    onChange &&
      onChange(allOptions, {
        action: "select-option",
        option: allOptions[allOptions.length - 1],
      });
  };

  return (
    <div className="relative">
      {showSelectAll && options && (options as OptionType[]).length > 0 && (
        <div className="absolute right-20 top-5 z-10">
          <button
            type="button"
            className="text-xs text-primary hover:text-primary/80"
            onClick={handleSelectAll}
          >
            Select All
          </button>
        </div>
      )}
      <ReactSelect<OptionType, true>
        isMulti
        styles={styles}
        isLoading={isLoading}
        components={{ MultiValue: CustomMultiValue }}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default CustomReactSelect;
