import React from 'react';
import { Box, Text } from 'ink';
import type { Skill } from '../../scanner.js';
import { SkillItem } from './SkillItem.js';

interface ToolGroupProps {
  toolName: string;
  toolDisplayName: string;
  skillsPath: string;
  skills: Skill[];
  globalSelectedIndex: number; // global index for determining selection
  startIndex: number; // starting global index of this group
}

export function ToolGroup({
  toolDisplayName,
  skillsPath,
  skills,
  globalSelectedIndex,
  startIndex,
}: ToolGroupProps): React.ReactElement {
  const isGroupSelected =
    globalSelectedIndex >= startIndex &&
    globalSelectedIndex < startIndex + skills.length;

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box paddingX={1}>
        <Text
          bold
          color={isGroupSelected ? 'cyan' : 'yellow'}
          underline={isGroupSelected}
        >
          {toolDisplayName}
        </Text>
        <Text color="gray">{`  ${skillsPath}`}</Text>
      </Box>
      {skills.length === 0 ? (
        <Box paddingX={3}>
          <Text color="gray" italic>
            No skills found
          </Text>
        </Box>
      ) : (
        skills.map((skill, idx) => (
          <SkillItem
            key={skill.id}
            skill={skill}
            isSelected={startIndex + idx === globalSelectedIndex}
          />
        ))
      )}
    </Box>
  );
}
