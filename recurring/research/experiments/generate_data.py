"""Generate the small scalar recurrence teaching curve used by the experiment.

This is a didactic synthetic model, not a reproduction of Elman's experiments.
Run with Python and PyTorch installed: python research/experiments/generate_data.py
"""
from __future__ import annotations

import csv
import json
from pathlib import Path

import torch

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "research" / "data"
OUT.mkdir(parents=True, exist_ok=True)

# A scalar linear recurrence makes the local derivative transparent.
steps = torch.arange(0, 65, dtype=torch.float64)
retentions = (0.72, 0.88, 0.96)
curves = []
for retention in retentions:
    values = torch.pow(torch.tensor(retention, dtype=torch.float64), steps)
    curves.append({"retention": retention, "values": [round(float(v), 8) for v in values]})

payload = {
    "description": "Synthetic scalar recurrence, signal magnitude r^n. Not a measured result.",
    "model": "s_t = r * s_(t-1); |ds_t/ds_0| = |r|^t",
    "points": [{"step": int(n), "value": round(float(torch.pow(torch.tensor(0.82, dtype=torch.float64), n)), 8)} for n in steps[::4]],
    "curves": curves,
}
(OUT / "gradient_decay.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
with (OUT / "gradient_decay.csv").open("w", newline="", encoding="utf-8") as handle:
    writer = csv.writer(handle)
    writer.writerow(["step", *[f"retention_{r:.2f}" for r in retentions]])
    for i, n in enumerate(steps.tolist()):
        writer.writerow([int(n), *[curve["values"][i] for curve in curves]])

# A separate true autograd run through a nonlinear scalar recurrent system.
# Each row measures |d h_T / d h_0| for the stated fixed setup.
weight = 0.95
autograd_rows = []
for length in range(0, 65):
    h0 = torch.tensor(0.1, dtype=torch.float64, requires_grad=True)
    state = h0
    for _ in range(length):
        state = torch.tanh(weight * state + 0.1)
    (gradient,) = torch.autograd.grad(state, h0)
    autograd_rows.append({"steps": length, "gradient_magnitude": abs(float(gradient))})
autograd_payload = {
    "description": "PyTorch autograd derivatives for a fixed scalar tanh recurrence; illustrative experiment, not Elman (1990) data.",
    "model": "h_t = tanh(0.95 * h_(t-1) + 0.1), h_0 = 0.1; reported quantity is |d h_T / d h_0|",
    "weight": weight,
    "rows": autograd_rows,
}
(OUT / "autograd_gradient.json").write_text(json.dumps(autograd_payload, indent=2) + "\n", encoding="utf-8")
with (OUT / "autograd_gradient.csv").open("w", newline="", encoding="utf-8") as handle:
    writer = csv.DictWriter(handle, fieldnames=["steps", "gradient_magnitude"])
    writer.writeheader()
    writer.writerows(autograd_rows)
print(f"Generated {OUT / 'gradient_decay.json'}, gradient_decay.csv, autograd_gradient.json, and autograd_gradient.csv")
