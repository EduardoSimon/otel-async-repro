# Reproduction Repository for missing context in manual span

The present repository aims to showcase a problem caused when trying to **manually** instrument a trace split by an async/await block. Please refer to the [App component](./src/App.tsx) to check the implementation out.


# Prerequisites

- Node (Optional)
- 🐳 Docker

# Usage

## For Node users

1. Install dependencies:

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open the [web server](http://localhost:5000)

4. Click the Test button in the UI

Note: The node version runs the code in development mode
Note: The node version **outputs** the spans to the **console**.

5. Check the console to make sure that the parentIds are not properly set

[Image](./docs/console.png)

## For 🐳 Docker users

1. Start the cluster

```bash
make start
```
2. Open the [web server](http://localhost:8080)

3. Click the Test button in the UI

4. Check the trace 

Visit [Jaeger](http://localhost:16686/) to debug the trace

You should see the trace disconnected in [Jaeger](./docs/jaeger.png)

Note: The docker version runs the code in production, using an nginx to serve the static files and act as a proxy before the otel collector. Doing that, we avoid CORS-related issues.
Note: The docker version **outputs** the spans to **Jaeger**.
