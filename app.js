const sections = [
  { id: "goal", heading: "# Goal" },
  { id: "context", heading: "## Context" },
  { id: "acceptance", heading: "## Acceptance criteria" },
  { id: "constraints", heading: "## Constraints" },
  { id: "verification", heading: "## Verification" },
];

const example = {
  goal: "Add a ‘Copy issue link’ action to each issue card.",
  context:
    "The project is a vanilla JavaScript issue tracker. Issue cards are rendered in app.js, and each issue already has a stable ID.",
  acceptance: [
    "- Each card shows the action.",
    "- Activating it copies the issue’s full URL.",
    "- A successful copy shows brief inline feedback.",
  ].join("\n"),
  constraints:
    "No dependencies. Preserve the existing card layout and keyboard behavior.",
  verification: [
    "Test one card with the mouse and keyboard.",
    "Confirm the copied URL opens the same issue.",
    "Check the layout at 375px wide.",
  ].join("\n"),
};

const emptyMessage = "Your brief will appear here as you add task details.";
const form = document.querySelector("#brief-form");
const output = document.querySelector("#prompt-output");
const copyButton = document.querySelector("#copy-prompt");
const loadExampleButton = document.querySelector("#load-example");
const status = document.querySelector("#copy-status");
let feedbackTimer;

function buildPrompt() {
  return sections
    .map(({ id, heading }) => {
      const value = document.querySelector(`#${id}`).value.trim();
      return value ? `${heading}\n\n${value}` : "";
    })
    .filter(Boolean)
    .join("\n\n");
}

function resetFeedback() {
  window.clearTimeout(feedbackTimer);
  copyButton.textContent = "Copy prompt";
  status.textContent = "";
}

function renderPrompt() {
  const prompt = buildPrompt();

  output.textContent = prompt || emptyMessage;
  output.classList.toggle("is-empty", !prompt);
  copyButton.disabled = !prompt;
  resetFeedback();

  return prompt;
}

function showFeedback(buttonText, message, shouldReset = false) {
  window.clearTimeout(feedbackTimer);
  copyButton.textContent = buttonText;
  status.textContent = message;

  if (shouldReset) {
    feedbackTimer = window.setTimeout(resetFeedback, 1800);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.inset = "0 auto auto -9999px";
  document.body.append(textArea);
  textArea.select();
  textArea.setSelectionRange(0, text.length);

  const copied = document.execCommand("copy");
  textArea.remove();
  copyButton.focus({ preventScroll: true });

  if (!copied) {
    throw new Error("Clipboard copy was not available.");
  }
}

async function writeToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  fallbackCopy(text);
}

function selectOutput() {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(output);
  selection.removeAllRanges();
  selection.addRange(range);
  output.focus({ preventScroll: true });
}

async function copyPrompt() {
  const prompt = buildPrompt();

  if (!prompt) {
    return;
  }

  try {
    await writeToClipboard(prompt);
    showFeedback("Copied", "Prompt copied to your clipboard.", true);
  } catch {
    selectOutput();
    showFeedback(
      "Copy failed",
      "Clipboard access failed. The prompt is selected; press Command/Ctrl + C.",
    );
  }
}

function loadExample() {
  sections.forEach(({ id }) => {
    document.querySelector(`#${id}`).value = example[id];
  });

  renderPrompt();
  status.textContent = "Example loaded. Edit any field to make the brief your own.";
}

form.addEventListener("input", renderPrompt);
form.addEventListener("submit", (event) => event.preventDefault());
copyButton.addEventListener("click", copyPrompt);
loadExampleButton.addEventListener("click", loadExample);

renderPrompt();
