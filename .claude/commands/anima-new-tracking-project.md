# /anima:new-tracking-project

## Purpose
Set up comprehensive project tracking for a new or existing project with full analysis and categorization

## Syntax
```
/anima:new-tracking-project [category1] [category2] [...categoryN]
```

## Description
This command performs a complete project analysis, creates tracking in ANIMA-MCP with specified categories, and sets up Claude integration documentation. It's the most comprehensive initialization command for new projects.

## Parameters
- **categories** (optional): Space-separated list of categories that describe the project
  - Examples: `backend`, `nodejs`, `api`, `microservices`, `react`, `typescript`
  - If omitted, categories will be auto-detected from project files

## Execution Steps
1. Analyze complete project structure and documentation files
2. Detect project type, dependencies, and architecture
3. Call `system/claude-integration` to get integration docs
4. Update or create CLAUDE.md with integration information
5. Call `system/capabilities` and `system/instructions`
6. Call `project/create` with analysis results and categories
7. Update CLAUDE.md with project ID and name for ANIMA-MCP tracking
8. Create initial checkpoint with project context

## Usage Examples
```bash
# Backend API project
/anima:new-tracking-project backend nodejs express api rest

# Frontend application
/anima:new-tracking-project frontend react typescript ui spa

# Full-stack project
/anima:new-tracking-project fullstack nodejs react postgresql docker

# Auto-detect categories
/anima:new-tracking-project
```

## Output
Creates and returns:
- Project analysis summary
- Detected technologies and frameworks
- Created project with ID and configuration
- Updated CLAUDE.md with integration docs
- **CLAUDE.md updated with project ID and name for tracking**
- Initial checkpoint with discovered context
- Suggested tasks based on analysis

## Implementation
```javascript
async function newTrackingProject(categories = []) {
  // Step 1: Analyze project
  console.log('🔍 Analyzing project structure...');
  const analysis = await analyzeProject();
  
  // Step 2: Auto-detect categories if not provided
  if (categories.length === 0) {
    categories = detectCategories(analysis);
    console.log('🏷️ Auto-detected categories:', categories.join(', '));
  }
  
  // Step 3: Get and save Claude integration
  console.log('📝 Setting up Claude integration...');
  const integration = await mcp.call('system/claude-integration');
  await updateClaudeMd(integration);
  
  // Step 4: Get system information
  const capabilities = await mcp.call('system/capabilities');
  const instructions = await mcp.call('system/instructions');
  
  // Step 5: Create project
  console.log('🚀 Creating project tracking...');
  const project = await mcp.call('project/create', {
    name: analysis.projectName,
    description: analysis.description,
    categories: categories,
    rootPath: process.cwd()
  });
  
  // Step 6: Update CLAUDE.md with project tracking information
  console.log('📝 Updating CLAUDE.md with project tracking info...');
  await updateClaudeMdWithProjectInfo(project.projectId, project.name);
  
  // Step 7: Create initial checkpoint
  const checkpoint = await mcp.call('session/checkpoint', {
    projectId: project.projectId,
    description: 'Initial project setup and analysis',
    context: {
      files_analyzed: analysis.filesAnalyzed,
      key_technologies: analysis.technologies,
      architecture: analysis.architecture,
      current_state: 'Project initialized with tracking',
      discovered_features: analysis.features,
      suggested_improvements: analysis.suggestions
    }
  });
  
  // Step 8: Create initial tasks based on analysis
  if (analysis.suggestions.length > 0) {
    console.log('📋 Creating suggested tasks...');
    for (const suggestion of analysis.suggestions.slice(0, 5)) {
      await mcp.call('tasks/create', {
        taskId: generateTaskId(suggestion),
        projectId: project.projectId,
        title: suggestion.title,
        description: suggestion.description,
        type: suggestion.type,
        priority: suggestion.priority
      });
    }
  }
  
  console.log(`✅ Project "${project.name}" created with ${categories.length} categories`);
  console.log(`📊 Analyzed ${analysis.filesAnalyzed.length} files`);
  console.log(`💡 Created ${analysis.suggestions.length} suggested tasks`);
  
  return project;
}

async function analyzeProject() {
  const analysis = {
    projectName: '',
    description: '',
    filesAnalyzed: [],
    technologies: [],
    architecture: '',
    features: [],
    suggestions: []
  };
  
  // Read package.json
  if (fs.existsSync('package.json')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    analysis.projectName = pkg.name;
    analysis.description = pkg.description || '';
    analysis.technologies = Object.keys(pkg.dependencies || {});
  }
  
  // Analyze documentation files
  const mdFiles = glob.sync('**/*.md', { ignore: 'node_modules/**' });
  for (const file of mdFiles) {
    const content = fs.readFileSync(file, 'utf8');
    analysis.filesAnalyzed.push(file);
    // Extract features and architecture from docs
    extractProjectInfo(content, analysis);
  }
  
  // Analyze source code structure
  const sourcePatterns = ['src/**/*.js', 'src/**/*.ts', 'lib/**/*.js'];
  const sourceFiles = glob.sync(`{${sourcePatterns.join(',')}}`, { ignore: 'node_modules/**' });
  
  analysis.architecture = detectArchitecture(sourceFiles);
  analysis.suggestions = generateSuggestions(analysis);
  
  return analysis;
}

function detectCategories(analysis) {
  const categories = [];
  
  // Language detection
  if (analysis.technologies.includes('react')) categories.push('react', 'frontend');
  if (analysis.technologies.includes('express')) categories.push('express', 'backend', 'api');
  if (analysis.technologies.includes('vue')) categories.push('vue', 'frontend');
  if (analysis.technologies.includes('mongodb')) categories.push('mongodb', 'database');
  
  // Architecture detection
  if (analysis.architecture.includes('microservice')) categories.push('microservices');
  if (analysis.architecture.includes('monolith')) categories.push('monolith');
  if (analysis.architecture.includes('serverless')) categories.push('serverless');
  
  // File-based detection
  if (fs.existsSync('Dockerfile')) categories.push('docker');
  if (fs.existsSync('.github/workflows')) categories.push('ci-cd');
  if (fs.existsSync('tsconfig.json')) categories.push('typescript');
  
  return [...new Set(categories)]; // Remove duplicates
}

async function updateClaudeMdWithProjectInfo(projectId, projectName) {
  const claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');
  let content = fs.existsSync(claudeMdPath) 
    ? fs.readFileSync(claudeMdPath, 'utf8') 
    : '';
  
  // Add or update ANIMA-MCP project tracking section
  const trackingSection = `
