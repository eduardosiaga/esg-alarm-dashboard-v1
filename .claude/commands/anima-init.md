# /anima:init

## Purpose
Initialize ANIMA-MCP for the current work session by loading project context and system capabilities

## Syntax
```
/anima:init
```

## Description
This command establishes a connection with ANIMA-MCP, retrieves system capabilities and instructions, then loads the current project's context including recent sessions, active tasks, and configuration.

## Execution Steps
1. Call `system/capabilities` to obtain server capabilities
2. Call `system/instructions` to get operational instructions
3. Detect project ID from CLAUDE.md or fallback to package.json
4. Call `project/load` with detected project ID to restore context
5. Display session information and active tasks

## Usage Example
```bash
/anima:init
```

## Output
Returns:
- System capabilities and available endpoints
- Operational instructions for optimal usage
- Project context including:
  - Recent sessions (last 10)
  - Active tasks and their progress
  - Project statistics
  - Last checkpoint information

## Implementation
```javascript
async function initAnima() {
  try {
    // Step 1: Get system capabilities
    const capabilities = await mcp.call('system/capabilities');
    console.log('📚 Loaded capabilities:', Object.keys(capabilities.endpoints).length, 'endpoints');
    
    // Step 2: Get system instructions
    const instructions = await mcp.call('system/instructions');
    console.log('📖 Loaded instructions for optimal usage');
    
    // Step 3: Detect current project from CLAUDE.md first, then fallbacks
    const projectId = detectProjectId(); // from CLAUDE.md, package.json, or .anima/config
    
    // Step 4: Load project context
    const context = await mcp.call('project/load', { 
      projectId: projectId 
    });
    
    // Step 5: Display summary
    console.log(`✅ Initialized project: ${context.project.name}`);
    console.log(`📊 Stats: ${context.stats.totalSessions} sessions, ${context.stats.activeTasks} active tasks`);
    console.log(`🕒 Last checkpoint: ${context.lastCheckpoint?.description || 'None'}`);
    
    // Step 6: Show active tasks
    if (context.activeTasks?.length > 0) {
      console.log('\n📋 Active Tasks:');
      context.activeTasks.forEach(task => {
        console.log(`  - [${task.priority}] ${task.title} (${task.progress}%)`);
      });
    }
    
    return context;
  } catch (error) {
    if (error.message.includes('Project not found')) {
      console.log('ℹ️ Project not found. Use /anima:new-tracking-project to create it.');
    }
    throw error;
  }
}

function detectProjectId() {
  // Priority 1: Check CLAUDE.md for registered project ID
  const claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');
  if (fs.existsSync(claudeMdPath)) {
    const content = fs.readFileSync(claudeMdPath, 'utf8');
    
    // Look for project ID in ANIMA-MCP tracking section
    const projectIdMatch = content.match(/\*\*Project ID\*\*:\s*`([^`]+)`/);
    if (projectIdMatch) {
      console.log('📄 Found project ID in CLAUDE.md:', projectIdMatch[1]);
      return projectIdMatch[1];
    }
  }
  
  // Priority 2: Check package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (pkg.name) {
      console.log('📦 Using project name from package.json:', pkg.name);
      return pkg.name;
    }
  }
  
  // Priority 3: Check .anima/config.json
  const animaConfigPath = path.join(process.cwd(), '.anima', 'config.json');
  if (fs.existsSync(animaConfigPath)) {
    const config = JSON.parse(fs.readFileSync(animaConfigPath, 'utf8'));
    if (config.projectId) {
      console.log('⚙️ Found project ID in .anima/config.json:', config.projectId);
      return config.projectId;
    }
  }
  
  // Priority 4: Fallback to current directory name
  const dirName = path.basename(process.cwd());
  console.log('📁 Using current directory name as project ID:', dirName);
  return dirName;
}
```

## When to Use
- **Session Start**: Beginning of each work session
- **Context Recovery**: After Claude Code restart or context loss
- **Project Switch**: When changing between projects
- **Status Check**: To review project state and active tasks

## Prerequisites
- ANIMA-MCP server must be running
- Project must exist (created with `/anima:new-tracking-project`)
- Valid project ID in package.json or configuration

## Project Detection
The command attempts to detect the project ID from (in priority order):
1. `CLAUDE.md` ANIMA-MCP Project Tracking section
2. `package.json` name field
3. `.anima/config.json` projectId field
4. Current directory name (fallback)

## Session Management
After initialization:
- Auto-checkpoint activates (every 10 minutes)
- Session cleanup runs (prevents context overflow)
- Task tracking becomes available
- Lesson recording is enabled

## Related Commands
- `/anima:register-claude` - Add integration docs to CLAUDE.md
- `/anima:new-tracking-project` - Create new project tracking

## Error Handling
| Error | Solution |
|-------|----------|
| Project not found | Run `/anima:new-tracking-project` first |
| Server not responding | Check if ANIMA-MCP is running |
| Invalid project ID | Verify project name in package.json |
| MongoDB connection failed | Check MongoDB on port 27027 |

## Best Practices
1. Run at the start of each work session
2. Create checkpoint after initialization
3. Review active tasks before starting work
4. Check for relevant lessons from past sessions

## Notes
- **Prioritizes CLAUDE.md** for project ID detection (created by `/anima:new-tracking-project`)
- Loads up to 10 recent sessions to manage context
- Automatically triggers session cleanup if needed
- Preserves continuity across Claude Code sessions
- If project ID not found in CLAUDE.md, falls back to package.json or directory name