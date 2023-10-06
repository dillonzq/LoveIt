---
author: "Marc Cubells"
title: "Streamlining Google Apps Script with Clasp"
subtitle: "Build Google Apps Script apps locally with clasp"
description: "Elevate Your Workflow: Easy App Development with Google Apps Script"
date: "2023-10-04"

tags: ["development", "tools", "clasp","gas"]
header_img: "img/google_apps_script/header_img.png"
toc: true
series: ["Themes Guide"]
comment: true

draft: false
---

Google Apps Script (GAS) is not just another application development platform; it's a powerful JavaScript library tailored to interact seamlessly with the G Suite applications. With GAS, you can create bespoke solutions, optimize workflows, and derive maximum value from the G Suite ecosystem. Whether you're a seasoned developer or a business professional, GAS provides the tools to transform your ideas into functional applications.

![Google_Apps_Script](google_apps_script_1.png)

## Key Features of GAS

- **Custom Menus in G Suite Apps**: Enhance Google Sheets or Docs with tailored menus that initiate your scripts.
- **Automate Workflows**: Design scripts to send Gmails based on specific criteria, automating routine tasks.
- **Integrate Google Services**: Seamlessly sync data between Sheets and Google Contacts or automate Google Calendar event additions from form submissions.
- **Custom Functions for Google Sheets**: Elevate your data processing in Sheets by crafting your own functions.
- **Web App Development**: Design and deploy web applications using GAS for internal or external users.

## Advantages of GAS

- **Cost-Efficiency**: Eliminate the need for costly third-party integrations with this free offering from Google.
- **Flexibility**: Customize solutions to meet specific requirements.
- **Security**: Rely on the robust security infrastructure that Google provides for its applications.

## The Challenge: GAS's Built-in IDE

While GAS provides an integrated development environment (IDE) that facilitates quick scripting, it's not without its limitations. Developers often find challenges in:

- Synchronizing their scripts with platforms like GitHub.
- The absence of features that are standard in popular editors like [Visual Studio Code](https://code.visualstudio.com).
- Organizing complex codebases efficiently.

<!-- TODO: Insert a screenshot of the GAS Built-in IDE -->
## The Solution: clasp

![clasp](clasp.png)

Enter `clasp` (Command Line Apps Script Projects). Clasp allows you to bridge the gap between GAS's IDE and your preferred local editor. You will be able to synchronize between the GAS remote repository and your local machine, enabling a seamless development experience. With your code now stored locally, you can make use of your preffered IDE and push to remote repositories like GitHub.

<!-- TODO: Insert a diagram that links the GAS Remote Repo with VS Code with GitHub Repo -->

## Setting Up clasp: A Step-by-step Guide

To help you integrate clasp into your GAS development process, here's a detailed walkthrough:

### 1.Install Node.js and NPM

Ensure you have Node.js (version 4.7.4 or later). Download the installer for your platform [here](https://nodejs.org/en/download/current).

After installation, validate with:

```bash
node -v
npm -v
```

### 2. Install clasp

For MacOS or Linux:

```bash
sudo npm i @google/clasp -g
```

If you are using Windows, open the terminal with the action `Run as administrator`:

```bash
npm i @google/clasp -g
```

Post-installation, verify with `clasp -v`.

### 3. Activate the Google Apps Script API

Navigate to the Apps Script Settings page, click on `Google Apps Script API` and toggle the switch to `On`.

![image3](google_apps_script_2.png)

### 4. Authenticate clasp with Your GAS Account

Execute `clasp login` and follow the browser instructions.

```bash
clasp login
```

### 5. Initialise a Node Project

Execute:

```bash
npm init
```

The end result will be a new `package.json` file.

### 6. Retrieve Your GAS Project Files

Use:

```bash
clasp clone + “[ID of your GAS project]”
```

Locate the ID in your GAS remote repository settings:

![image5](google_apps_script_3.png)

As a result, all your GAS files will be created locally on your computer. This will allow you to access them via your preferred IDE.

_Note: Local GAS files use the .js extension, but clasp handles the conversion to .gs seamlessly._

### 7. Push changes to the GAS Remote Repository

Once you have written some code, you can deploy it to the GAS Remote Repository with:

```bash
clasp push
```

Optionally, you can create a `.claspignore` file to list the files that should not be pushed into the GAS Remote Repository.

Alternitely, you can use `clasp push -w`. This option stands for `watch` and it allows clasp to push the code every time you save the file you're working on, so you don't have to run the clasp push command every time.

```bash
clasp push -w
```

You can stop the terminal from listening to changes by pressing `Ctrl + C` on your keyboard.

### 8. Pull changes from the GAS remote repo into your local machine

Use the `clasp pull` command to fetch the latest from the GAS Remote Repository:

```bash
clasp pull
```

## Conclusion

Harnessing the power of Google Apps Script can revolutionize the way you interact with G Suite applications. Coupled with `clasp`, the potential to innovate, automate, and optimize becomes boundless. Whether you're on a quest to amplify efficiency in your daily tasks or to dive deep into the world of automation, GAS and `clasp` offer the resources to transform your ideas into reality.

---

_**References:**_

- [Overview of all clasp features](https://developers.google.com/apps-script/guides/clasp)
