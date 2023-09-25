import { Span, trace, context, createContextKey } from "@opentelemetry/api";
import { useState } from "react";
import "./App.css";
import { provider } from "./loadInstrumentation";

const tracer = trace.getTracer("app-tracer");

function App() {
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    tracer.startActiveSpan(
      "complex_flow_with_two_requests",
      async (span: Span) => {
        try {
          const characterRequest = fetch(
            "https://rickandmortyapi.com/api/character",
            {
              method: "GET",
            }
          );
          // get currently active context after startActiveSpan
          const ctx = context.active();

          // create a context key to assign the active context to
          const ctxKey = createContextKey('complex_flow_with_two_requests_key')

          // explicitly set the context by wrapping async functions
          context.with(ctx.setValue(ctxKey, 'character request'), async () => {
            await characterRequest;
          });

          const episodesRequest = fetch(
            "https://rickandmortyapi.com/api/episode",
            {
              method: "GET",
            }
          );

          // explicitly set the context by wrapping async functions
          context.with(ctx.setValue(ctxKey, 'episode request'), async () => {
            await episodesRequest;
          });

        } catch (e) {
          setError("Something bad happened");
          console.log(e);
        }
        span.end();
        provider.forceFlush();
      }
    );
  };
  return (
    <>
      <h1>Demo lost context in async</h1>
      <div className="card">
        <button
          className="button"
          onClick={async () => {
            await onSubmit();
          }}
        >
          Test
        </button>
        <p>
          Check the console's network tab. The parent ids should be set to the
          root span.
        </p>
        {error && <p>{error}</p>}
      </div>
    </>
  );
}

export default App;
