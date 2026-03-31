import React, { useState, useCallback, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { ToolGroup } from './components/ToolGroup.js';
import { scanAllSkills, type Skill, type ScanResult } from '../scanner.js';
import { toggleSkill } from '../manager.js';
import { getConfig, getConfigPath } from '../config.js';

interface AppProps {
  initialScan?: ScanResult;
}

export function App({ initialScan }: AppProps): React.ReactElement {
  const { exit } = useApp();
  const [scanResult, setScanResult] = useState<ScanResult>(
    () => initialScan ?? scanAllSkills()
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState(false);

  // Flatten skills preserving tool grouping order
  const flatSkills: Skill[] = scanResult.tools.flatMap(
    (tool) => scanResult.skillsByTool[tool.name] ?? []
  );
  const totalSkills = flatSkills.length;

  const showMessage = useCallback((msg: string, error = false) => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => setMessage(''), 3000);
  }, []);

  const refresh = useCallback(() => {
    const newScan = scanAllSkills();
    setScanResult(newScan);
  }, []);

  const handleToggle = useCallback(() => {
    if (totalSkills === 0) return;
    const skill = flatSkills[selectedIndex];
    if (!skill) return;

    try {
      const newEnabled = !skill.enabled;
      toggleSkill(skill);
      const action = newEnabled ? 'enabled' : 'disabled';
      showMessage(`✓ Skill "${skill.name}" ${action} successfully`);
      refresh();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      showMessage(`✗ Error: ${errMsg}`, true);
    }
  }, [flatSkills, selectedIndex, totalSkills, showMessage, refresh]);

  useInput((input, key) => {
    if (input === 'q' || input === 'Q' || key.escape) {
      exit();
      return;
    }

    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
      return;
    }

    if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(totalSkills - 1, prev + 1));
      return;
    }

    if (input === ' ' || key.return) {
      handleToggle();
      return;
    }

    if (input === 'r' || input === 'R') {
      refresh();
      showMessage('↺ Refreshed skill list');
      return;
    }

    if (input === 'c' || input === 'C') {
      const config = getConfig();
      showMessage(`Config: ${getConfigPath()} | Backup: ${config.backupPath}`);
      return;
    }
  });

  // Keep selectedIndex in bounds when list changes
  useEffect(() => {
    if (totalSkills > 0 && selectedIndex >= totalSkills) {
      setSelectedIndex(totalSkills - 1);
    }
  }, [totalSkills, selectedIndex]);

  let globalIndex = 0;

  return (
    <Box flexDirection="column">
      <Header />
      <Box flexDirection="column" paddingX={1}>
        {scanResult.tools.map((tool) => {
          const skills = scanResult.skillsByTool[tool.name] ?? [];
          const startIndex = globalIndex;
          globalIndex += skills.length;

          return (
            <ToolGroup
              key={tool.name}
              toolName={tool.name}
              toolDisplayName={tool.displayName}
              skillsPath={tool.skillsPath}
              skills={skills}
              globalSelectedIndex={selectedIndex}
              startIndex={startIndex}
            />
          );
        })}
        {totalSkills === 0 && (
          <Box paddingX={2} marginY={1}>
            <Text color="gray">
              No skills found. Run{' '}
              <Text color="cyan" bold>
                skillbox --init
              </Text>{' '}
              to initialize or configure tool paths with{' '}
              <Text color="cyan" bold>
                skillbox config
              </Text>
              .
            </Text>
          </Box>
        )}
      </Box>
      <Footer message={message} isError={isError} />
    </Box>
  );
}
