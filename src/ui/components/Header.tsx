import React from 'react';
import { Box, Text } from 'ink';

export function Header(): React.ReactElement {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box
        borderStyle="round"
        borderColor="cyan"
        paddingX={2}
        paddingY={0}
        justifyContent="center"
      >
        <Text bold color="cyan">
          📦 skillbox-cli
        </Text>
        <Text color="gray">{'  '}AI Tool Skill Manager</Text>
      </Box>
    </Box>
  );
}
