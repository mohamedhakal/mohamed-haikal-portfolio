const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submitBtn = form?.querySelector(".contact-form__submit");
const submitText = form?.querySelector(".contact-form__submit-text");
const submitLoading = form?.querySelector(".contact-form__submit-loading");

const FORM_ENDPOINT = "https://formsubmit.co/he1is1mohamed@gmail.com";

function showStatus(message, type) {
  if (!status) return;
  status.textContent = message;
  status.className = `contact-form__status${type ? ` contact-form__status--${type}` : ""}`;
}

function setSubmitting(isSubmitting) {
  if (!submitBtn || !submitText || !submitLoading) return;
  submitBtn.disabled = isSubmitting;
  submitText.hidden = isSubmitting;
  submitLoading.hidden = !isSubmitting;
}

function setupFormSubmit() {
  const nextInput = form.querySelector('input[name="_next"]');
  const replyToInput = form.querySelector('input[name="_replyto"]');

  if (nextInput && window.location.protocol !== "file:") {
    const nextUrl = new URL(window.location.href);
    nextUrl.search = "?sent=1";
    nextInput.value = nextUrl.toString();
  }

  form.setAttribute("action", FORM_ENDPOINT);
  form.setAttribute("method", "POST");

  form.addEventListener("submit", (e) => {
    if (window.location.protocol === "file:") {
      e.preventDefault();
      showStatus(
        "Cannot send from a local file. Use the live site or run a local web server.",
        "error"
      );
      return;
    }

    if (!form.checkValidity()) {
      e.preventDefault();
      form.reportValidity();
      return;
    }

    const emailField = form.querySelector("#email");
    if (replyToInput && emailField) {
      replyToInput.value = emailField.value;
    }

    setSubmitting(true);
    showStatus("Sending your message...");
  });
}

const params = new URLSearchParams(window.location.search);

if (params.get("sent") === "1") {
  showStatus("Message sent successfully. I'll get back to you soon.", "success");
  window.history.replaceState({}, "", window.location.pathname);
}

if (window.location.protocol === "file:") {
  showStatus(
    "Open this page through a web server or the live site to send messages.",
    "error"
  );
}

if (form) {
  setupFormSubmit();
}
