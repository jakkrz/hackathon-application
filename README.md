# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.17.0 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:typography,forms" sveltekit-adapter="adapter:vercel" ai-tools="ide:claude-code,cursor,gemini,opencode,vscode+delivery:plugin+tools:mcp,svelte-code-writer,svelte-core-bestpractices,svelte-file-editor+mcpSetup:local" --install npm hackathon-application
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## S&P 500 financial data

After downloading the SimFin annual income and cash-flow CSVs into `src/fianances/`, run this command from the project root:

```sh
python3 src/fianances/run_simfin_sp500_fcf.py
```

The script refreshes `src/fianances/output_simfin/`, including
`sp500_three_year_financials.csv`. That file has one row per S&P 500 company,
three years of revenue, net income, and operating cash flow, plus
`profitable_years_last_3`.
