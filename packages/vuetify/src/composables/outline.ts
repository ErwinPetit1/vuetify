// Utilities
import { computed, CSSProperties } from "vue";
import { propsFactory } from "@/util";
import { useTheme } from "@/framework";

// Types
export interface OutlineProps {
  style?: string;
  width?: string;
  color?: string;
}

// Composables
export const makeOutlineProps = propsFactory(
  {
    border: [Boolean, Number, String],
    color: String,
  },
  "outline"
);

export function useOutline(props: OutlineProps) {
  const theme = useTheme();

  const outlineStyles = computed<CSSProperties>(() => {
    const properties: CSSProperties = {};
    properties.outlineWidth = props?.width ?? "1px";
    properties.outlineStyle = props?.style ?? "dashed";

    properties.outlineColor =
      theme.current.value.colors[`${props.color}`] ?? props.color;

    return properties;
  });

  return { outlineStyles };
}
