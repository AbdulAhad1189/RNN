# RNN — RECURRING

RECURRING is an interactive visual story about recurrent neural networks (RNNs), inspired by Jeffrey L. Elman’s 1990 paper, “Finding Structure in Time.”

Research papers are vital, but the ideas inside them can feel difficult to approach through dense prose, equations, and static diagrams alone. I made RECURRING to make one foundational idea easier to experience: a network processes a sequence while carrying context from earlier moments into the present.

The project uses scroll-based storytelling, SVG diagrams, and small interactions to explain recurrence, hidden state, learning through time, vanishing gradients, and the later development of LSTM. It is an educational companion to the research, not a replacement for reading it. Historical claims and experimental demonstrations are labeled so the distinction between Elman’s paper, later research, and modern explanation remains clear.

## Run the project

Requirements: Node.js 20.9 or newer.

```bash
cd recurring
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For setup, research notebooks, generated data, deployment, and project details, see the [RECURRING README](recurring/README.md).

## Research starting point

Jeffrey L. Elman, “Finding Structure in Time,” *Cognitive Science*, 14(2), 179–211 (1990). [Original paper](https://doi.org/10.1207/s15516709cog1402_1).
