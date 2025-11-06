"use client";

import { useState } from "react";
import { Control, Controller, FieldError } from "react-hook-form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import countryList from "react-select-country-list";

const CountrySelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  // Get country options with flags
  const countries = countryList().getData();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="country-select-trigger"
        >
          {value ? (
            <span className="flex items-center gap-2">
              <img
                src={`https://flagcdn.com/24x18/${value.toLowerCase()}.png`}
                alt={`${value} flag`}
                width={24}
                height={18}
                className="rounded-sm"
                loading="lazy"
              />
              {countries.find((c) => c.value === value)?.label}
            </span>
          ) : (
            <span>Select a country</span>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 bg-gray-800 border-gray-600 "
        align="start"
      >
        <Command>
          <CommandInput
            placeholder="Search Countries ..."
            className="country-select-empty"
          ></CommandInput>
          <CommandEmpty className="country-select-empty">
            No country found.
          </CommandEmpty>
          <CommandList className="max-h-60 bg-gray-800 scrollbar-hide-default">
            <CommandGroup className="bg-gray-800">
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  onSelect={() => {
                    onChange(country.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-yellow-500",
                      value === country.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex items-center gap-2">
                    <img
                      src={`https://flagcdn.com/24x18/${country.value.toLowerCase()}.png`}
                      alt={`${country.label} flag`}
                      width={24}
                      height={18}
                      className="rounded-sm"
                      loading="lazy"
                    />
                    <span>{country.label}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CountrySelectField = ({
  name,
  label,
  control,
  error,
  required = false,
}: CountrySelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <CountrySelect value={field.value} onChange={field.onChange} />
        )}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default CountrySelectField;
