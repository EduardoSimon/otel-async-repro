import { Span, trace } from "@opentelemetry/api";
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
          await characterRequest;
          const episodesRequest = fetch(
            "https://rickandmortyapi.com/api/episode",
            {
              method: "GET",
            }
          );
          await episodesRequest;
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
