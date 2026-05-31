import React, { useEffect, useRef } from "react";
import { usePublicConfig, loadScript } from "../hooks/usePublicConfig";

export interface ParsedAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (street: string) => void;
  onAddressSelect: (parsed: ParsedAddress) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

function parseAddressComponents(
  components: Array<{ long_name: string; short_name: string; types: string[] }>
): ParsedAddress {
  const get = (type: string, useShort = false) => {
    const part = components.find(c => c.types.includes(type));
    return part ? (useShort ? part.short_name : part.long_name) : "";
  };

  const streetNumber = get("street_number");
  const route = get("route");
  const street = [streetNumber, route].filter(Boolean).join(" ");

  return {
    street,
    city: get("locality") || get("sublocality") || get("administrative_area_level_2"),
    state: get("administrative_area_level_1", true),
    zipCode: get("postal_code"),
    country: get("country")
  };
}

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  disabled,
  className,
  placeholder
}: AddressAutocompleteProps) {
  const { googleMapsApiKey, loaded } = usePublicConfig();
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const onAddressSelectRef = useRef(onAddressSelect);

  useEffect(() => {
    onChangeRef.current = onChange;
    onAddressSelectRef.current = onAddressSelect;
  }, [onChange, onAddressSelect]);

  useEffect(() => {
    if (!loaded || !googleMapsApiKey || !inputRef.current) return;

    let cancelled = false;

    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`,
      "google-maps-places"
    )
      .then(() => {
        if (cancelled || !inputRef.current || !window.google?.maps?.places) return;

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          fields: ["address_components", "formatted_address"]
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.address_components) return;

          const parsed = parseAddressComponents(place.address_components);
          if (!parsed.street && place.formatted_address) {
            parsed.street = place.formatted_address.split(",")[0] || place.formatted_address;
          }

          onChangeRef.current(parsed.street);
          onAddressSelectRef.current(parsed);
        });
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [loaded, googleMapsApiKey]);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        name="street"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
        placeholder={placeholder || "Start typing your address..."}
        className={className}
        autoComplete="off"
      />
      {loaded && googleMapsApiKey && (
        <p className="text-[10px] text-slate-400 mt-1 ml-1">
          Powered by Google Maps — select a suggestion to auto-fill city &amp; zip
        </p>
      )}
    </div>
  );
}
