import { Devvit } from "@devvit/public-api";

interface CellProps {
  alive: boolean;
  onPress: () => void;
}

export default ({ alive, onPress }: CellProps) => {
  return (
    <zstack
      backgroundColor={alive ? "primary-background" : "secondary-background"}
      border="thin"
      borderColor="neutral-background"
      onPress={onPress}
      cornerRadius="small"
    >
      <spacer size="medium" shape="square" />
    </zstack>
  );
};
