I need to analyze all commands in the .claude/commands/ directory and update the view_commands.md file to accurately reflect all available commands for the Filerobot Image Editor project: $ARGUMENTS

## Steps:

1. **Scan Command Directory**
   - List all .md files in .claude/commands/ (excluding view_commands.md itself)
   - Extract command names from filenames
   - Read each command file to understand its purpose

2. **Analyze Command Structure**
   - Identify the command syntax pattern (/project:command_name)
   - Extract command description from the first meaningful line of each file
   - Note any usage examples or special syntax (like $ARGUMENTS)
   - Understand how each command applies to the Filerobot Image Editor monorepo

3. **Update view_commands.md**
   - Maintain the existing structure with sections for:
     - Task Management Commands
     - Usage Examples (with Filerobot-specific examples)
     - Command Structure explanation
   - Add any new commands discovered
   - Update descriptions to match actual command functionality
   - Ensure all examples are accurate and relevant to image editor development

4. **Format Consistently**
   - Use consistent markdown formatting
   - Group related commands together
   - Include actual command syntax as found in the files
   - Add any new categories if needed
   - Include project-specific details (Yarn commands, package structure, etc.)

5. **Verify Accuracy**
   - Double-check that all commands are listed
   - Ensure descriptions accurately reflect what each command does
   - Verify the command invocation pattern matches the directory structure
   - Confirm examples use appropriate Filerobot Image Editor scenarios

The view_commands.md file should serve as a comprehensive reference for all available project commands specific to Filerobot Image Editor development.