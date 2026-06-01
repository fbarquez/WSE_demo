# STARTEAM Digitalization Roadmap Demo

Browser-based prototype for showing how Jira-style roadmap data can become an interactive stakeholder dashboard.

## What It Does

- Shows project KPIs, status distribution, recent changes, roadmap phases and stakeholder insights.
- Filters by department, status, priority, deadline window and search text.
- Opens project detail modals from rows, roadmap cards and recent changes.
- Imports a Jira-like CSV file directly in the browser.
- Saves the latest imported CSV data and filters in `localStorage` for repeat demos.
- Exports the current filtered view back to CSV.

## Run Locally

Open `index.html` directly in a browser.

No build step, server or package install is required.

## Demo CSV

Use `sample-jira-export.csv` with the **Import Jira CSV** button.

Supported columns include:

- `issue_key`
- `summary`
- `assignee`
- `status`
- `priority`
- `due_date`
- `labels` or `departments`
- `linked_issues`
- `topic`
- `progress`
- `phase`
- `updated`
- `description`
- `notes`

Required fields are flexible. Missing values are filled with demo-safe defaults.

## GitHub Pages

This repository includes a GitHub Pages workflow. After pushing to `main`, GitHub Actions can publish the static demo as a Pages site.

In the repository settings, set Pages to use **GitHub Actions** as the source if it is not already enabled.

## File Structure

- `index.html`: page markup
- `styles.css`: visual layout and responsive behavior
- `app.js`: dashboard logic, CSV import/export and local persistence
- `assets/starteam-logo.png`: logo asset
- `sample-jira-export.csv`: demo import file
