# Wellbeing Pulse

[View the deployed Wellbeing Pulse project here](https://wxrren.github.io/Feb-Hackathon/)

This app has been created as a project during [Code Institute](https://codeinstitute.net/)’s February Hackathon 2026

![An image showing the website being responsive across multiple devices](/responsive-image.png)

## Table of Contents
- [Website Goals](#website-goals)
    - [Wellbeing \& Loneliness Dashboard](#wellbeing--loneliness-dashboard)
    - [Make Wellbeing Data Understandable](#make-wellbeing-data-understandable)
- [User Experience](#user-experience)
    - [User Stories](#user-stories)
    - [First Time User](#first-time-user)
    - [Returning User](#returning-user)
    - [Frequent User Goals](#frequent-user-goals)
- [Design](#design)
    - [Colour Scheme](#colour-scheme)
    - [Imagery](#imagery)
    - [End Product Design Changes](#end-product-design-changes)
    - [Data Visualisation Design](#data-visualisation-design)
        - [Trend Line Chart](#trend-line-chart)
        - [Loneliness Distribution Bar Chart](#loneliness-distribution-bar-chart)
        - [Choropleth Map](#choropleth-map)
    - [Typography](#typography)
    - [Design Philosophy](#design-philosophy)
- [Features](#features)
- [Existing Features](#existing-features)
    - [Dashboard Home (Landing dashboard view)](#dashboard-home-landing-dashboard-view)
    - [Level Selection (National / Country / Region)](#level-selection-national--country--region)
    - [Filters Panel](#filters-panel)
    - [KPI Summary Cards](#kpi-summary-cards)
    - [Trend Line Chart](#trend-line-chart-1)
    - [Comparison Bar Chart](#comparison-bar-chart)
    - [Choropleth Map](#choropleth-map-1)
    - [Responsive Design](#responsive-design)
- [Technologies Used](#technologies-used)
    - [Frontend](#frontend)
        - [React](#react)
        - [Vite](#vite)
        - [Tailwind CSS](#tailwind-css)
    - [Data Visualization](#data-visualization)
        - [react-plotly.js](#react-plotlyjs)
        - [Plotly.js](#plotlyjs)
    - [Data \& Logic](#data--logic)
        - [JSON Data Source](#json-data-source)
        - [Custom Hooks](#custom-hooks)
        - [Memoization](#memoization)
- [Deployment and local development](#deployment-and-local-development)
    - [GitHub Pages (Vite + GitHub Actions)](#github-pages-vite--github-actions)
    - [2. Enable GitHub Pages](#2-enable-github-pages)
    - [3. Deployment Workflow](#3-deployment-workflow)
    - [4. Deploying Updates](#4-deploying-updates)
    - [5. Live Site](#5-live-site)
- [Forking the Repository](#forking-the-repository)
- [Local Clone](#local-clone)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Open Terminal or Git Bash](#2-open-terminal-or-git-bash)
    - [3. Clone the Repository](#3-clone-the-repository)
    - [4. Install Dependencies](#4-install-dependencies)
    - [5. Run the Development Server](#5-run-the-development-server)
    - [6. Build for Production (Optional)](#6-build-for-production-optional)
- [Important Notes (Vite + GitHub Pages)](#important-notes-vite--github-pages)
- [Summary](#summary)
- [Data Licensing](#data-licensing)
- [Credits](#credits)

---

## Website Goals

### Wellbeing & Loneliness Dashboard

The goal of this project is to create an interactive, emotionally meaningful data dashboard that helps users explore wellbeing and loneliness trends across Great Britain.

### Make Wellbeing Data Understandable

We took a public UK ONS(Office for National Statistics) dataset on personal wellbeing and loneliness (Jan 2025–Jan 2026) and transformed this cleaned statistical data into clear, interactive visualisations so users can:

- Track wellbeing trends over time

- Compare countries and regions within the UK

- Understand loneliness patterns

- Explore anxiety and happiness changes

The dashboard turns raw JSON data into something human-readable and intuitive.

---

## User Experience

### User Stories

To determine which approach to take with dashboard features, we identified the goals of different users — from first-time visitors exploring the data to returning and frequent users analysing trends.

### First Time User

- As a user, I want to understand what the dashboard is showing and what type of data it contains.

- As a user, I want to understand the difference between national, country, and regional views.

- As a user, I want to easily change filters (level, quarter, metric, geography) to explore the data.

- As a user, I want to see clear visualisations so I can quickly understand wellbeing trends without needing technical knowledge.

- As a user, I want KPI summaries so I can grasp key figures at a glance.

- As a user, I want to understand what each metric represents (e.g., wellbeing index, anxiety, loneliness rates).

- As a user, I want to see how wellbeing changes over time through a clear trend line chart.

### Returning User

- As a user, I want to revisit specific geographies (e.g., Scotland or a specific region) to check how trends have changed.

- As a user, I want to compare different metrics (e.g., anxiety vs happiness) across quarters.

- As a user, I want to identify which regions perform better or worse within a selected quarter.

- As a user, I want to explore loneliness distribution in more detail.

- As a user, I want the dashboard to respond quickly when I adjust filters.

### Frequent User Goals

- As a user, I want to quickly switch between geographic levels to analyse trends efficiently.

- As a user, I want to identify patterns such as volatility, spikes, or improvements over time.

- As a user, I want consistent layout and interaction patterns so I can navigate confidently.

- As a user, I want a clean, modern interface without unnecessary clutter.

- As a user, I want the data visualisations to feel responsive and professional.

---

## Design

### Colour Scheme

The Wellbeing & Loneliness Dashboard was designed to balance **emotional storytelling** with **analytical clarity**.

Primary colours and their purpose:

- **Accent Colour (Pink)**  
  Used for active tabs (for example, **National**).  
  Communicates warmth and emotional awareness, while clearly showing selected states.

- **Soft Whites & Light Greys**  
  Used for cards, panels, and layout structure.  
  Keeps the interface clean and modern, while allowing charts to stand out.

- **Blue Line Charts**  
  Used for trend visualisation.  
  Reinforces trust, stability, and readability over time-series data.

- **Multi-colour Categorical Bars (Loneliness chart)**  
  Used to differentiate loneliness frequency categories clearly.  
  Supports quick interpretation and visual comparison.

Overall, the palette supports:

- Emotional context (imagery)
- Analytical clarity (muted panels)
- Strong interaction feedback (pink highlights)

### Imagery

A full-screen background image of a child jumping with raised arms was intentionally selected to represent:

- Energy
- Emotional expression
- Wellbeing in its human form

This prevents the dashboard from feeling cold or purely statistical and reinforces that the data reflects real people and lived experiences.

To maintain readability over the image, dashboard sections are placed inside semi-transparent white cards. This creates:

- Strong contrast for data visualisation
- Clear separation between sections
- A softer, more approachable interface

### End Product Design Changes

The final design follows a layered dashboard hierarchy for intuitive exploration:

1. **Context First**  
   Dashboard title and selected-filter summary immediately explain what the user is viewing.

2. **Control Layer**  
   Level tabs (National / Country / Region) and filter panel (Quarter, Metric, Geography) define a clear interaction zone.

3. **Summary Layer**  
   KPI cards present key values up front for rapid understanding.

4. **Visual Insight Layer**  
   Visualisations progress logically from:
   - Time-based trends
   - Cross-geography comparison
   - Category distribution
   - Spatial pattern analysis

This structure supports deeper insight without overwhelming the user.

### Data Visualisation Design

#### Trend Line Chart

- Smooth line with markers
- Minimal grid styling
- Clear quarter labels
- Styling prioritises readability over decoration
- Designed to highlight movement and fluctuation over time

#### Loneliness Distribution Bar Chart

- Distinct colour coding by frequency level
- Clear legend placement
- Simple vertical bars for quick interpretation
- Built for categorical clarity and comparison

#### Choropleth Map

- Gradient from lighter to darker red tones
- Subtle borders between regions
- Clear legend for interpretation

This turns numerical scores into geographic storytelling and helps users identify:

- Higher-performing areas
- Regional variation
- UK-wide spatial patterns

### Typography

Typography is designed for clarity and hierarchy using a clean, modern sans-serif font that:

- Renders consistently across devices
- Loads quickly
- Maintains readability at all screen sizes

Hierarchy includes:

- Bold dashboard title
- Medium-weight section headings
- Large KPI values
- Muted contextual labels

This improves scanability and reduces cognitive load.

### Design Philosophy

Core design principles:

1. **Human-Centred**  
   The imagery keeps focus on lived human experience behind the data.

2. **Clean & Structured**  
   Card-based layout reduces clutter and supports focused attention.

3. **Insight-Driven**  
   Visualisations are arranged in a logical sequence to guide interpretation.

4. **Interactive Without Overwhelming**  
   Minimal stored state, clear filters, and immediate visual feedback keep interaction smooth and intuitive.

---

---

## Features

- View national, country, and regional wellbeing data.

- Switch between multiple wellbeing and loneliness metrics.

- Filter data by quarter.

- Select specific geographies to explore trends.

- View KPI summary cards for selected filters.

- Visualise trends over time using interactive line charts.

- Compare geographies within a selected quarter.

- View loneliness distribution through stacked bar visualisations.

- Explore geographic patterns through a choropleth map.

- Responsive across all device sizes.

## Existing Features

### Dashboard Home (Landing dashboard view)

- The first view when opening the site.

- Displays selected level, quarter, metric, and geography clearly in the header.

- Provides an immediate overview of wellbeing data through KPI cards and charts.

- Clean, modern layout designed for quick comprehension.

### Level Selection (National / Country / Region)

- Allows users to switch between:

- GB National (Great Britain)
  - Country (England, Scotland, Wales)

  - Region (English regions)

- Automatically updates filters and visualisations based on selection.

- Keeps state minimal and derived from user interaction.

### Filters Panel

- Allows users to:
  - Select quarter (Q1–Q4)

  - Select metric (wellbeing index, happiness, anxiety, loneliness, etc.)

  - Select geography (based on chosen level)

- All charts and KPIs update dynamically when filters change.

- Ensures users can explore data intuitively.

### KPI Summary Cards

- Displays key metric values for the selected level, quarter, and geography.

- Provides quick insight without requiring users to analyse charts.

- Designed for clarity and immediate understanding.

### Trend Line Chart

- Shows how the selected metric changes over time for the chosen geography.

- Uses Plotly interactive charts.

- Allows users to visually identify:
  - Trends

  - Spikes

  - Stability

  - Volatility

- Responds dynamically to filter changes.

### Comparison Bar Chart

- Displays selected metric across all geographies within the chosen level and quarter.

- Helps users identify:
  - Best performing geography

  - Lowest performing geography

  - Relative ranking

- Encourages comparative insight.

### Choropleth Map

- Geographic visualisation of wellbeing metrics.

- Highlights regional patterns and potential hotspots.

- Provides strong visual storytelling impact.

- Enables users to quickly interpret geographic differences.

### Responsive Design

- Optimised for desktop, tablet, and mobile devices.

- Charts resize dynamically.

- Layout adjusts for smaller screens without losing usability.

---

## Technologies Used

### Frontend

#### React

- Used as the core framework for building the user interface.

- Component-driven architecture supports reusability and clarity.

- Makes dynamic filtering and data-driven rendering straightforward.

#### Vite

- A fast frontend build tool that supports React out of the box.

- Provides instant server start and lightning-fast hot-module replacement.

- Ideal for modern JS application development and deployment workflows.

#### Tailwind CSS

- Utility-first styling framework for rapid UI development.

- Provides consistent spacing, typography, and responsive design without writing traditional CSS.

- Helps enforce a clean, modern visual design across the dashboard.

### Data Visualization

#### react-plotly.js

- The React wrapper for Plotly charts.

- Enables highly interactive charts that respond to user filters.

- Used to render:
  - Trend line charts (wellbeing over time)

  - Comparison bar charts (side-by-side geographies)

  - Stacked bar charts (loneliness distribution)

#### Plotly.js

- The underlying charting library powering all visualisations.

- Offers tooltips, smooth transitions, and responsive designs

### Data & Logic

#### JSON Data Source

- The cleaned dataset wellbeing_master.json drives all visualisation, filtering, and insight generation.

- Loaded once and shared across components via a custom hook.

#### Custom Hooks

- useWellbeingData() handles:
  - Fetching the data

  - Deriving lists like quarters, metrics, geographies

  - Exposing data for filtering and use in components

#### Memoization

- useMemo is used to derive filtered datasets efficiently.

- Prevents unnecessary recalculations and improves performance.

---

## Deployment and local development

### GitHub Pages (Vite + GitHub Actions)

This project is deployed using GitHub Pages with GitHub Actions to automatically build and publish the Vite application.

To deploy the live version of the website:

- Log in to GitHub and locate the repository
  - Open the project [repository:](https://github.com/Wxrren/Feb-Hackathon)

### 2. Enable GitHub Pages

1. Click **Settings** at the top of the repository.
2. In the left sidebar, select **Pages** under **Code and automation**.
3. Under **Build and deployment**, ensure:
   - **Source** is set to: `GitHub Actions`

This ensures deployment runs via the workflow file instead of publishing a branch directly.

### 3. Deployment Workflow

This project uses a GitHub Actions workflow located at:

`.github/workflows/deploy.yml`

The workflow:

- Installs dependencies
- Builds the Vite app (`npm run build`)
- Uploads the `dist` folder
- Deploys automatically to GitHub Pages

Deployment triggers when:

- Code is pushed to the `main` branch, or
- The workflow is manually run from the **Actions** tab

### 4. Deploying Updates

To deploy changes:

```bash
git add .
git commit -m "Update dashboard"
git push origin main
```

Then:

1. Go to the **Actions** tab in GitHub.
2. Wait for the workflow to complete (green checkmark).
3. The site updates automatically.

It may take **1–3 minutes** for the updated version to appear.

### 5. Live Site

Once deployed, the live site can be accessed at:

https://wxrren.github.io/Feb-Hackathon/

You can also find this link under:

**Settings → Pages**

---

## Forking the Repository

Forking allows you to create your own copy of the repository without affecting the original.

1. Open the repository:  
   https://github.com/Wxrren/Feb-Hackathon
2. Click the **Fork** button in the top-right corner.
3. Select your GitHub account as the destination.

You now have your own version of the project.

---

## Local Clone

To run the project locally:

### 1. Clone the Repository

1. Open the repository.
2. Click the **Code** button.
3. Copy the HTTPS or SSH URL.

Example:

`https://github.com/Wxrren/Feb-Hackathon.git`

### 2. Open Terminal or Git Bash

Navigate to the directory where you want the project:

```bash
cd path/to/your/folder
```

### 3. Clone the Repository

```bash
git clone https://github.com/Wxrren/Feb-Hackathon.git
```

### 4. Install Dependencies

Navigate into the Vite app folder and install dependencies:

```bash
cd Feb-Hackathon/hackathon-app
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

The app runs locally at:

`http://localhost:5173`

### 6. Build for Production (Optional)

To generate a production build:

```bash
npm run build
```

The compiled output is located in:

`hackathon-app/dist`

---

## Important Notes (Vite + GitHub Pages)

- The `base` setting in `vite.config.js` must be:

  ```js
  base: '/Feb-Hackathon/';
  ```

- The workflow builds from:

  `hackathon-app/`

- The `dist` folder is deployed automatically by GitHub Actions.

---

## Summary

Deployment is fully automated:

1. Push to `main`
2. GitHub Actions builds the project
3. The `dist` folder is published
4. GitHub Pages updates automatically

No manual uploading is required.

## Data Licensing

Contains Ordnance Survey, Office of National Statistics, National Records Scotland and LPS Intellectual Property data © Crown copyright and database right [2016].

Licensed under the Open Government Licence v3.0:
http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3

See LICENSE_DATA.md for full attribution details.

## Credits

This Project was created by the Wellbeing Pulse team.

- [Chrysanthus](https://github.com/chrysanthusobinna)
- [Robert S. Elliott](https://github.com/RSE1982)
- [Simon](https://github.com/motogoatUK)
- [Warren Smith](https://github.com/Wxrren)
