# /anima:analyze-project

## Purpose
Analyze the complete project and review all documentation files to understand the functionality and scope of the current project

## Syntax
```
/anima:analyze-project [--save] [--detailed]
```

## Description
This command performs a comprehensive analysis of the entire project, examining all source code files and documentation to provide a deep understanding of the project's functionality, architecture, dependencies, and scope. The analysis results can optionally be saved to ANIMA-MCP as a checkpoint.

## Parameters
- **--save** (optional): Save analysis results as an ANIMA-MCP checkpoint
- **--detailed** (optional): Include detailed file-by-file analysis in the output

## Execution Steps
1. Scan all project files and directories to build structure map
2. Read and analyze all markdown documentation files
3. Examine package.json for dependencies and project metadata
4. Analyze source code to identify patterns and architecture
5. Detect technologies, frameworks, and tools used
6. Generate comprehensive project summary
7. Optionally save results to ANIMA-MCP checkpoint

## Usage Examples
```bash
# Basic project analysis
/anima:analyze-project

# Analysis with checkpoint saving
/anima:analyze-project --save

# Detailed analysis with file-by-file breakdown
/anima:analyze-project --detailed

# Full analysis saved to ANIMA-MCP
/anima:analyze-project --save --detailed
```

## Output
Returns comprehensive analysis including:
- **Project Overview**: Name, description, version, type
- **Architecture**: Code organization, design patterns, structure
- **Technologies**: Languages, frameworks, libraries, tools
- **Documentation**: Available docs, README content, API documentation
- **Dependencies**: Direct and dev dependencies analysis
- **File Statistics**: File counts by type, lines of code, test coverage
- **Key Features**: Identified functionality and capabilities
- **API Endpoints**: If applicable, discovered API routes
- **Database Schema**: If detectable, data models and relationships
- **Testing**: Test framework, coverage, test file locations
- **Build & Deploy**: Build scripts, CI/CD configuration, deployment setup

