import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const agentsDir = path.resolve(here, "../agents");
const commandsDir = path.resolve(here, "../commands");
const skillsDir = path.resolve(here, "../skills");

/**
 * @typedef {object} Frontmatter
 * @property {string} header - Raw YAML frontmatter block, without delimiters.
 * @property {string} body - Markdown body after the frontmatter block.
 */

/**
 * @typedef {object} MarkdownFile
 * @property {string} file - Absolute file path.
 * @property {string} id - Path-derived registry ID, relative and extensionless.
 */

/**
 * @typedef {object} SkillRegistration
 * @property {string} id - Skill ID, from the skill directory name.
 * @property {string} name - Display name, from frontmatter or the ID.
 * @property {string} description - Skill description from frontmatter.
 * @property {string} path - Absolute path to the SKILL.md file.
 * @property {string} content - SKILL.md body, without frontmatter.
 */

/**
 * @typedef {object} AgentRegistration
 * @property {string} id - Agent ID, from the file path.
 * @property {object} agent - Agent definition patch applied to the registry.
 */

/**
 * @typedef {object} CommandRegistration
 * @property {string} name - Command name, from the file path.
 * @property {string} description - Command description from frontmatter.
 * @property {string|undefined} agent - Agent the command switches to, if any.
 * @property {string} template - Command body; `$ARGUMENTS` is replaced at runtime.
 */

/**
 * Split a Markdown file into its frontmatter header and body.
 *
 * @param {string} text - Full file contents.
 * @param {string} file - File path, used only for error messages.
 * @returns {Frontmatter} Parsed header and body.
 * @throws {Error} When the file has no valid frontmatter block.
 */
function splitFrontmatter(text, file) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`Invalid frontmatter in ${file}`);
  }

  return { header: match[1], body: match[2] };
}

/**
 * Remove one layer of surrounding single or double quotes.
 *
 * @param {string} value - Raw scalar value.
 * @returns {string} Unquoted, trimmed value.
 */
function strip(value) {
  const trimmed = value.trim();
  const quoted =
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'")));
  if (quoted) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

/**
 * Read a single scalar value from a frontmatter header.
 *
 * @param {string} header - Frontmatter header text.
 * @param {string} key - Field name to look up.
 * @returns {string|undefined} Unquoted value, or undefined when absent or empty.
 */
function scalar(header, key) {
  const line = header.split(/\r?\n/).find((entry) => {
    return entry.startsWith(`${key}:`);
  });

  if (!line) {
    return undefined;
  }

  const value = strip(line.slice(key.length + 1));
  if (!value) {
    return undefined;
  }

  return value;
}

/**
 * Parse the `permissions:` list from an agent frontmatter header.
 *
 * @param {string} header - Frontmatter header text.
 * @returns {Array<object>|undefined} Ordered permission rules, or undefined when absent.
 */
function parsePermissions(header) {
  const lines = header.split(/\r?\n/);
  const start = lines.findIndex((line) => {
    return line.trim() === "permissions:";
  });

  if (start === -1) {
    return undefined;
  }

  const permissions = [];
  let current = null;
  for (const line of lines.slice(start + 1)) {
    const action = line.match(/^\s*-\s*action:\s*(.+?)\s*$/);
    if (action) {
      current = { action: strip(action[1]) };
      permissions.push(current);
      continue;
    }

    if (!current) {
      continue;
    }

    const field = line.match(/^\s*(resource|effect):\s*(.+?)\s*$/);
    if (field) {
      current[field[1]] = strip(field[2]);
    }
  }

  if (permissions.length === 0) {
    return undefined;
  }

  return permissions;
}

/**
 * Collect every Markdown file under a directory, recursively.
 *
 * @param {string} dir - Directory to walk.
 * @param {string} base - Path prefix accumulated during recursion.
 * @returns {Array<MarkdownFile>} Files with path-derived registry IDs.
 */
function walkMd(dir, base = "") {
  const found = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  entries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...walkMd(full, `${base}${entry.name}/`));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const id = `${base}${entry.name.slice(0, -3)}`.replaceAll("\\", "/");
      found.push({ file: full, id });
    }
  }

  return found;
}

/**
 * Load every skill from the skills directory.
 *
 * @returns {Array<SkillRegistration>} Skills in directory-name order.
 * @throws {Error} When a SKILL.md file is invalid.
 */
function loadSkills() {
  const skills = [];
  const entries = readdirSync(skillsDir, { withFileTypes: true });
  const names = entries
    .filter((entry) => {
      return entry.isDirectory();
    })
    .map((entry) => {
      return entry.name;
    });

  names.sort();
  for (const id of names) {
    const file = path.join(skillsDir, id, "SKILL.md");
    const isFile = statSync(file, { throwIfNoEntry: false })?.isFile();
    if (!isFile) {
      continue;
    }

    const { header, body } = splitFrontmatter(readFileSync(file, "utf8"), file);
    const description = scalar(header, "description");
    if (!description) {
      throw new Error(`Missing description in ${file}`);
    }

    skills.push({
      id,
      name: scalar(header, "name") || id,
      description,
      path: file,
      content: body,
    });
  }

  return skills;
}

