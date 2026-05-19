# lmsaworthy
LMS for A-worthy.com

## AI Auto-Grading

Tutors can auto-grade student submissions (`.docx`, `.pdf`, photos of handwritten
work) using Claude. Pre-built rubrics cover Cambridge GP, O-Level English, and
H1/H2 Economics; each homework's rubric can be overridden per task.

**Setup:** Add `ANTHROPIC_API_KEY` to your Vercel project's environment variables.
Get a key from [console.anthropic.com](https://console.anthropic.com). Optionally
override `ANTHROPIC_GRADING_MODEL` (defaults to `claude-sonnet-4-6`).

**Usage:**
- *Inside Homework:* set a marking rubric when creating an assignment, then click
  "✨ Auto-grade" on any submitted work. The AI's grade + criterion breakdown
  pre-fills the grading panel for you to review and adjust before saving.
- *Standalone:* the "AI Marker" page under Manage handles ad-hoc submissions that
  aren't tied to a homework.

Without `ANTHROPIC_API_KEY`, the rest of the LMS works as before; only the
auto-grading buttons will fail with a clear error message.
