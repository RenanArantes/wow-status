Here is a draft for your README.md file:

# WoW Status

WoW Status is a Node.js application that checks the status of World of Warcraft servers from Blizzard's status page and verifies if the servers are online or offline.
## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)

## Installation
To install the necessary dependencies, run the following command:
```markdown
npm install
```

## Usage

To start the application and capture the status data, you can run the following command:

```bash
npm run capture
```

This will launch a Puppeteer instance to navigate to the status pages of various World of Warcraft regions, extract the status data, and save it to JSON files.

## Scripts

- `start`: Runs the main application (currently not specified).
- `capture`: Captures the status data from the specified World of Warcraft server status pages.
- `clicks`: Runs the `testClick.js` script (purpose not specified).
- `test`: Placeholder for running tests (currently not implemented).

## Dependencies

- `axios`: ^1.7.7
- `cheerio`: ^1.0.0
- `express`: ^4.21.0
- `puppeteer`: ^23.4.0


Feel free to customize it further based on your project's specific details and needs.
