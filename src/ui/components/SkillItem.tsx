import React from 'react';
import { Box, Text } from 'ink';
import type { Skill } from '../../scanner.js';

interface SkillItemProps {
  skill: Skill;
  isSelected: boolean;
}

export function SkillItem({ skill, isSelected }: SkillItemProps): React.ReactElement {
  const indicator = isSelected ? '▶' : ' ';
  const toggle = skill.enabled ? '●' : '○';
  const toggleColor = skill.enabled ? 'green' : 'red';
  const status = skill.enabled ? 'enabled' : 'disabled';
  const statusColor = skill.enabled ? 'green' : 'red';

  return (
    <Box paddingX={2}>
      <Text color={isSelected ? 'cyan' : 'gray'}>{indicator} </Text>
      <Text color={toggleColor}>{toggle} </Text>
      <Text color={isSelected ? 'white' : 'gray'} bold={isSelected}>
        {skill.name}
      </Text>
      <Text color="gray">{skill.fileName !== skill.name ? ` (${skill.fileName})` : ''}</Text>
      <Text color={statusColor}>{`  [${status}]`}</Text>
    </Box>
  );
}
