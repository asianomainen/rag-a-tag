export const helpCommand = (commandRegistry) => {
    const commandDescriptions = Object.entries(commandRegistry)
        .map(([command, {description}]) => `- ${command}: ${description}`)
        .join('\n')

    return `Available Commands:\n${commandDescriptions}`
}