## ANIMA-MCP Project Tracking

This project is tracked by ANIMA-MCP with the following identifiers:
- **Project ID**: \`${projectId}\`
- **Project Name**: \`${projectName}\`

Use these identifiers when working with ANIMA-MCP commands:
\`\`\`javascript
// Load this project
await mcp.call('project/load', { projectId: '${projectId}' });

// Create checkpoint
await mcp.call('session/checkpoint', { 
  projectId: '${projectId}',
  description: 'Your checkpoint description'
});

// Get project context
await mcp.call('context/current', { projectId: '${projectId}' });
\`\`\`
`;
  
  // Check if tracking section already exists
  if (content.includes('## ANIMA-MCP Project Tracking')) {
    // Update existing section
    content = content.replace(
      /## ANIMA-MCP Project Tracking[\s\S]*?(?=\n##|$)/,
      trackingSection.trim()
    );
  } else {
    // Add new section at the beginning after main title
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find the first heading or start of content
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# ')) {
        insertIndex = i + 1;
        break;
      }
    }
    
    lines.splice(insertIndex, 0, '', trackingSection.trim());
    content = lines.join('\n');
  }
  
  fs.writeFileSync(claudeMdPath, content);
  console.log(`✅ Updated CLAUDE.md with project tracking: ${projectId}`);
}
```

## When to Use
- **New Projects**: Starting a new project that needs tracking
- **Existing Projects**: Adding tracking to projects without it
- **Project Migration**: Moving projects to ANIMA-MCP tracking
- **Team Onboarding**: Setting up tracking for team projects

## Category Guidelines

### Technical Categories
- **Languages**: `javascript`, `typescript`, `python`, `go`, `rust`
- **Frameworks**: `react`, `vue`, `angular`, `express`, `django`, `fastapi`
- **Platforms**: `nodejs`, `deno`, `bun`, `electron`

### Domain Categories
- **Architecture**: `microservices`, `monolith`, `serverless`, `event-driven`
- **Type**: `api`, `spa`, `ssr`, `static-site`, `cli`, `library`
- **Purpose**: `auth`, `payments`, `analytics`, `cms`, `ecommerce`

### Infrastructure Categories
- **Deployment**: `docker`, `kubernetes`, `aws`, `azure`, `gcp`
- **Database**: `postgresql`, `mongodb`, `redis`, `elasticsearch`
- **Tools**: `ci-cd`, `testing`, `monitoring`, `logging`

## Project Analysis Features
The command analyzes:
- **Structure**: Directory layout and organization
- **Dependencies**: Package.json dependencies and versions
- **Documentation**: README, docs, and markdown files
- **Architecture**: Code organization patterns
- **Technologies**: Frameworks, libraries, and tools
- **Quality**: Code style, testing, and documentation coverage

## Auto-Generated Tasks
Based on analysis, creates tasks for:
- Missing documentation
- Unconfigured testing
- Security vulnerabilities
- Performance optimizations
- Code quality improvements
- Dependency updates

## Related Commands
- `/anima:init` - Load existing project context
- `/anima:register-claude` - Update CLAUDE.md integration

## Error Handling
| Error | Solution |
|-------|----------|
| Project already exists | Use `/anima:init` to load it |
| Invalid categories | Check category naming conventions |
| Analysis failed | Ensure project has valid structure |
| Server not running | Start ANIMA-MCP server |

## Best Practices
1. Run from project root directory
2. Provide relevant categories for better organization
3. Review auto-generated tasks and adjust priorities
4. Commit CLAUDE.md to version control
5. Create additional checkpoints after major changes

## Notes
- Comprehensive analysis may take 10-30 seconds for large projects
- Categories can be updated later using `project/setCategories`
- Initial checkpoint preserves project discovery context
- Auto-generated tasks are suggestions, not requirements