/**
 * Load every agent from the agents directory.
 *
 * @returns {Array<AgentRegistration>} Agents in path order.
 */
function loadAgents() {
  const agents = [];

  for (const { file, id } of walkMd(agentsDir)) {
    const { header, body } = splitFrontmatter(readFileSync(file, "utf8"), file);
    const agent = {
      description: scalar(header, "description") || id,
      mode: scalar(header, "mode") || "subagent",
      system: body.trim(),
    };

    const model = scalar(header, "model")?.match(/^([^/#]+)\/([^#]+)(?:#([^#]+))?$/);
    if (model) {
      const [, providerID, modelID, variant] = model;
      agent.model = { providerID, id: modelID, ...(variant ? { variant } : {}) };
    }

    const color = scalar(header, "color");
    if (color) {
      agent.color = color;
    }

    const permissions = parsePermissions(header);
    if (permissions) {
      agent.permissions = permissions;
    }

    agents.push({ id, agent });
  }

  return agents;
}

/**
 * Load every command from the commands directory.
 *
 * @returns {Array<CommandRegistration>} Commands in path order.
 */
function loadCommands() {
  const commands = [];
  for (const { file, id } of walkMd(commandsDir)) {
    const { header, body } = splitFrontmatter(readFileSync(file, "utf8"), file);
    commands.push({
      name: id,
      description: scalar(header, "description") || id,
      agent: scalar(header, "agent"),
      template: body,
    });
  }

  return commands;
}

/**
 * Build the executable command definition for a loaded command.
 * Running the command switches to its agent, renders `$ARGUMENTS`,
 * and submits the result as a session prompt.
 *
 * @param {object} ctx - Plugin context, for session calls.
 * @param {CommandRegistration} cmd - Loaded command.
 * @returns {object} Command definition for the registry editor.
 */
function buildCommandDefinition(ctx, cmd) {
  return {
    name: cmd.name,
    description: cmd.description,
    execute: async ({ sessionID, prompt, delivery }) => {
      if (cmd.agent) {
        try {
          await ctx.session.switchAgent({ sessionID, agent: cmd.agent });
        } catch {
          // Fall through with the current agent.
        }
      }
      const args = prompt?.text ?? "";
      await ctx.session.prompt({
        ...prompt,
        sessionID,
        text: cmd.template.replaceAll("$ARGUMENTS", args),
        delivery,
      });
    },
  };
}

/**
 * Register skills. Existing IDs are patched; failures are isolated
 * so one rejected skill never takes the others with it.
 *
 * @param {object} ctx - Plugin context.
 * @param {Array<SkillRegistration>} skills - Skills to register.
 * @returns {Promise<void>}
 */
async function registerSkills(ctx, skills) {
  await ctx.skill.transform((editor) => {
    for (const skill of skills) {
      try {
        if (editor.get(skill.id)) {
          editor.update(skill.id, (draft) => {
            Object.assign(draft, skill);
          });
        } else {
          editor.add({ ...skill });
        }
      } catch (error) {
        console.error(`[opencode-security] skipped skill ${skill.id}:`, error);
      }
    }
  });
}

/**
 * Register agents. `update()` upserts, so a same-named user agent
 * keeps its own config and is never overwritten.
 *
 * @param {object} ctx - Plugin context.
 * @param {Array<AgentRegistration>} agents - Agents to register.
 * @returns {Promise<void>}
 */
async function registerAgents(ctx, agents) {
  await ctx.agent.transform((editor) => {
    for (const { id, agent } of agents) {
      try {
        if (!editor.get(id)) {
          editor.update(id, (draft) => {
            Object.assign(draft, agent);
          });
        }
      } catch (error) {
        console.error(`[opencode-security] skipped agent ${id}:`, error);
      }
    }
  });
}

/**
 * Register commands.
 *
 * @param {object} ctx - Plugin context.
 * @param {Array<CommandRegistration>} commands - Commands to register.
 * @returns {Promise<void>}
 */
async function registerCommands(ctx, commands) {
  await ctx.command.transform((editor) => {
    for (const cmd of commands) {
      const definition = buildCommandDefinition(ctx, cmd);
      try {
        const exists = typeof editor.get === "function" && editor.get(cmd.name);
        const canUpdate = typeof editor.update === "function";
        if (exists && canUpdate) {
          editor.update(cmd.name, (draft) => {
            Object.assign(draft, definition);
          });
        } else if (!exists) {
          editor.add(definition);
        }
      } catch (error) {
        console.error(`[opencode-security] skipped command ${cmd.name}:`, error);
      }
    }
  });
}

export default {
  id: "opencode-security",

  /**
   * Load the Markdown suite and register it with OpenCode.
   *
   * @param {object} ctx - Plugin context with transform and session APIs.
   * @returns {Promise<void>}
   */
  async setup(ctx) {
    await registerSkills(ctx, loadSkills());
    await registerAgents(ctx, loadAgents());
    await registerCommands(ctx, loadCommands());
  },
};
