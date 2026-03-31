import React from 'react';
import { Box, Text } from 'ink';

interface FooterProps {
  message?: string;
  isError?: boolean;
}

export function Footer({ message, isError }: FooterProps): React.ReactElement {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Box borderStyle="single" borderColor="gray" paddingX={1}>
        <Text color="gray">
          {'↑↓'} Navigate{'  '}
        </Text>
        <Text color="yellow">{'Space'}</Text>
        <Text color="gray">
          {' '}Toggle{'  '}
        </Text>
        <Text color="yellow">{'Q'}</Text>
        <Text color="gray">
          {' '}Quit{'  '}
        </Text>
        <Text color="yellow">{'C'}</Text>
        <Text color="gray">
          {' '}Config path
        </Text>
      </Box>
      {message && (
        <Box marginTop={0} paddingX={1}>
          <Text color={isError ? 'red' : 'green'}>{message}</Text>
        </Box>
      )}
    </Box>
  );
}
