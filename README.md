#CorIO 1.1.0 RELEASE

##What's new:

###Completely redesigned UI

The design code has been completely rewritten.

All interface elements are now visually integrated into the background while remaining easy to read. The elements blend seamlessly with the background and maintain their readability primarily through carefully designed shadows.

###Fixed bugs in system scripts

A critical bug in the installation script prevented backend.sh from reading files at all. This issue has been fixed in the new version.

Cockpit application added

Cockpit Project is a web-based server management interface for Linux servers. In CorIO, it replaces the traditional system settings panel.

##What's next:

The next version is planned to introduce personalization settings for the CorIO Shell.

For now, we've reached the end of our current ideas. In the shortest possible time, we created a beautiful, lightweight shell that can run on almost any potato.

If you have any feedback, ideas, or suggestions, feel free to contact us at <b>cameneye@inbox.ru</b>

## Installation

### 1. Clone the repository

Install the `git` package if you haven't already:

```bash
git clone https://github.com/yareeekc/CorIO.git
```

### 2. Run the installation script as root

```bash
sudo ./install.sh
```

**Note:** If you get a permissions error, make the script executable:

```bash
chmod +x ./install.sh
```

Then run the installation command again.

### 3. One last step!

To launch CorIO, run:

```bash
corio
```

## Important Note

This version does **not** include a `systemd` service for automatically starting the shell when the system boots.

We apologize for the inconvenience.

## For Developers

### Backend.sh

To execute Bash commands from JavaScript, use the `fetch` method with the following endpoint:

```text
http://localhost:2345/exec/YOUR_COMMAND
```

To get the command output, use `fetch` and store the response in a variable. For example:

```javascript
let commandOutput = await fetch(
    "http://127.0.0.1:2345/exec/" + encodeURIComponent(YOUR_COMMAND)
).then(response => response.text());
```

The command output will then be stored in the `commandOutput` variable.

### IOA — Application Archive

A file with the `.ioa` extension is a **CorIO application installer**.

It is simply a regular ZIP archive with a different file extension:

```text
template.zip → template.ioa
```

The following files and directories **must** be present in the root of the archive. Everything else is up to you:

```text
index.html
ioai/
    appName.ioai
icons/
    logo.ico
```

#### `index.html`

The application itself.

#### `ioai/appName.ioai`

This file must contain exactly **one word**: the name of your application.

**NO SPACES OR SPECIAL CHARACTERS!**

This name will not be modified by the system to create a "prettier" display name for the user.

#### `icons/logo.ico`

The application's icon.

The recommended size is **128×128 px**.

You can also use the `icons` directory to store any additional icons required by your application.

---

Thank you for staying with us!

**Yareeek, with love :3**

**Translated with ChatGPT from Russian**