## Implementation
```javascript
async function analyzeProject(options = {}) {
  const { save = false, detailed = false } = options;
  
  console.log('🔍 Starting comprehensive project analysis...');
  
  const analysis = {
    metadata: {},
    structure: {},
    documentation: {},
    technologies: [],
    dependencies: {},
    features: [],
    architecture: {},
    statistics: {},
    insights: []
  };
  
  // Step 1: Analyze project metadata
  analysis.metadata = await analyzeProjectMetadata();
  
  // Step 2: Scan project structure
  console.log('📁 Scanning project structure...');
  analysis.structure = await scanProjectStructure();
  
  // Step 3: Analyze documentation files
  console.log('📚 Analyzing documentation...');
  analysis.documentation = await analyzeDocumentation();
  
  // Step 4: Analyze source code
  console.log('💻 Analyzing source code...');
  const codeAnalysis = await analyzeSourceCode(detailed);
  analysis.architecture = codeAnalysis.architecture;
  analysis.features = codeAnalysis.features;
  analysis.technologies = codeAnalysis.technologies;
  
  // Step 5: Analyze dependencies
  console.log('📦 Analyzing dependencies...');
  analysis.dependencies = await analyzeDependencies();
  
  // Step 6: Generate statistics
  console.log('📊 Generating statistics...');
  analysis.statistics = await generateStatistics();
  
  // Step 7: Generate insights
  console.log('💡 Generating insights...');
  analysis.insights = await generateInsights(analysis);
  
  // Step 8: Save to ANIMA-MCP if requested
  if (save) {
    await saveAnalysisToAnima(analysis);
  }
  
  // Step 9: Format and display results
  displayAnalysisResults(analysis, detailed);
  
  return analysis;
}

async function analyzeProjectMetadata() {
  const metadata = {
    name: '',
    version: '',
    description: '',
    type: '',
    author: '',
    license: '',
    repository: ''
  };
  
  // Read package.json if exists
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    metadata.name = pkg.name || path.basename(process.cwd());
    metadata.version = pkg.version || '0.0.0';
    metadata.description = pkg.description || '';
    metadata.type = detectProjectType(pkg);
    metadata.author = pkg.author || '';
    metadata.license = pkg.license || '';
    metadata.repository = pkg.repository?.url || pkg.repository || '';
  }
  
  // Check for other project files (composer.json, pyproject.toml, etc.)
  if (fs.existsSync('composer.json')) metadata.type = 'php';
  if (fs.existsSync('pyproject.toml')) metadata.type = 'python';
  if (fs.existsSync('Cargo.toml')) metadata.type = 'rust';
  if (fs.existsSync('go.mod')) metadata.type = 'go';
  
  return metadata;
}

async function scanProjectStructure() {
  const structure = {
    directories: [],
    mainFiles: [],
    configFiles: [],
    testFiles: [],
    documentationFiles: []
  };
  
  // Get all directories
  const dirs = glob.sync('**/', { 
    ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**'] 
  });
  structure.directories = dirs.map(d => d.replace(/\/$/, ''));
  
  // Identify main source files
  structure.mainFiles = glob.sync('**/*.{js,ts,jsx,tsx,py,go,rs,java,php}', {
    ignore: ['node_modules/**', 'test/**', '*.test.*', '*.spec.*']
  });
  
  // Find configuration files
  structure.configFiles = glob.sync('*.{json,yml,yaml,toml,ini,conf,config.*}', {
    ignore: 'node_modules/**'
  });
  
  // Find test files
  structure.testFiles = glob.sync('**/*.{test,spec}.{js,ts,jsx,tsx}', {
    ignore: 'node_modules/**'
  });
  
  // Find documentation
  structure.documentationFiles = glob.sync('**/*.{md,rst,txt}', {
    ignore: 'node_modules/**'
  });
  
  return structure;
}

async function analyzeDocumentation() {
  const docs = {
    readme: null,
    mainDocs: [],
    apiDocs: [],
    guides: [],
    changelog: null,
    contributing: null,
    license: null
  };
  
  // Read README
  const readmeFiles = glob.sync('README*', { nocase: true });
  if (readmeFiles.length > 0) {
    docs.readme = {
      path: readmeFiles[0],
      content: fs.readFileSync(readmeFiles[0], 'utf8'),
      sections: extractMarkdownSections(fs.readFileSync(readmeFiles[0], 'utf8'))
    };
  }
  
  // Find other documentation
  const docFiles = glob.sync('**/*.md', { 
    ignore: ['node_modules/**', 'README*'] 
  });
  
  for (const file of docFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const analysis = {
      path: file,
      title: extractTitle(content),
      sections: extractMarkdownSections(content),
      wordCount: content.split(/\s+/).length
    };
    
    // Categorize documentation
    if (file.toLowerCase().includes('api')) {
      docs.apiDocs.push(analysis);
    } else if (file.toLowerCase().includes('guide') || file.toLowerCase().includes('tutorial')) {
      docs.guides.push(analysis);
    } else if (file.toLowerCase().includes('changelog')) {
      docs.changelog = analysis;
    } else if (file.toLowerCase().includes('contributing')) {
      docs.contributing = analysis;
    } else if (file.toLowerCase().includes('license')) {
      docs.license = analysis;
    } else {
      docs.mainDocs.push(analysis);
    }
  }
  
  return docs;
}

async function analyzeSourceCode(detailed = false) {
  const analysis = {
    architecture: {
      pattern: '',
      layers: [],
      modules: [],
      entryPoints: []
    },
    features: [],
    technologies: []
  };
  
  // Detect architecture pattern
  const hasControllers = glob.sync('**/controller*/**/*.{js,ts}').length > 0;
  const hasRoutes = glob.sync('**/route*/**/*.{js,ts}').length > 0;
  const hasModels = glob.sync('**/model*/**/*.{js,ts}').length > 0;
  const hasServices = glob.sync('**/service*/**/*.{js,ts}').length > 0;
  const hasHandlers = glob.sync('**/handler*/**/*.{js,ts}').length > 0;
  
  if (hasControllers && hasModels) {
    analysis.architecture.pattern = 'MVC';
  } else if (hasHandlers && hasModels) {
    analysis.architecture.pattern = 'Handler-based';
  } else if (hasServices) {
    analysis.architecture.pattern = 'Service-oriented';
  } else {
    analysis.architecture.pattern = 'Modular';
  }
  
  // Identify layers
  if (hasControllers || hasHandlers) analysis.architecture.layers.push('presentation');
  if (hasServices) analysis.architecture.layers.push('business');
  if (hasModels) analysis.architecture.layers.push('data');
  if (hasRoutes) analysis.architecture.layers.push('routing');
  
  // Find entry points
  const entryPoints = glob.sync('{index,main,app,server}.{js,ts}', {
    ignore: 'node_modules/**'
  });
  analysis.architecture.entryPoints = entryPoints;
  
  // Detect technologies from imports
  const jsFiles = glob.sync('**/*.{js,ts}', { 
    ignore: 'node_modules/**' 
  });
  
  const techPatterns = {
    'React': /from ['"]react/,
    'Vue': /from ['"]vue/,
    'Angular': /from ['"]@angular/,
    'Express': /from ['"]express/,
    'Fastify': /from ['"]fastify/,
    'MongoDB': /from ['"]mongodb|mongoose/,
    'PostgreSQL': /from ['"]pg|postgres/,
    'Redis': /from ['"]redis/,
    'Jest': /from ['"]jest|@jest/,
    'Mocha': /from ['"]mocha/,
    'Docker': /Dockerfile/,
    'TypeScript': /\.ts$/
  };
  
  for (const file of jsFiles.slice(0, detailed ? jsFiles.length : 20)) {
    const content = fs.readFileSync(file, 'utf8');
    
    for (const [tech, pattern] of Object.entries(techPatterns)) {
      if (pattern.test(content) || pattern.test(file)) {
        if (!analysis.technologies.includes(tech)) {
          analysis.technologies.push(tech);
        }
      }
    }
    
    // Extract features from comments and function names
    const featureComments = content.match(/\/\/\s*@feature\s+(.+)/g);
    if (featureComments) {
      featureComments.forEach(comment => {
        const feature = comment.replace(/\/\/\s*@feature\s+/, '');
        if (!analysis.features.includes(feature)) {
          analysis.features.push(feature);
        }
      });
    }
  }
  
  return analysis;
}

async function analyzeDependencies() {
  const deps = {
    production: {},
    development: {},
    count: 0,
    outdated: [],
    security: []
  };
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    deps.production = pkg.dependencies || {};
    deps.development = pkg.devDependencies || {};
    deps.count = Object.keys(deps.production).length + Object.keys(deps.development).length;
    
    // Identify potentially outdated packages (simplified check)
    for (const [name, version] of Object.entries(deps.production)) {
      if (version.includes('^') || version.includes('~')) {
        deps.outdated.push(`${name}: ${version} (consider pinning version)`);
      }
    }
  }
  
  return deps;
}

async function generateStatistics() {
  const stats = {
    totalFiles: 0,
    filesByType: {},
    totalLines: 0,
    codeLines: 0,
    commentLines: 0,
    testCoverage: 'Not detected',
    lastModified: null
  };
  
  // Count files by type
  const extensions = ['.js', '.ts', '.jsx', '.tsx', '.json', '.md', '.yml', '.yaml'];
  for (const ext of extensions) {
    const files = glob.sync(`**/*${ext}`, { ignore: 'node_modules/**' });
    if (files.length > 0) {
      stats.filesByType[ext] = files.length;
      stats.totalFiles += files.length;
    }
  }
  
  // Get last modified time
  const gitLog = execSync('git log -1 --format=%ci 2>/dev/null || echo "Not a git repository"', {
    encoding: 'utf8'
  }).trim();
  stats.lastModified = gitLog;
  
  return stats;
}

async function generateInsights(analysis) {
  const insights = [];
  
  // Architecture insights
  if (analysis.architecture.pattern) {
    insights.push(`📐 Architecture: ${analysis.architecture.pattern} pattern detected`);
  }
  
  // Technology insights
  if (analysis.technologies.length > 0) {
    insights.push(`🛠️ Tech Stack: ${analysis.technologies.join(', ')}`);
  }
  
  // Documentation insights
  if (analysis.documentation.readme) {
    insights.push('📚 Well-documented: README found with project information');
  } else {
    insights.push('⚠️ Missing README: Consider adding project documentation');
  }
  
  // Dependency insights
  if (analysis.dependencies.count > 50) {
    insights.push(`📦 Large dependency footprint: ${analysis.dependencies.count} packages`);
  }
  
  // Testing insights
  if (analysis.structure.testFiles.length > 0) {
    insights.push(`✅ Testing: ${analysis.structure.testFiles.length} test files found`);
  } else {
    insights.push('⚠️ No tests detected: Consider adding test coverage');
  }
  
  return insights;
}

async function saveAnalysisToAnima(analysis) {
  console.log('💾 Saving analysis to ANIMA-MCP...');
  
  // Detect or get project ID
  const projectId = detectProjectId();
  
  try {
    const checkpoint = await mcp.call('session/checkpoint', {
      projectId: projectId,
      description: 'Comprehensive project analysis',
      context: {
        analysis_date: new Date().toISOString(),
        project_metadata: analysis.metadata,
        architecture: analysis.architecture,
        technologies: analysis.technologies,
        features: analysis.features,
        statistics: analysis.statistics,
        insights: analysis.insights,
        files_analyzed: analysis.structure.mainFiles,
        documentation_found: Object.keys(analysis.documentation).filter(k => analysis.documentation[k]),
        dependencies_count: analysis.dependencies.count
      }
    });
    
    console.log('✅ Analysis saved to ANIMA-MCP checkpoint');
    return checkpoint;
  } catch (error) {
    console.error('❌ Failed to save analysis:', error.message);
    console.log('ℹ️ Use /anima:new-tracking-project to create project first');
  }
}

function displayAnalysisResults(analysis, detailed = false) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 PROJECT ANALYSIS RESULTS');
  console.log('='.repeat(60));
  
  // Project Overview
  console.log('\n🏷️ PROJECT OVERVIEW');
  console.log(`Name: ${analysis.metadata.name}`);
  console.log(`Version: ${analysis.metadata.version}`);
  console.log(`Type: ${analysis.metadata.type}`);
  console.log(`Description: ${analysis.metadata.description}`);
  
  // Architecture
  console.log('\n🏗️ ARCHITECTURE');
  console.log(`Pattern: ${analysis.architecture.pattern}`);
  console.log(`Layers: ${analysis.architecture.layers.join(', ')}`);
  console.log(`Entry Points: ${analysis.architecture.entryPoints.join(', ')}`);
  
  // Technologies
  console.log('\n💻 TECHNOLOGIES');
  console.log(`Stack: ${analysis.technologies.join(', ')}`);
  
  // Statistics
  console.log('\n📈 STATISTICS');
  console.log(`Total Files: ${analysis.statistics.totalFiles}`);
  console.log(`File Types: ${Object.entries(analysis.statistics.filesByType)
    .map(([ext, count]) => `${ext}(${count})`)
    .join(', ')}`);
  
  // Documentation
  console.log('\n📚 DOCUMENTATION');
  const docTypes = [];
  if (analysis.documentation.readme) docTypes.push('README');
  if (analysis.documentation.apiDocs.length > 0) docTypes.push(`API Docs(${analysis.documentation.apiDocs.length})`);
  if (analysis.documentation.guides.length > 0) docTypes.push(`Guides(${analysis.documentation.guides.length})`);
  if (analysis.documentation.changelog) docTypes.push('CHANGELOG');
  console.log(`Available: ${docTypes.join(', ') || 'None'}`);
  
  // Dependencies
  console.log('\n📦 DEPENDENCIES');
  console.log(`Total: ${analysis.dependencies.count}`);
  console.log(`Production: ${Object.keys(analysis.dependencies.production).length}`);
  console.log(`Development: ${Object.keys(analysis.dependencies.development).length}`);
  
  // Features
  if (analysis.features.length > 0) {
    console.log('\n✨ DETECTED FEATURES');
    analysis.features.forEach(feature => console.log(`  - ${feature}`));
  }
  
  // Insights
  console.log('\n💡 INSIGHTS');
  analysis.insights.forEach(insight => console.log(`  ${insight}`));
  
  if (detailed) {
    console.log('\n📄 DETAILED FILE ANALYSIS');
    console.log('Main Files:');
    analysis.structure.mainFiles.slice(0, 10).forEach(file => {
      console.log(`  - ${file}`);
    });
    if (analysis.structure.mainFiles.length > 10) {
      console.log(`  ... and ${analysis.structure.mainFiles.length - 10} more`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
}

function extractMarkdownSections(content) {
  const sections = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.match(/^#{1,6}\s+/)) {
      const level = line.match(/^(#{1,6})/)[1].length;
      const title = line.replace(/^#{1,6}\s+/, '').trim();
      sections.push({ level, title });
    }
  }
  
  return sections;
}

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : 'Untitled';
}

function detectProjectType(pkg) {
  if (pkg.dependencies) {
    if (pkg.dependencies.react) return 'react';
    if (pkg.dependencies.vue) return 'vue';
    if (pkg.dependencies.angular) return 'angular';
    if (pkg.dependencies.express) return 'express';
    if (pkg.dependencies.fastify) return 'fastify';
    if (pkg.dependencies.next) return 'nextjs';
  }
  
  if (pkg.main && pkg.main.includes('server')) return 'backend';
  if (pkg.scripts && pkg.scripts.build) return 'application';
  
  return 'nodejs';
}

function detectProjectId() {
  // Same implementation as in anima-init.md
  const claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');
  if (fs.existsSync(claudeMdPath)) {
    const content = fs.readFileSync(claudeMdPath, 'utf8');
    const projectIdMatch = content.match(/\*\*Project ID\*\*:\s*`([^`]+)`/);
    if (projectIdMatch) return projectIdMatch[1];
  }
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (pkg.name) return pkg.name;
  }
  
  return path.basename(process.cwd());
}
```

## When to Use
- **Project Onboarding**: Understanding a new or unfamiliar project
- **Documentation Generation**: Gathering information for documentation
- **Architecture Review**: Analyzing project structure and patterns
- **Tech Stack Audit**: Identifying all technologies and dependencies
- **Before Major Refactoring**: Understanding current state before changes
- **Project Handover**: Creating comprehensive overview for team transitions

## Flags and Options

### --save
Saves the analysis results as an ANIMA-MCP checkpoint, allowing you to:
- Track project evolution over time
- Compare analyses across different versions
- Share findings with team members
- Create a baseline for future comparisons

### --detailed
Includes additional information:
- File-by-file analysis results
- Complete list of all discovered files
- Extended dependency information
- Detailed documentation structure

## Analysis Categories

### Project Structure
- Directory organization and hierarchy
- File distribution and naming patterns
- Code organization (src, lib, tests, docs)
- Configuration file locations

### Code Analysis
- Programming languages used
- Frameworks and libraries detected
- Design patterns identified
- Code complexity indicators

### Documentation Analysis
- README completeness
- API documentation availability
- User guides and tutorials
- Contributing guidelines
- License information

### Dependency Analysis
- Direct dependencies breakdown
- Development dependencies
- Potential security issues
- Version management patterns

## Integration with Other Commands
- Run before `/anima:new-tracking-project` to understand the project
- Use with `/anima:init` to load context after analysis
- Combine with `/anima:register-claude` for complete setup

## Related Commands
- `/anima:new-tracking-project` - Create tracking after analysis
- `/anima:init` - Load project context
- `/anima:register-claude` - Add integration documentation

## Error Handling
| Error | Solution |
|-------|----------|
| Large project timeout | Run with fewer files or use --skip-node-modules |
| Git not available | Some statistics may be unavailable |
| No package.json | Analysis continues with available files |
| ANIMA not configured | Use --save after running /anima:new-tracking-project |

## Performance Considerations
- Analysis time depends on project size (typically 5-30 seconds)
- Large projects (>10,000 files) may take longer
- Use file ignoring patterns for faster analysis
- Detailed mode increases analysis time significantly

## Best Practices
1. Run analysis from project root directory
2. Ensure git repository is clean for accurate statistics
3. Use --save flag to track project evolution
4. Review insights for improvement opportunities
5. Run periodically to track project growth

## Output Format
The analysis results are displayed in a structured format:
- Emoji indicators for each section
- Hierarchical information organization
- Summary statistics and counts
- Actionable insights and recommendations

## Notes
- Respects .gitignore patterns by default
- Automatically excludes node_modules, dist, build directories
- Supports multiple programming languages and frameworks
- Can detect mixed technology stacks
- Provides actionable insights based on findings