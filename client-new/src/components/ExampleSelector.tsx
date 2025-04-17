import { Portal, Select, createListCollection } from "@chakra-ui/react";

const examples = createListCollection({
  items: [
    { label: "React.js", value: "react" },
    { label: "Vue.js", value: "vue" },
    { label: "Angular", value: "angular" },
    { label: "Svelte", value: "svelte" },
  ],
});

const ExampleSelector: React.FC = () => {
  return (
    <Select.Root collection={examples} size="sm" width="75%" shadow="sm">
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Choose an Example" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {examples?.items?.map((example) => (
              <Select.Item item={example} key={example.value}>
                {example.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}

export default ExampleSelector;