# /anima:register-claude

## Purpose
Register the current project with Claude by adding ANIMA-MCP integration information to CLAUDE.md

## Syntax
```
/anima:register-claude
```

## Description
This command fetches comprehensive documentation about ANIMA-MCP capabilities and updates the project's CLAUDE.md file with integration information, making the project ready for Claude Code collaboration.

## Execution Steps
1. Call `system/claude-integration` endpoint to obtain integration documentation
2. Update or create CLAUDE.md file with the retrieved information
3. Include essential MCP commands, best practices, and workflow examples

## Usage Example
```bash
/anima:register-claude
```

## Output
Updates CLAUDE.md with:
- Essential MCP commands for project management
- Best practices for using ANIMA-MCP
- Workflow examples specific to the project
- Important configuration notes
- Quick reference for common operations

## Implementation
```javascript
async function registerClaude() {
  // Step 1: Get Claude integration information
  const integrationInfo = await mcp.call('system/claude-integration');
  
  // Step 2: Parse the response
  const { content } = integrationInfo;
  
  // Step 3: Update CLAUDE.md
  const claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');
  const existingContent = fs.existsSync(claudeMdPath) 
    ? fs.readFileSync(claudeMdPath, 'utf8') 
    : '';
  
  // Step 4: Merge or append integration info
  const updatedContent = mergeClaudeIntegration(existingContent, content);
  
  // Step 5: Write updated content
  fs.writeFileSync(claudeMdPath, updatedContent);
  
  return `✅ CLAUDE.md updated with ANIMA-MCP integration`;
}
```

## When to Use
- **New Projects**: After creating a new project that needs Claude Code integration
- **Updates**: After ANIMA-MCP server updates to get latest features
- **Team Onboarding**: When sharing project with team members using Claude Code
- **Documentation Refresh**: To ensure CLAUDE.md has current integration info

## Prerequisites
- ANIMA-MCP server must be running
- Project should exist or be initialized
- Write permissions for CLAUDE.md file

## Related Commands
- `/anima:init` - Initialize ANIMA-MCP for current session
- `/anima:new-tracking-project` - Set up new project with tracking

## Error Handling
| Error | Solution |
|-------|----------|
| Server not running | Start ANIMA-MCP with `npm start` |
| Permission denied | Check file permissions for CLAUDE.md |
| Integration endpoint missing | Update ANIMA-MCP to v2.0.3+ |

## Notes
- Integration information is version-specific
- CLAUDE.md should be committed to version control
- Custom project instructions can be added alongside integration docs