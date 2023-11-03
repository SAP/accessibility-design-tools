# Accessibility Design Tools Figma Plugins

## About this project

The Accessibility Design Tools Figma plugin offers a subset of annotations of the [Accessibility Design Tools Figma library](https://www.figma.com/community/file/1301101696020142882) for designers. It is intended to annotate accessibility-relevant information in application and control visual and interaction design before handover to development.

The related [Figma plugin](https://www.figma.com/community/plugin/1072563579293318294/accessibility-design-tools), the	[Accessibility Design Tools Figma library](https://www.figma.com/community/file/1301101696020142882) and the full library [documentation](https://experience.sap.com//wp-content/uploads/files/guidelines/Uploads/Accessibility/AccessibilityDesignToolsDocumentation.pdf) are also available now.

Please provide all feedback to this e-mail: [a11ydesigntools@sap.com](mailto:a11ydesigntools@sap.com).

## Plugin useage

Each of the plugins contain a quick reference (Info "i") how to use them on existing Figma stencils within Application UI Design.

## Requirements and Setup

The plugin sources are located in the *ACCAssets* folder of this repository. They have to be installed in a typical project structure for Figma Plugin development with an IDE like VS Code. 

Please note that the required Figma *node _modules* subdirectory in the *ACCAssets* folder to run the plugins is NOT part of this distribution and should be created as part of the code setup according to Figma plugin development documentation.

The [Figma desktop app](https://www.figma.com/downloads/): Plugin development and testing requires the Figma desktop app. Figma will need to read your plugin code saved as a local file. You can download Figma from the [Figma downloads page](https://www.figma.com/downloads/). If you already have the desktop app installed, make sure you’re running the latest version.
[Visual Studio Code](https://code.visualstudio.com/): This is the development environment you’ll be using.

For setup of dev environment, please read the Figma [Plugin QuickStart Guide](https://www.figma.com/plugin-docs/plugin-quickstart-guide/):
 
- To test the general workflow, it is recommended to [create a basic example plugin project from the scratch](https://www.figma.com/plugin-docs/plugin-quickstart-guide/#create-a-new-plugin). 
- For project dependencies, install then Node and Npm from [Nodejs.org](https://nodejs.org/en/) website. When you download Node, your download also includes npm.
- Install [Typescript compiler tsc](https://code.visualstudio.com/docs/languages/typescript) for Visual Studio Code if not automatically installed by Node.js Setup Wizard.
- Go to the root folder of your project. In the Visual Studio Code terminal type "npm install" and press Enter. This will create the node_modules subfolder in your test project.

As a final step, either replace the code in the basic plugin structure by file content of this project or install the project somewhere in the file system and execute a "npm install" in its root which will give you the node_modules folder as subfolder.

For more details, please contact the respective [Figma plugin development documentation](https://www.figma.com/plugin-docs/). 

## Support, Feedback, Contributing

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/SAP/accessibility-design-tools/issues). Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](CONTRIBUTING.md).

## Security / Disclosure
If you find any bug that may be a security problem, please follow our instructions at [in our security policy](https://github.com/SAP/accessibility-design-tools/security/policy) on how to report it. Please do not create GitHub issues for security-related doubts or problems.

## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone. By participating in this project, you agree to abide by its [Code of Conduct](https://github.com/SAP/.github/blob/main/CODE_OF_CONDUCT.md) at all times.

## Licensing

Copyright 2023 SAP SE or an SAP affiliate company and <accessibility-design-tools> contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/SAP/accessibility-design-tools).
